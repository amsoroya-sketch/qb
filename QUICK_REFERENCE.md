# arQ Quick Reference Card

## 🚀 Essential Commands

### Start Everything
```bash
./start-system.sh
```

### Stop Everything
```bash
./stop-system.sh --docker
```

### Stop Apps Only (Keep Docker)
```bash
./stop-system.sh
```

---

## 🔌 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3005 |
| Backend API | http://localhost:3001/api/v1 |
| API Docs | http://localhost:3001/api |
| Prisma Studio | http://localhost:5555 |

---

## 🔐 Demo Login

```
Email:    demo@arq.com
Password: Demo123!
```

---

## 📦 Component Ports

| Component | Port |
|-----------|------|
| Frontend | 3005 |
| Backend | 3001 |
| PostgreSQL | 5433 |
| Redis | 6380 |
| Prisma Studio | 5555 |

---

## 🛠️ Common Tasks

### View Logs
```bash
tail -f logs/backend.log
tail -f logs/frontend.log
```

### Database Management
```bash
cd backend
npx prisma studio          # Open GUI
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Apply migrations
npx prisma generate        # Generate client
```

### Run Tests
```bash
# Backend
cd backend && npm test

# Frontend E2E
cd frontend && npm run test:e2e
```

### Check Running Processes
```bash
lsof -ti :3001    # Backend
lsof -ti :3005    # Frontend
docker ps         # Docker containers
```

### Kill Process on Port
```bash
kill -9 $(lsof -ti :3001)
kill -9 $(lsof -ti :3005)
```

---

## 🎯 Tmux Controls

### Attach to Session
```bash
tmux attach -t arq-system
```

### Detach from Session
```
Ctrl+B, then D
```

### Switch Panes
```
Ctrl+B, then arrow keys
```

### Kill Session
```bash
tmux kill-session -t arq-system
```

---

## 🐳 Docker Commands

### Start Containers
```bash
docker start arq-postgres arq-redis
```

### Stop Containers
```bash
docker stop arq-postgres arq-redis
```

### View Logs
```bash
docker logs arq-postgres
docker logs arq-redis
```

### Check Container Health
```bash
docker exec arq-postgres pg_isready -U postgres
docker exec arq-redis redis-cli ping
```

---

## 🔍 Troubleshooting Quick Fixes

### Port Already in Use
```bash
./stop-system.sh
lsof -ti :3001 :3005 | xargs kill -9
```

### Database Connection Failed
```bash
docker restart arq-postgres
sleep 5
cd backend && npx prisma migrate deploy
```

### Clear All Caches
```bash
# Backend
cd backend && rm -rf dist node_modules && npm install

# Frontend
cd frontend && rm -rf .next node_modules && npm install
```

### Reset Database (⚠️ Deletes Data)
```bash
cd backend
npx prisma migrate reset
```

---

## 📝 Development Workflow

### 1. Start System
```bash
./start-system.sh
```

### 2. Make Changes
Edit code with hot-reload enabled

### 3. Run Tests
```bash
cd backend && npm test
cd frontend && npm run test:e2e
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: your changes"
```

### 5. Stop System
```bash
./stop-system.sh
```

---

## 🚨 Emergency Commands

### Kill All Node Processes
```bash
pkill -9 node
```

### Restart Everything
```bash
./stop-system.sh --docker
docker compose up -d postgres redis
./start-system.sh
```

### Check System Status
```bash
docker ps                           # Docker containers
lsof -ti :3001 :3005 :5433 :6380   # Port usage
tmux ls                             # Tmux sessions
```

---

## 📚 More Information

See `STARTUP_GUIDE.md` for comprehensive documentation.
