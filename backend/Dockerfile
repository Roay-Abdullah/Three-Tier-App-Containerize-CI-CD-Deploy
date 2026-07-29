FROM node:20-alpine AS builder

#Install OpenSSL 1.1 
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

#Install OpenSSL 1.1 again in the final image
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
