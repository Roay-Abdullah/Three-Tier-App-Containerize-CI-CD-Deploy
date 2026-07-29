# 3-Tier Application with Full CI/CD on AWS

![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED)
![AWS](https://img.shields.io/badge/Cloud-AWS-232F3E)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Node](https://img.shields.io/badge/Backend-Node.js-339933)

A containerized three-tier application, React on the frontend, Node.js/Express/Prisma on the backend, PostgreSQL for storage, with a GitHub Actions pipeline that builds the images, pushes them to Amazon ECR, and deploys to an AWS EC2 instance on every push to `main`.

- **Live URL**: `http://<your-ec2-public-ip>` (port 80)
- **Backend API**: `/api` (proxied through Nginx)

---

## Architecture

```
User Browser
     │
     ▼
┌─────────────────────────────────────────┐
│  AWS EC2 (Ubuntu)                       │
│  ┌─────────────────────────────────┐   │
│  │  Nginx (Reverse Proxy / Port 80)│   │
│  └───────────┬─────────────────────┘   │
│              │                          │
│  ┌───────────▼─────────────────────┐   │
│  │  Frontend (React + Vite)        │   │
│  └─────────────────────────────────┘   │
│              │                          │
│  ┌───────────▼─────────────────────┐   │
│  │  Backend (Node.js + Express)    │   │
│  │  Port: 5000 (internal)          │   │
│  └───────────┬─────────────────────┘   │
│              │                          │
│  ┌───────────▼─────────────────────┐   │
│  │  PostgreSQL 16 (Port: 5432)     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Tech Stack

| Tier | Technology |
| :--- | :--- |
| Frontend | React 18, TypeScript, Vite, React Router, Axios |
| Backend | Node.js 20, Express, Prisma, JWT, Bcrypt, Zod |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Cloud | AWS (EC2, ECR, IAM) |

---

## CI/CD Pipeline

The pipeline runs on every push to `main`, defined in `.github/workflows/deploy.yml`:

1. Spin up a temporary PostgreSQL instance and run the Jest integration tests.
2. Build the frontend to make sure TypeScript and Vite compile cleanly.
3. Authenticate GitHub Actions to AWS.
4. Log Docker into the private ECR registry.
5. Build the frontend and backend images, tag them `latest`, and push to ECR.
6. SSH into the EC2 instance, run `docker compose pull`, then `docker compose up -d` to restart the containers.

---

## Key Challenges and Fixes

| Challenge | Cause | Fix |
| :--- | :--- | :--- |
| Prisma/OpenSSL engine errors | `node:20-alpine` uses musl libc, but Prisma's binaries are built for glibc, so the engine couldn't load OpenSSL. | Switched to `node:20-slim` (Debian-based) and installed `openssl` explicitly in the Dockerfile. |
| Nginx returning 404 on `/api` routes | A trailing slash in `proxy_pass http://backend:5000/;` was stripping the `/api` prefix before forwarding the request. | Removed the trailing slash so the full `/api/auth` path reaches the backend. |
| Frontend couldn't reach the backend | `VITE_API_URL` was hardcoded to the public IP on port 5000, which the security group blocked. | Switched the frontend to relative `/api` URLs and let Nginx handle routing internally. |
| Database tables missing | `prisma migrate deploy` needs migration files in the repo, and there weren't any. | Changed the Dockerfile CMD to `npx prisma db push`, which syncs the schema without needing migrations. |
| EC2 SSH authentication failing | The GitHub secret held a malformed key with extra whitespace. | Re-copied the full `.pem` contents, including the `-----BEGIN` lines, into the secret. |

---

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   └── server.ts
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

---

## Running It Locally

You'll need Docker and Docker Compose installed.

1. Clone the repo:
   ```bash
   git clone https://github.com/Roay-Abdullah/Three-Tier-App-Containerize-CI-CD-Deploy.git
   cd Three-Tier-App-Containerize-CI-CD-Deploy
   ```

2. Add a `.env` file in the root:
   ```
   POSTGRES_PASSWORD=yourpassword
   JWT_SECRET=yourjwtsecret
   ```

3. Build and start everything:
   ```bash
   docker-compose up --build
   ```

4. Check it's running:
   - Frontend: `http://localhost:80`
   - Backend health check: `http://localhost:5000/api/health`

---

## Environment Variables

**Backend**

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://postgres:pass@db:5432/taskdb` |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `PORT` | Port for the Express server (default `5000`) |

**Frontend**

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Optional, for local dev. Leave empty in production so the app uses relative `/api` paths. |

---

## Deployment Infrastructure

- **EC2 (t2.micro)** runs Docker and hosts the app.
- **ECR** stores the production images.
- **IAM role on EC2** grants `ecr:GetAuthorizationToken` and `ecr:GetDownloadUrlForLayer` so the instance can pull images without stored credentials.
- **Security groups**: port 80 is open to the public, port 22 is restricted to specific IPs, and port 5000 stays closed to the public since only Nginx needs to reach it.

---

## Possible Next Steps

- Add HTTPS with Let's Encrypt in front of Nginx.
- Point a Route 53 domain at the EC2 public IP.
- Move from EC2 to ECS Fargate or EKS if the containers need to scale independently.
- Add CloudWatch logging and basic health alarms.

---

## Notes

I used GitHub Copilot and ChatGPT throughout for boilerplate and debugging, and referred to the Prisma and Docker docs for the trickier parts.

---

## License

Built for educational and portfolio purposes.

**Developed by:** Roay Abdullah
**GitHub:** [Roay-Abdullah](https://github.com/Roay-Abdullah)
