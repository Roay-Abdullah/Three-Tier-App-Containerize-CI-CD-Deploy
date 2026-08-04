#!/usr/bin/env bash
# Deploys IMAGE_TAG, health-checks it, and automatically rolls back to the
# last known-good version if the health check fails.
#
# Usage: ./deploy.sh <image-tag>
# Run from the app root on the EC2 host (expects docker-compose.yml and .env there).

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$APP_DIR/.env"
CURRENT_FILE="$APP_DIR/.current_version"
HISTORY_FILE="$APP_DIR/.version_history"
MAX_HISTORY=5
HEALTH_ATTEMPTS=15
HEALTH_DELAY=4

NEW_TAG="${1:?Usage: deploy.sh <image-tag>}"

cd "$APP_DIR"
touch "$CURRENT_FILE" "$HISTORY_FILE"

set_image_tag() {
  local tag="$1"
  if grep -q '^IMAGE_TAG=' "$ENV_FILE" 2>/dev/null; then
    sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=${tag}/" "$ENV_FILE"
  else
    echo "IMAGE_TAG=${tag}" >> "$ENV_FILE"
  fi
}

health_check() {
  for ((i = 1; i <= HEALTH_ATTEMPTS; i++)); do
    if curl -fsS -o /dev/null "http://localhost:5000/api/health" \
       && curl -fsS -o /dev/null "http://localhost:80/"; then
      return 0
    fi
    echo "Health check attempt $i/$HEALTH_ATTEMPTS failed, retrying in ${HEALTH_DELAY}s..."
    sleep "$HEALTH_DELAY"
  done
  return 1
}

deploy() {
  local tag="$1"
  echo "==> Deploying image tag: $tag"
  set_image_tag "$tag"
  docker compose pull
  docker compose up -d --remove-orphans
}

push_history() {
  local old_tag="$1"
  if [[ -n "$old_tag" && "$old_tag" != "$NEW_TAG" ]]; then
    { echo "$old_tag"; cat "$HISTORY_FILE"; } | awk '!seen[$0]++' | head -n "$MAX_HISTORY" > "$HISTORY_FILE.tmp"
    mv "$HISTORY_FILE.tmp" "$HISTORY_FILE"
  fi
}

CURRENT_TAG="$(cat "$CURRENT_FILE" 2>/dev/null || true)"

deploy "$NEW_TAG"

if health_check; then
  echo "==> Health check passed for $NEW_TAG"
  push_history "$CURRENT_TAG"
  echo "$NEW_TAG" > "$CURRENT_FILE"
  docker image prune -f
  exit 0
fi

echo "==> Health check FAILED for $NEW_TAG — attempting automatic rollback"

PREV_TAG="$(head -n 1 "$HISTORY_FILE" 2>/dev/null || true)"

if [[ -z "$PREV_TAG" ]]; then
  echo "==> No previous version in history. Nothing to roll back to. Manual intervention required."
  exit 1
fi

deploy "$PREV_TAG"

if health_check; then
  echo "==> Rollback to $PREV_TAG succeeded. Production is back on the last known-good version."
  echo "$PREV_TAG" > "$CURRENT_FILE"
  # $PREV_TAG is current again now, drop it from the top of history
  tail -n +2 "$HISTORY_FILE" > "$HISTORY_FILE.tmp" && mv "$HISTORY_FILE.tmp" "$HISTORY_FILE"
else
  echo "==> Rollback ALSO failed its health check. Manual intervention REQUIRED — check the containers by hand."
fi

# Exit non-zero either way so the GitHub Actions run shows red and the team
# knows $NEW_TAG was bad, even though the box already recovered on its own.
exit 1
