# arQ System Startup Guide

Complete guide for starting and managing the arQ Learning Management System.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [System Components](#system-components)
- [Startup Scripts](#startup-scripts)
- [Manual Startup](#manual-startup)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** v20 or higher
- **npm** v10 or higher
- **Docker Desktop** (for PostgreSQL and Redis)
- **tmux** (optional, for better terminal management)

### One-Command Startup

```bash
./start-system.sh
```

This will:
1. ✅ Check system requirements
2. ✅ Start Docker containers (PostgreSQL + Redis)
3. ✅ Install dependencies
4. ✅ Run database migrations
5. ✅ Start backend server (port 3001)
6. ✅ Start frontend server (port 3005)

### One-Command Shutdown

```bash
# Stop application servers only (keeps Docker running)
./stop-system.sh

# Stop everything including Docker containers
./stop-system.sh --docker
```

---

## 🧩 System Components

### Infrastructure

| Component   | Port | Container Name | Purpose                |
|-------------|------|----------------|------------------------|
| PostgreSQL  | 5433 | arq-postgres   | Primary database       |
| Redis       | 6380 | arq-redis      | Caching & sessions     |

### Application

| Component | Port | Tech Stack          | Purpose                    |
|-----------|------|---------------------|----------------------------|
| Backend   | 3001 | NestJS + Prisma     | REST API server            |
| Frontend  | 3005 | Next.js + React     | Web application            |

---

## 📜 Startup Scripts

### start-system.sh

**Full system orchestration script** with comprehensive features:

#### Features

- ✅ **System Validation**: Checks for Docker, Node.js, npm
- ✅ **Port Conflict Detection**: Warns if ports are already in use
- ✅ **Docker Management**: Starts and health-checks PostgreSQL & Redis
- ✅ **Dependency Management**: Auto-installs missing npm packages
- ✅ **Database Setup**: Runs Prisma migrations automatically
- ✅ **Smart Process Management**: Uses tmux if available, falls back to background processes
- ✅ **Comprehensive Logging**: Logs to `logs/` directory
- ✅ **Graceful Cleanup**: Handles Ctrl+C and exits cleanly

#### Usage

```bash
# Standard startup
./start-system.sh

# View logs while running
tail -f logs/backend.log
tail -f logs/frontend.log
```

#### With tmux (Recommended)

When tmux is installed, servers run in a split-pane session:

```bash
# Attach to the session
tmux attach -t arq-system

# Detach from session (keeps servers running)
# Press: Ctrl+B, then D

# Switch between panes
# Press: Ctrl+B, then arrow keys

# Kill the session (stops servers)
tmux kill-session -t arq-system
```

### stop-system.sh

**Graceful shutdown script** for all services:

#### Usage

```bash
# Stop application servers only (Docker keeps running)
./stop-system.sh

# Stop everything including Docker containers
./stop-system.sh --docker
# OR
./stop-system.sh -d
```

#### What It Does

1. Stops tmux session (if running)
2. Kills processes by PID files
3. Kills processes by port numbers (fallback)
4. Optionally stops Docker containers

### Legacy Scripts

#### setup-demo.sh

Prepares demo environment with sample data:

```bash
./setup-demo.sh
```

Creates:
- Demo user: `demo@arq.com` / `Demo123!`
- Database schema
- Sample data

#### start-demo.sh

Quick demo server startup (legacy):

```bash
./start-demo.sh
```

---

## 🔧 Manual Startup

If you prefer manual control over each component:

### 1. Start Docker Containers

```bash
# Using docker-compose
docker compose up -d postgres redis

# OR start individual containers
docker start arq-postgres arq-redis

# Verify containers are running
docker ps
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Setup Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# OR push schema (development)
npx prisma db push
```

### 4. Start Backend Server

```bash
cd backend
npm run start:dev

# Backend will be available at: http://localhost:3001
```

### 5. Start Frontend Server

```bash
cd frontend
PORT=3005 npm run dev

# Frontend will be available at: http://localhost:3005
```

---

## 🐛 Troubleshooting

### Issue: "Docker is not running"

**Solution:**
```bash
# Start Docker Desktop (GUI)
# OR
sudo systemctl start docker  # Linux
```

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using the port
lsof -ti :3001  # Backend
lsof -ti :3005  # Frontend

# Kill the process
kill -9 <PID>

# OR use the stop script
./stop-system.sh
```

### Issue: "Database connection failed"

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs arq-postgres

# Restart PostgreSQL
docker restart arq-postgres

# Wait 5 seconds for it to be ready
sleep 5
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue: "Migration failed"

**Solution:**
```bash
cd backend

# Check migration status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# OR force push schema
npx prisma db push --skip-generate
```

### Issue: "Redis connection failed"

**Solution:**
```bash
# Check if Redis is running
docker ps | grep redis

# Restart Redis
docker restart arq-redis

# Test Redis connection
docker exec arq-redis redis-cli ping
# Should return: PONG
```

### Issue: "Frontend build errors"

**Solution:**
```bash
cd frontend

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart frontend
PORT=3005 npm run dev
```

### Issue: "Backend compilation errors"

**Solution:**
```bash
cd backend

# Check TypeScript errors
npm run type-check

# Clear build cache
rm -rf dist

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart backend
npm run start:dev
```

---

## 🔬 Advanced Usage

### Development with Hot Reload

Both backend and frontend support hot reload:

```bash
# Backend: Watches for file changes
cd backend
npm run start:dev

# Frontend: Watches for file changes
cd frontend
PORT=3005 npm run dev
```

### Running Tests

#### Backend Tests

```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

#### Frontend Tests

```bash
cd frontend

# Playwright E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Debug mode
npm run test:debug

# UI mode (interactive)
npm run test:ui
```

### Database Management

```bash
cd backend

# Open Prisma Studio (GUI)
npx prisma studio

# View migration status
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name <migration-name>

# Deploy migrations (production)
npx prisma migrate deploy

# Seed database
npm run seed
```

### Quran Data Management

```bash
cd backend

# Fetch Quran data from quran.com
npm run quran:fetch

# Import Quran data to database
npm run quran:import

# Verify Quran data
npm run quran:verify

# Force reimport
npm run quran:import:force

# Dry run (no changes)
npm run quran:import:dry-run
```

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables

#### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5433/arq_dev

# JWT Secrets (change in production!)
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3005
```

#### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NODE_ENV=development
```

### Docker Compose Commands

```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d postgres

# Stop all services
docker compose down

# Stop and remove volumes (deletes data)
docker compose down -v

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f postgres

# Rebuild services
docker compose up -d --build
```

### Process Management

#### Using tmux

```bash
# List all sessions
tmux ls

# Attach to arQ session
tmux attach -t arq-system

# Create new window in session
Ctrl+B, then C

# Switch between windows
Ctrl+B, then N (next) or P (previous)

# Split pane horizontally
Ctrl+B, then "

# Split pane vertically
Ctrl+B, then %

# Kill session
tmux kill-session -t arq-system
```

#### Using screen (Alternative)

```bash
# Start backend in screen
screen -S backend -dm bash -c "cd backend && npm run start:dev"

# Start frontend in screen
screen -S frontend -dm bash -c "cd frontend && PORT=3005 npm run dev"

# Attach to backend
screen -r backend

# Detach from screen
Ctrl+A, then D

# Kill session
screen -X -S backend quit
```

---

## 📊 Service URLs

After successful startup:

| Service          | URL                                    | Description              |
|------------------|----------------------------------------|--------------------------|
| Frontend         | http://localhost:3005                  | Main application         |
| Backend API      | http://localhost:3001/api/v1          | REST API                 |
| API Docs         | http://localhost:3001/api             | Swagger documentation    |
| Prisma Studio    | http://localhost:5555                  | Database GUI             |

---

## 🔐 Demo Credentials

Default demo account:

```
Email:    demo@arq.com
Password: Demo123!
```

---

## 📝 Log Files

All logs are stored in the `logs/` directory:

| File              | Content                    |
|-------------------|----------------------------|
| `backend.log`     | Backend server output      |
| `frontend.log`    | Frontend server output     |
| `docker.log`      | Docker operations          |
| `backend.pid`     | Backend process ID         |
| `frontend.pid`    | Frontend process ID        |

---

## 🎯 Best Practices

1. **Always use the startup script** for consistent environment setup
2. **Check logs** if something doesn't work: `tail -f logs/backend.log`
3. **Use tmux** for better terminal management and process monitoring
4. **Stop gracefully** with `./stop-system.sh` to avoid orphaned processes
5. **Keep Docker containers running** between development sessions for faster startup
6. **Run tests** before committing: `npm test` (backend) and `npm run test:e2e` (frontend)
7. **Check port conflicts** if startup fails: `lsof -ti :3001 :3005`
8. **Update dependencies** regularly: `npm install` in both backend and frontend

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Review log files in `logs/` directory
3. Verify Docker containers are healthy: `docker ps`
4. Check system requirements are met
5. Try a clean restart: `./stop-system.sh --docker && ./start-system.sh`

---

**Version:** 1.0.0
**Last Updated:** 2025-11-07
**Maintained by:** arQ Development Team
