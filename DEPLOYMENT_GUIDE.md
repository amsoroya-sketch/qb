# Deployment Guide - arQ (Quranic Arabic Grammar LMS)

**Version**: 1.0
**Last Updated**: 2025-11-03
**Owner**: DevOps Engineer + Solution Architect

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Architecture](#environment-architecture)
3. [Prerequisites](#prerequisites)
4. [Local Development Deployment](#local-development-deployment)
5. [Staging Deployment](#staging-deployment)
6. [Production Deployment](#production-deployment)
7. [Database Migrations](#database-migrations)
8. [Docker Deployment](#docker-deployment)
9. [Kubernetes Deployment](#kubernetes-deployment)
10. [Environment Variables](#environment-variables)
11. [SSL/TLS Configuration](#ssltls-configuration)
12. [CDN Setup](#cdn-setup)
13. [Monitoring & Logging](#monitoring--logging)
14. [Backup & Recovery](#backup--recovery)
15. [Rollback Procedures](#rollback-procedures)
16. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive deployment instructions for the arQ platform across different environments.

### Deployment Targets

| Component | Development | Staging | Production |
|-----------|-------------|---------|------------|
| **Frontend** | localhost:3000 | staging-web.arq.com | www.arq.com |
| **Backend** | localhost:3001 | staging-api.arq.com | api.arq.com |
| **Database** | localhost:5432 | Managed PostgreSQL | Managed PostgreSQL |
| **Redis** | localhost:6379 | Managed Redis | Managed Redis |
| **Mobile** | Expo Go | TestFlight/Internal | App Store/Play Store |

### Hosting Providers

| Service | Provider | Reason |
|---------|----------|--------|
| Frontend | Vercel | Automatic deployments, Edge functions, Global CDN |
| Backend | DigitalOcean | Cost-effective, managed Kubernetes |
| Database | DigitalOcean Managed PostgreSQL | Automated backups, high availability |
| Redis | DigitalOcean Managed Redis | High availability, easy scaling |
| CDN | CloudFlare | Free SSL, DDoS protection, global caching |
| Storage | AWS S3 / DigitalOcean Spaces | Audio files, images, user uploads |

---

## Environment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────────────┐
│                 DEVELOPMENT ENVIRONMENT                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Developer Machine (localhost)                          │
│  ├─ Frontend: http://localhost:3000                    │
│  ├─ Backend: http://localhost:3001                     │
│  ├─ PostgreSQL: localhost:5432                         │
│  ├─ Redis: localhost:6379                              │
│  └─ Mobile: Expo Go App                                │
│                                                         │
│  OR Docker Compose                                      │
│  ├─ All services in containers                         │
│  └─ docker-compose up                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Staging Environment

```
┌─────────────────────────────────────────────────────────┐
│                  STAGING ENVIRONMENT                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Vercel (Frontend)                                      │
│  └─ https://staging-web.arq.com                        │
│                                                         │
│  DigitalOcean Kubernetes (Backend)                      │
│  └─ https://staging-api.arq.com                        │
│      ├─ 2 Backend pods                                 │
│      ├─ Managed PostgreSQL                             │
│      └─ Managed Redis                                  │
│                                                         │
│  CloudFlare (CDN)                                       │
│  └─ Static assets, SSL termination                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                 PRODUCTION ENVIRONMENT                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CloudFlare (DNS + CDN)                                 │
│  └─ SSL, DDoS protection, caching                      │
│                                                         │
│  Vercel (Frontend)                                      │
│  └─ https://www.arq.com                                │
│      ├─ Next.js SSR                                    │
│      ├─ Edge functions                                 │
│      └─ Global CDN                                     │
│                                                         │
│  DigitalOcean Kubernetes (Backend)                      │
│  └─ https://api.arq.com                                │
│      ├─ 4+ Backend pods (auto-scaling)                │
│      ├─ Load Balancer                                  │
│      ├─ Managed PostgreSQL (Primary + Replica)         │
│      └─ Managed Redis (High Availability)              │
│                                                         │
│  AWS S3 / DO Spaces (Storage)                           │
│  └─ Audio files, images, uploads                       │
│      └─ CloudFlare CDN in front                        │
│                                                         │
│  Monitoring                                             │
│  ├─ Grafana (Metrics dashboards)                       │
│  ├─ Prometheus (Metrics collection)                    │
│  ├─ Sentry (Error tracking)                            │
│  └─ Winston + ELK (Logging)                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts

- [ ] GitHub account (source code)
- [ ] Vercel account (frontend hosting)
- [ ] DigitalOcean account (backend, database, Redis)
- [ ] CloudFlare account (CDN, DNS)
- [ ] AWS account (S3 storage) OR DigitalOcean Spaces
- [ ] Sentry account (error tracking)
- [ ] SendGrid account (email)
- [ ] Firebase account (push notifications)

### Required Tools

```bash
# Command-line tools
├─ Docker & Docker Compose
├─ kubectl (Kubernetes CLI)
├─ doctl (DigitalOcean CLI)
├─ vercel (Vercel CLI)
├─ prisma (Database migrations)
└─ aws-cli (if using AWS S3)

# Installation
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# doctl
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.98.0/doctl-1.98.0-linux-amd64.tar.gz
tar xf doctl-1.98.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin

# Vercel CLI
npm i -g vercel

# Prisma CLI
npm i -g prisma
```

---

## Local Development Deployment

### Option 1: Native Installation

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/arq.git
cd arq
```

#### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Mobile
cd ../mobile
npm install
```

#### 3. Setup Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://postgres:password@localhost:5432/arq_dev
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 4. Setup Database

```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Create database
createdb arq_dev

# Run migrations
cd backend
npx prisma migrate dev

# Seed database
npm run seed
```

#### 5. Start Services

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Mobile
cd mobile
npm start
```

#### 6. Verify

```bash
# Backend health check
curl http://localhost:3001/health

# Frontend
open http://localhost:3000

# Mobile
# Scan QR code with Expo Go app
```

---

### Option 2: Docker Compose

#### 1. Create docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: arq-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: arq_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: arq-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: arq-backend
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/arq_dev
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_ACCESS_SECRET: dev-secret
      JWT_REFRESH_SECRET: dev-refresh-secret
      NODE_ENV: development
    ports:
      - '3001:3001'
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: arq-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NODE_ENV: development
    ports:
      - '3000:3000'
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

#### 2. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Staging Deployment

### Frontend Deployment (Vercel)

#### 1. Connect GitHub Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd frontend
vercel link

# Configure project
# Project Name: arq-frontend-staging
# Framework: Next.js
# Root Directory: ./
```

#### 2. Configure Environment Variables

```bash
# Via Vercel Dashboard or CLI
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://staging-api.arq.com

vercel env add NEXT_PUBLIC_ANALYTICS_ID production
# Value: your-analytics-id
```

#### 3. Deploy

```bash
# Deploy to staging
vercel --prod

# Or use GitHub integration (automatic on push)
git push origin staging
```

### Backend Deployment (DigitalOcean Kubernetes)

#### 1. Create DigitalOcean Kubernetes Cluster

```bash
# Install doctl
brew install doctl  # macOS
# or download from https://github.com/digitalocean/doctl/releases

# Authenticate
doctl auth init

# Create cluster
doctl kubernetes cluster create arq-staging \
  --region nyc3 \
  --version 1.28.2-do.0 \
  --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=2"

# Connect kubectl
doctl kubernetes cluster kubeconfig save arq-staging
```

#### 2. Create Managed Database

```bash
# PostgreSQL
doctl databases create arq-staging-db \
  --engine pg \
  --region nyc3 \
  --size db-s-2vcpu-4gb \
  --version 15

# Get connection details
doctl databases connection arq-staging-db

# Redis
doctl databases create arq-staging-redis \
  --engine redis \
  --region nyc3 \
  --size db-s-1vcpu-1gb \
  --version 7
```

#### 3. Create Kubernetes Secrets

```bash
# Create namespace
kubectl create namespace arq-staging

# Create database secret
kubectl create secret generic db-credentials \
  --from-literal=url='postgresql://user:password@host:port/dbname' \
  -n arq-staging

# Create JWT secrets
kubectl create secret generic jwt-secrets \
  --from-literal=access-secret='your-access-secret' \
  --from-literal=refresh-secret='your-refresh-secret' \
  -n arq-staging

# Create Redis secret
kubectl create secret generic redis-credentials \
  --from-literal=host='redis-host' \
  --from-literal=port='25061' \
  --from-literal=password='redis-password' \
  -n arq-staging
```

#### 4. Deploy Backend

```yaml
# k8s/staging/backend-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arq-backend
  namespace: arq-staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: arq-backend
  template:
    metadata:
      labels:
        app: arq-backend
    spec:
      containers:
      - name: backend
        image: your-registry/arq-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "staging"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: JWT_ACCESS_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secrets
              key: access-secret
        - name: JWT_REFRESH_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secrets
              key: refresh-secret
        - name: REDIS_HOST
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: host
        - name: REDIS_PORT
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: port
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: arq-backend-service
  namespace: arq-staging
spec:
  selector:
    app: arq-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: LoadBalancer
```

```bash
# Apply deployment
kubectl apply -f k8s/staging/backend-deployment.yml

# Check status
kubectl get pods -n arq-staging
kubectl get services -n arq-staging

# Get LoadBalancer IP
kubectl get service arq-backend-service -n arq-staging
```

#### 5. Configure DNS

```bash
# Get LoadBalancer IP from previous step
# Add DNS A record:
# staging-api.arq.com → LoadBalancer IP
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Database migrations tested on staging
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured

### Frontend Production Deployment

```bash
# 1. Ensure staging is stable
# 2. Merge to main branch
git checkout main
git merge staging
git push origin main

# 3. Vercel auto-deploys main to production
# Or manually deploy:
cd frontend
vercel --prod

# 4. Verify deployment
curl https://www.arq.com
```

### Backend Production Deployment

#### 1. Build Docker Image

```bash
# Build and tag image
cd backend
docker build -t your-registry/arq-backend:v1.0.0 .
docker tag your-registry/arq-backend:v1.0.0 your-registry/arq-backend:latest

# Push to registry
docker push your-registry/arq-backend:v1.0.0
docker push your-registry/arq-backend:latest
```

#### 2. Run Database Migrations

```bash
# Connect to production database (via bastion host or tunnel)
# IMPORTANT: Always backup before migration
pg_dump -h prod-db-host -U user dbname > backup-$(date +%Y%m%d).sql

# Run migrations
cd backend
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Verify
DATABASE_URL="postgresql://..." npx prisma db pull
```

#### 3. Update Kubernetes Deployment

```yaml
# k8s/production/backend-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arq-backend
  namespace: arq-production
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: arq-backend
  template:
    metadata:
      labels:
        app: arq-backend
        version: v1.0.0
    spec:
      containers:
      - name: backend
        image: your-registry/arq-backend:v1.0.0
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        # ... (same env vars as staging)
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 3
```

```bash
# Apply deployment
kubectl apply -f k8s/production/backend-deployment.yml

# Watch rollout
kubectl rollout status deployment/arq-backend -n arq-production

# Check pods
kubectl get pods -n arq-production

# Check logs
kubectl logs -f deployment/arq-backend -n arq-production
```

#### 4. Verify Production

```bash
# Health check
curl https://api.arq.com/health

# Test authentication
curl -X POST https://api.arq.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check metrics
kubectl top pods -n arq-production

# Monitor errors in Sentry
# Check Grafana dashboards
```

---

## Database Migrations

### Migration Workflow

```bash
# 1. Create migration locally
cd backend
npx prisma migrate dev --name add_user_preferences

# 2. Test migration locally
npm run test

# 3. Apply to staging
DATABASE_URL="staging-db-url" npx prisma migrate deploy

# 4. Verify staging
# Run tests, manual testing

# 5. Apply to production (during low-traffic window)
# Backup first!
pg_dump -h prod-db > backup-$(date +%Y%m%d-%H%M%S).sql

# Apply migration
DATABASE_URL="prod-db-url" npx prisma migrate deploy

# 6. Verify production
# Check application logs
# Run smoke tests
```

### Rollback Migration

```bash
# If migration fails, restore from backup
psql -h prod-db -U user dbname < backup-YYYYMMDD-HHMMSS.sql

# Or manually revert changes
# CREATE TABLE → DROP TABLE
# ALTER TABLE ADD COLUMN → ALTER TABLE DROP COLUMN
```

---

## Docker Deployment

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

## Kubernetes Deployment

### Ingress Configuration

```yaml
# k8s/production/ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: arq-ingress
  namespace: arq-production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.arq.com
    secretName: arq-api-tls
  rules:
  - host: api.arq.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: arq-backend-service
            port:
              number: 80
```

### Horizontal Pod Autoscaler

```yaml
# k8s/production/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: arq-backend-hpa
  namespace: arq-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: arq-backend
  minReplicas: 4
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Environment Variables

### Backend Environment Variables

```bash
# Production .env
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT
JWT_ACCESS_SECRET=strong-random-secret-here
JWT_REFRESH_SECRET=another-strong-secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=redis-host
REDIS_PORT=25061
REDIS_PASSWORD=redis-password
REDIS_TLS=true

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@arq.com

# Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=arq-production

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=arq-production
FIREBASE_CLIENT_EMAIL=service-account-email
FIREBASE_PRIVATE_KEY=private-key

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables

```bash
# Production .env.production
NEXT_PUBLIC_API_URL=https://api.arq.com
NEXT_PUBLIC_WS_URL=wss://api.arq.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your-frontend-sentry-dsn
NEXT_PUBLIC_ENV=production
```

---

## SSL/TLS Configuration

### CloudFlare SSL Setup

1. **Add Domain to CloudFlare**:
   - Add `arq.com` to CloudFlare
   - Update nameservers at domain registrar
   - Wait for DNS propagation

2. **Configure SSL Mode**:
   - Go to SSL/TLS → Overview
   - Select "Full (strict)" mode

3. **Edge Certificates**:
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"
   - Enable "HTTP Strict Transport Security (HSTS)"

### Let's Encrypt with Cert-Manager (Kubernetes)

```yaml
# k8s/production/cert-manager.yml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@arq.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Apply ClusterIssuer
kubectl apply -f k8s/production/cert-manager.yml

# Cert-manager will automatically create SSL certificates
```

---

## CDN Setup

### CloudFlare CDN Configuration

1. **Caching Rules**:
   ```
   Cache Level: Standard
   Browser Cache TTL: 4 hours
   Cache Everything: On (for static assets)
   ```

2. **Page Rules**:
   ```
   URL: *.arq.com/api/*
   Cache Level: Bypass

   URL: *.arq.com/_next/static/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 year
   ```

3. **Performance Settings**:
   - Enable Auto Minify (JavaScript, CSS, HTML)
   - Enable Brotli compression
   - Enable HTTP/2, HTTP/3
   - Enable Early Hints

---

## Monitoring & Logging

### Prometheus + Grafana

```yaml
# k8s/monitoring/prometheus.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'arq-backend'
        kubernetes_sd_configs:
          - role: pod
            namespaces:
              names:
                - arq-production
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: arq-backend
```

### Sentry Error Tracking

```typescript
// Backend: main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Frontend: pages/_app.tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  tracesSampleRate: 0.1,
});
```

---

## Backup & Recovery

### Database Backup

```bash
# Automated daily backups (DigitalOcean Managed Database)
# Backups are automatic, but also create manual backups:

# Manual backup
doctl databases backup create arq-production-db

# List backups
doctl databases backup list arq-production-db

# Restore from backup
doctl databases backup restore arq-production-db backup-id
```

### Application Data Backup

```bash
# Backup user uploads (S3)
aws s3 sync s3://arq-production ./backups/uploads-$(date +%Y%m%d)/

# Backup Redis data
redis-cli --rdb ./backups/redis-$(date +%Y%m%d).rdb
```

---

## Rollback Procedures

### Frontend Rollback (Vercel)

```bash
# Via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous stable deployment
# 3. Click "..." → "Promote to Production"

# Via CLI:
vercel rollback
```

### Backend Rollback (Kubernetes)

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/arq-backend -n arq-production

# Rollback to specific revision
kubectl rollout history deployment/arq-backend -n arq-production
kubectl rollout undo deployment/arq-backend --to-revision=3 -n arq-production

# Check rollout status
kubectl rollout status deployment/arq-backend -n arq-production
```

### Database Rollback

```bash
# Restore from backup
psql -h prod-db-host -U user dbname < backup-YYYYMMDD.sql

# Or use DigitalOcean restore
doctl databases backup restore arq-production-db backup-id
```

---

## Troubleshooting

### Common Issues

#### Issue: Pods Not Starting

```bash
# Check pod status
kubectl get pods -n arq-production

# Describe pod
kubectl describe pod <pod-name> -n arq-production

# Check logs
kubectl logs <pod-name> -n arq-production

# Common causes:
# - Image pull errors (check image tag)
# - Environment variable errors (check secrets)
# - Resource limits (check CPU/memory)
```

#### Issue: Database Connection Errors

```bash
# Test database connection
kubectl run psql --rm -it --image=postgres:15 -- psql -h db-host -U user -d dbname

# Check database credentials
kubectl get secret db-credentials -n arq-production -o yaml

# Check firewall rules
# Ensure Kubernetes cluster IP is whitelisted in DigitalOcean database
```

#### Issue: High Memory Usage

```bash
# Check pod resource usage
kubectl top pods -n arq-production

# Increase memory limits
# Edit deployment.yml → resources.limits.memory
kubectl apply -f k8s/production/backend-deployment.yml

# Check for memory leaks
# Review application logs
kubectl logs -f deployment/arq-backend -n arq-production | grep "OutOfMemory"
```

#### Issue: SSL Certificate Not Working

```bash
# Check certificate status
kubectl get certificate -n arq-production

# Describe certificate
kubectl describe certificate arq-api-tls -n arq-production

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Common causes:
# - DNS not pointing to correct IP
# - Firewall blocking port 80/443
# - Rate limit reached (Let's Encrypt)
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code reviewed and merged to main
- [ ] Database migrations prepared and tested
- [ ] Environment variables configured
- [ ] Secrets created in Kubernetes
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Maintenance window scheduled (if needed)

### During Deployment

- [ ] Run database migrations
- [ ] Deploy backend (rolling update)
- [ ] Verify backend health checks
- [ ] Deploy frontend
- [ ] Verify frontend loads
- [ ] Run smoke tests
- [ ] Check error logs (Sentry)
- [ ] Monitor metrics (Grafana)

### Post-Deployment

- [ ] Verify all services running
- [ ] Run full regression tests
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Check user feedback
- [ ] Update documentation
- [ ] Notify team of successful deployment

---

**Last Updated**: 2025-11-03
**Maintained By**: DevOps Engineer + Solution Architect

**Related Documents**:
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)
- [SOLUTION_ARCHITECTURE.md](./SOLUTION_ARCHITECTURE.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
