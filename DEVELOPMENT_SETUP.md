# arQ - DEVELOPMENT SETUP GUIDE

**Project:** arQ - Quranic Arabic Grammar Learning Management System
**Document Type:** Developer Onboarding and Environment Setup
**Version:** 1.0
**Date:** 2025-11-02
**Maintained By:** DevOps Engineer

---

## TABLE OF CONTENTS

1. [Prerequisites](#1-prerequisites)
2. [Repository Setup](#2-repository-setup)
3. [Backend Setup (NestJS)](#3-backend-setup-nestjs)
4. [Frontend Setup (Next.js)](#4-frontend-setup-nextjs)
5. [Mobile Setup (React Native)](#5-mobile-setup-react-native)
6. [Database Setup (PostgreSQL)](#6-database-setup-postgresql)
7. [Cache Setup (Redis)](#7-cache-setup-redis)
8. [Docker Development Environment](#8-docker-development-environment)
9. [Environment Variables](#9-environment-variables)
10. [Running the Application](#10-running-the-application)
11. [Development Workflow](#11-development-workflow)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. PREREQUISITES

### 1.1 Required Software

Before starting, install the following software on your development machine:

| Software | Version | Purpose | Installation Link |
|----------|---------|---------|-------------------|
| **Node.js** | 20.x LTS | JavaScript runtime | https://nodejs.org/ |
| **npm** | 10.x+ | Package manager | Comes with Node.js |
| **Git** | 2.40+ | Version control | https://git-scm.com/ |
| **Docker Desktop** | Latest | Containerization | https://www.docker.com/products/docker-desktop |
| **VS Code** | Latest | Code editor (recommended) | https://code.visualstudio.com/ |

### 1.2 Optional (but Recommended)

| Software | Purpose | Installation Link |
|----------|---------|-------------------|
| **PostgreSQL** | Local database (alternative to Docker) | https://www.postgresql.org/download/ |
| **Redis** | Local cache (alternative to Docker) | https://redis.io/download/ |
| **Postman** | API testing | https://www.postman.com/downloads/ |
| **pgAdmin** | PostgreSQL GUI | https://www.pgadmin.org/download/ |

### 1.3 VS Code Extensions (Recommended)

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "usernamehw.errorlens",
    "eamodio.gitlens",
    "humao.rest-client"
  ]
}
```

**To install all at once**:
1. Copy the above JSON
2. Create `.vscode/extensions.json` in project root
3. VS Code will prompt you to install recommended extensions

### 1.4 System Requirements

**Minimum**:
- CPU: 4 cores
- RAM: 8 GB
- Disk: 10 GB free space

**Recommended**:
- CPU: 8 cores
- RAM: 16 GB
- Disk: 20 GB free space (for Docker images, databases, node_modules)

---

## 2. REPOSITORY SETUP

### 2.1 Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/arq.git
cd arq

# Install global dependencies
npm install -g @nestjs/cli
npm install -g vercel    # For frontend deployment
```

### 2.2 Repository Structure

After cloning, your repository should look like this:

```
arq/
├── backend/              # NestJS backend
├── frontend/             # Next.js frontend
├── mobile/               # React Native mobile app
├── database/             # Database migrations and seeds
├── docs/                 # Documentation
├── scripts/              # Utility scripts
├── .github/              # GitHub Actions workflows
├── docker-compose.yml    # Docker services
└── README.md
```

### 2.3 Branch Strategy

We use **Git Flow** branching model:

```
main           - Production-ready code (protected)
  └─ develop   - Integration branch for development
       ├─ feature/lesson-viewer
       ├─ feature/exercise-engine
       └─ bugfix/login-issue
```

**Branch Naming Convention**:
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes
- `refactor/component-name` - Code refactoring

---

## 3. BACKEND SETUP (NestJS)

### 3.1 Navigate to Backend Directory

```bash
cd backend
```

### 3.2 Install Dependencies

```bash
# Install all Node.js dependencies
npm install

# This will install:
# - @nestjs/* packages (core, common, platform-express, etc.)
# - @prisma/client (database ORM)
# - bcrypt (password hashing)
# - class-validator, class-transformer (validation)
# - And 50+ other dependencies (see package.json)
```

**Expected output**:
```
added 234 packages, and audited 235 packages in 45s
```

### 3.3 Prisma Setup

```bash
# Generate Prisma Client from schema
npx prisma generate

# This creates the Prisma Client in node_modules/@prisma/client
```

### 3.4 Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your local configuration:

```env
# Application
NODE_ENV=development
PORT=3001
APP_NAME=arQ Backend

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/arq_dev?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=your-access-secret-here-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-here-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@arq.app

# File Storage (DigitalOcean Spaces or AWS S3)
STORAGE_PROVIDER=local  # local, s3, or spaces
DO_SPACES_KEY=your-spaces-key
DO_SPACES_SECRET=your-spaces-secret
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=arq-assets

# CORS (Frontend URLs)
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Sentry (Error Tracking)
SENTRY_DSN=your-sentry-dsn

# Rate Limiting
THROTTLE_TTL=60000      # 60 seconds
THROTTLE_LIMIT=100      # 100 requests per minute
```

### 3.5 Database Migrations

```bash
# Run database migrations
npx prisma migrate dev

# This will:
# 1. Create the database if it doesn't exist
# 2. Run all pending migrations
# 3. Regenerate Prisma Client
```

**Expected output**:
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "arq_dev", schema "public" at "localhost:5432"

Running migration: 20251102_create_users_table
Running migration: 20251102_create_verses_table
Running migration: 20251102_create_lessons_table

✔ Generated Prisma Client (5.6.0 | library) to ./node_modules/@prisma/client
```

### 3.6 Seed Database

```bash
# Seed database with initial data
npm run seed

# This will populate:
# - Quranic verses (6,236 verses)
# - Verse words (77,429 words with grammatical analysis)
# - Arabic roots (~1,500 roots)
# - Initial lessons (first 10 lessons)
# - Sample users (for testing)
```

**Expected output**:
```
🌱 Seeding database...
✓ Imported 6,236 Quranic verses
✓ Imported 77,429 words with grammatical analysis
✓ Imported 1,487 Arabic roots
✓ Created 10 initial lessons
✓ Created 3 sample users
🎉 Database seeded successfully!
```

### 3.7 Verify Backend Setup

```bash
# Start backend in development mode
npm run start:dev

# This will start the backend on http://localhost:3001
```

**Expected output**:
```
[Nest] 12345  - 11/02/2025, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 11/02/2025, 10:30:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 11/02/2025, 10:30:01 AM     LOG [RoutesResolver] AppController {/}
[Nest] 12345  - 11/02/2025, 10:30:01 AM     LOG [RouterExplorer] Mapped {/, GET} route
[Nest] 12345  - 11/02/2025, 10:30:01 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 11/02/2025, 10:30:01 AM     LOG Application is running on: http://localhost:3001
[Nest] 12345  - 11/02/2025, 10:30:01 AM     LOG Swagger documentation: http://localhost:3001/api/docs
```

**Test the API**:
```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","database":"connected","redis":"connected"}
```

---

## 4. FRONTEND SETUP (NEXT.JS)

### 4.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 4.2 Install Dependencies

```bash
npm install

# This will install:
# - next, react, react-dom
# - @radix-ui/* components
# - tailwindcss, @tailwindcss/*
# - zustand (state management)
# - axios (HTTP client)
# - And 100+ other dependencies
```

### 4.3 Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (optional for development)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=

# Sentry (optional for development)
NEXT_PUBLIC_SENTRY_DSN=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=false
```

### 4.4 Verify Frontend Setup

```bash
# Start frontend in development mode
npm run dev

# This will start the frontend on http://localhost:3000
```

**Expected output**:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 2.3s (1458 modules)
- wait compiling...
- event compiled client and server successfully in 356 ms (1459 modules)
```

**Test in browser**:
1. Open http://localhost:3000
2. You should see the arQ landing page
3. Try navigating to http://localhost:3000/login

---

## 5. MOBILE SETUP (REACT NATIVE)

### 5.1 Navigate to Mobile Directory

```bash
cd mobile
```

### 5.2 Install Dependencies

```bash
npm install

# This will install:
# - expo and expo-* packages
# - react-native and @react-native/*
# - @react-navigation/* (navigation)
# - expo-sqlite, expo-file-system (offline storage)
```

### 5.3 Install Expo CLI Globally

```bash
npm install -g expo-cli
```

### 5.4 Environment Variables

Create `.env` file in `mobile/` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# API URL (use your computer's local IP for mobile testing)
API_URL=http://192.168.1.100:3001/api/v1

# For iOS Simulator, you can use localhost:
# API_URL=http://localhost:3001/api/v1

# For Android Emulator, use:
# API_URL=http://10.0.2.2:3001/api/v1
```

### 5.5 Start Expo Development Server

```bash
# Start Expo
npx expo start

# Or with npm script:
npm start
```

**Expected output**:
```
Starting Metro Bundler
Metro waiting on exp://192.168.1.100:8081

› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

### 5.6 Test on Device/Simulator

**Option 1: Physical Device** (Recommended for testing)
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code with your device camera
3. App will open in Expo Go

**Option 2: iOS Simulator** (Mac only)
```bash
# Open iOS simulator
npm run ios
```

**Option 3: Android Emulator**
```bash
# Open Android emulator (must have Android Studio installed)
npm run android
```

---

## 6. DATABASE SETUP (POSTGRESQL)

### 6.1 Option 1: Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker-compose up -d postgres

# This will:
# - Pull PostgreSQL 15 image
# - Create a container named 'arq-postgres'
# - Expose port 5432
# - Persist data in Docker volume
```

**Verify database is running**:
```bash
docker ps | grep postgres

# Expected output:
# abc123  postgres:15  Up 2 minutes  0.0.0.0:5432->5432/tcp  arq-postgres
```

### 6.2 Option 2: Native Installation

**macOS** (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
```

**Windows**:
Download installer from https://www.postgresql.org/download/windows/

### 6.3 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE arq_dev;
CREATE USER arq_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE arq_dev TO arq_user;
\q
```

### 6.4 Test Database Connection

```bash
# Test connection
psql -U arq_user -d arq_dev -h localhost

# If successful, you'll see:
# arq_dev=>
```

---

## 7. CACHE SETUP (REDIS)

### 7.1 Option 1: Docker (Recommended)

```bash
# Start Redis in Docker
docker-compose up -d redis

# This will:
# - Pull Redis 7 image
# - Create a container named 'arq-redis'
# - Expose port 6379
```

**Verify Redis is running**:
```bash
docker ps | grep redis

# Expected output:
# def456  redis:7  Up 2 minutes  0.0.0.0:6379->6379/tcp  arq-redis
```

### 7.2 Option 2: Native Installation

**macOS** (using Homebrew):
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows**:
Use Docker (native Windows Redis support is limited)

### 7.3 Test Redis Connection

```bash
# Connect to Redis CLI
redis-cli

# In redis-cli prompt, test commands:
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET test "Hello arQ"
OK
127.0.0.1:6379> GET test
"Hello arQ"
127.0.0.1:6379> EXIT
```

---

## 8. DOCKER DEVELOPMENT ENVIRONMENT

### 8.1 Complete Docker Compose Setup

We provide a `docker-compose.yml` that runs all services:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: arq-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: arq_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: arq-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: arq-backend
    restart: unless-stopped
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/arq_dev
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - '3001:3001'
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: arq-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1
    ports:
      - '3000:3000'
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

### 8.2 Start All Services

```bash
# Start all services (postgres, redis, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### 8.3 Docker Commands Reference

```bash
# Build images
docker-compose build

# Start specific service
docker-compose up -d postgres

# Restart service
docker-compose restart backend

# View service logs
docker-compose logs backend

# Execute command in container
docker-compose exec backend npm run prisma:migrate

# Shell into container
docker-compose exec backend sh
```

---

## 9. ENVIRONMENT VARIABLES

### 9.1 Backend Environment Variables

**Required Variables**:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/arq_dev
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-secret-here
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Optional Variables**:
```env
NODE_ENV=development
PORT=3001
SENDGRID_API_KEY=
DO_SPACES_KEY=
SENTRY_DSN=
```

### 9.2 Frontend Environment Variables

**Required Variables**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**Optional Variables**:
```env
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
```

### 9.3 Mobile Environment Variables

**Required Variables**:
```env
API_URL=http://192.168.1.100:3001/api/v1
```

### 9.4 Generating Secrets

```bash
# Generate JWT secrets (run twice for access and refresh)
openssl rand -base64 32

# Example output:
# 8yJ2K5mP9qR3vW7xZ1bN4cH6gT0fL8wE2sA5dY7uI9o=
```

---

## 10. RUNNING THE APPLICATION

### 10.1 Development Mode (Full Stack)

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

**Terminal 3 - Mobile** (optional):
```bash
cd mobile
npm start
# Expo runs on exp://192.168.1.100:8081
```

### 10.2 Running with Docker

```bash
# Start all services
docker-compose up -d

# Backend: http://localhost:3001
# Frontend: http://localhost:3000
# Swagger docs: http://localhost:3001/api/docs
```

### 10.3 Accessing the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js web app |
| **Backend API** | http://localhost:3001 | NestJS REST API |
| **Swagger Docs** | http://localhost:3001/api/docs | Interactive API documentation |
| **PostgreSQL** | localhost:5432 | Database (use pgAdmin or DBeaver) |
| **Redis** | localhost:6379 | Cache (use Redis Commander) |
| **Mobile** | exp://192.168.1.100:8081 | React Native app (Expo) |

### 10.4 Default Test Accounts

After seeding, these test accounts are available:

| Email | Password | Role |
|-------|----------|------|
| student@arq.app | Test123! | Student |
| teacher@arq.app | Test123! | Teacher |
| admin@arq.app | Test123! | Admin |

---

## 11. DEVELOPMENT WORKFLOW

### 11.1 Daily Workflow

**1. Start your day**:
```bash
# Pull latest changes
git pull origin develop

# Install new dependencies (if any)
cd backend && npm install
cd ../frontend && npm install

# Start development servers
docker-compose up -d    # Or start manually in terminals
```

**2. Create a feature branch**:
```bash
git checkout -b feature/lesson-viewer
```

**3. Make changes and commit**:
```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(frontend): add lesson viewer component"
```

**4. Run tests before pushing**:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Linting
npm run lint
```

**5. Push and create PR**:
```bash
git push origin feature/lesson-viewer

# Create Pull Request on GitHub
```

### 11.2 Conventional Commits

We use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(auth): add JWT refresh token rotation
fix(lesson): resolve lesson completion not saving
docs(api): update API specification for verses endpoint
refactor(components): extract LessonCard to separate file
test(exercises): add unit tests for MultipleChoice component
```

### 11.3 Code Quality Checks

**Before committing, run**:
```bash
# Linting (auto-fix)
npm run lint:fix

# Type checking
npm run type-check

# Tests
npm test

# All checks at once
npm run pre-commit
```

### 11.4 Database Migrations

**Creating a new migration**:
```bash
cd backend

# After modifying prisma/schema.prisma, create migration
npx prisma migrate dev --name add_user_avatar_field

# This will:
# 1. Generate SQL migration file
# 2. Apply migration to database
# 3. Regenerate Prisma Client
```

**Applying migrations**:
```bash
# Apply all pending migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## 12. TROUBLESHOOTING

### 12.1 Common Issues

#### Issue: `npm install` fails with EACCES error

**Solution**:
```bash
# Fix npm permissions (Unix/Mac)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Issue: PostgreSQL connection refused

**Check if PostgreSQL is running**:
```bash
# Docker
docker ps | grep postgres

# Native
sudo systemctl status postgresql    # Linux
brew services list | grep postgres  # Mac
```

**Solution**:
```bash
# Docker
docker-compose up -d postgres

# Native
sudo systemctl start postgresql     # Linux
brew services start postgresql@15   # Mac
```

#### Issue: Redis connection error

**Check if Redis is running**:
```bash
# Test connection
redis-cli ping

# If error, start Redis:
docker-compose up -d redis          # Docker
brew services start redis           # Mac
sudo systemctl start redis-server   # Linux
```

#### Issue: Port already in use (3000 or 3001)

**Find process using port**:
```bash
# Find PID
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run start:dev
```

#### Issue: Prisma Client not found

**Regenerate Prisma Client**:
```bash
cd backend
npx prisma generate
```

#### Issue: Frontend can't connect to backend (CORS error)

**Check backend CORS configuration**:
```env
# backend/.env
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

**Restart backend after changing CORS**:
```bash
cd backend
npm run start:dev
```

#### Issue: Docker containers not starting

**View logs**:
```bash
docker-compose logs backend
docker-compose logs postgres
```

**Rebuild containers**:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Issue: Module not found after git pull

**Reinstall dependencies**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 12.2 Database Issues

#### Reset database completely

```bash
cd backend

# Delete database and recreate
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run seed script
```

#### View database contents

```bash
# Prisma Studio (GUI)
npx prisma studio

# Opens at http://localhost:5555
```

### 12.3 Performance Issues

#### Backend slow startup

**Clear Prisma cache**:
```bash
cd backend
rm -rf node_modules/.prisma
npx prisma generate
```

#### Frontend slow build

**Clear Next.js cache**:
```bash
cd frontend
rm -rf .next
npm run dev
```

#### Docker slow

**Prune Docker resources**:
```bash
# Remove unused containers, images, networks
docker system prune -a

# Free up disk space
docker volume prune
```

### 12.4 Getting Help

If you encounter issues not covered here:

1. **Check documentation**: Review SOLUTION_ARCHITECTURE.md, API_SPECIFICATION.md
2. **Search issues**: Check GitHub Issues for similar problems
3. **Ask team**: Post in team Slack/Discord
4. **Create issue**: If it's a bug, create a GitHub Issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Error logs
   - Environment (OS, Node version, etc.)

---

## APPENDIX A: Quick Start Checklist

```
☐ Install prerequisites (Node.js, Docker, Git, VS Code)
☐ Clone repository
☐ Install VS Code extensions
☐ Backend setup:
  ☐ cd backend && npm install
  ☐ Copy .env.example to .env
  ☐ Fill in environment variables
  ☐ npx prisma generate
  ☐ npx prisma migrate dev
  ☐ npm run seed
  ☐ npm run start:dev
☐ Frontend setup:
  ☐ cd frontend && npm install
  ☐ Copy .env.example to .env.local
  ☐ npm run dev
☐ Test in browser:
  ☐ Frontend: http://localhost:3000
  ☐ Backend: http://localhost:3001
  ☐ Swagger: http://localhost:3001/api/docs
☐ Login with test account (student@arq.app / Test123!)
```

---

## APPENDIX B: Useful Commands

### Backend Commands

```bash
# Development
npm run start:dev         # Start with hot reload
npm run start:debug       # Start with debugger
npm run build             # Build production
npm run start:prod        # Run production build

# Database
npx prisma migrate dev    # Create and apply migration
npx prisma migrate deploy # Apply migrations (production)
npx prisma generate       # Generate Prisma Client
npx prisma studio         # Open Prisma Studio GUI
npm run seed              # Seed database

# Testing
npm test                  # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run E2E tests

# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint errors
npm run format            # Format with Prettier
```

### Frontend Commands

```bash
# Development
npm run dev               # Start dev server
npm run build             # Build for production
npm run start             # Start production server
npm run preview           # Preview production build

# Testing
npm test                  # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:e2e          # Run E2E tests with Playwright

# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint errors
npm run format            # Format with Prettier
npm run type-check        # TypeScript type checking
```

### Mobile Commands

```bash
# Development
npm start                 # Start Expo dev server
npm run ios               # Open iOS simulator
npm run android           # Open Android emulator
npm run web               # Open in web browser

# Building
npm run build:ios         # Build for iOS (EAS)
npm run build:android     # Build for Android (EAS)

# Testing
npm test                  # Run tests
npm run lint              # Run ESLint
```

### Docker Commands

```bash
# Start/Stop
docker-compose up -d                # Start all services
docker-compose down                 # Stop all services
docker-compose restart <service>    # Restart service

# Logs
docker-compose logs -f              # All logs (follow)
docker-compose logs -f backend      # Backend logs

# Execute Commands
docker-compose exec backend sh      # Shell into backend
docker-compose exec postgres psql -U postgres arq_dev  # PostgreSQL CLI

# Clean Up
docker-compose down -v              # Stop and remove volumes
docker system prune -a              # Remove unused resources
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**Maintained By**: DevOps Engineer
**Next Review**: After first developer onboarding

**Related Documents**:
- SOLUTION_ARCHITECTURE.md (system architecture)
- API_SPECIFICATION.md (API endpoints)
- CODING_STANDARDS.md (code quality guidelines)

---

**END OF DEVELOPMENT SETUP GUIDE**
