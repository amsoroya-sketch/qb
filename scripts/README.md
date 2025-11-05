# arQ Project Scripts

This directory contains all setup and generation scripts for the arQ project. These scripts automate the creation of backend modules, frontend pages, mobile app setup, and data import.

## 📁 Script Overview

### 🚀 Master Setup Script

**`setup-complete-project.sh`** - Complete project setup (runs all scripts)
```bash
bash scripts/setup-complete-project.sh
```

This is the **main entry point** that orchestrates the entire project setup:
- ✅ Backend directory structure
- ✅ Backend module generation
- ✅ Database migration and seeding
- ✅ Docker services (PostgreSQL, Redis)
- ✅ Sample Quranic data import
- ℹ️ Instructions for frontend/mobile setup

---

## 🔧 Backend Scripts

### `setup-backend.sh`
Creates backend directory structure and installs dependencies.

**What it does:**
- Creates module directories (auth, users, lessons, exercises, progress, verses, achievements, analytics)
- Creates common utilities directories
- Installs npm dependencies
- Generates Prisma Client

**Usage:**
```bash
cd arQ
bash scripts/setup-backend.sh
```

---

### `generate-modules.js`
Generates initial backend modules with complete implementations.

**What it creates:**
- **Auth Module** (~1200 lines)
  - AuthService with JWT authentication
  - AuthController with register, login, refresh, logout
  - JWT Strategy for Passport
  - JwtAuthGuard
  - CurrentUser decorator
  - DTOs with validation

- **Lessons Module** (~900 lines)
  - LessonsService with CRUD operations
  - Progress tracking (start, complete)
  - XP reward calculation
  - Redis caching layer
  - Pagination support

- **Users Module**
  - UsersService
  - UsersController
  - User DTOs

- **Cache Module**
  - Redis integration
  - CacheService

- **Common Utilities**
  - Exception filters
  - Transform interceptors
  - Environment configuration

**Usage:**
```bash
cd arQ
node scripts/generate-modules.js
```

**Output:** 35+ files created in `backend/src/modules/`

---

### `generate-remaining-modules.js`
Generates the remaining 5 backend modules.

**What it creates:**
- **Exercises Module** - Submit exercises, calculate XP, flexible answer checking
- **Progress Module** - XP system, level calculation, streak tracking, dashboard stats
- **Verses Module** - Quran search, word analysis, bookmarks, grammar filters
- **Achievements Module** - Check requirements, unlock achievements, award XP
- **Analytics Module** - Event tracking, user analytics, admin dashboard, leaderboard

**Usage:**
```bash
cd arQ
node scripts/generate-remaining-modules.js
```

**Output:** 30+ files created across 5 modules

---

## 🎨 Frontend Scripts

### `setup-frontend.sh`
Initializes Next.js 14 frontend project.

**What it does:**
- Creates Next.js 14 project with TypeScript
- Installs Tailwind CSS
- Installs additional dependencies:
  - zustand (state management)
  - axios (HTTP client)
  - @tanstack/react-query
  - react-hook-form + zod (forms & validation)
  - Shadcn/ui components
- Creates directory structure
- Sets up Shadcn/ui with common components

**Usage:**
```bash
cd arQ
bash scripts/setup-frontend.sh
```

---

### `generate-frontend.js`
Generates complete frontend implementation.

**What it creates:**

**API Client:**
- `lib/api/client.ts` - Axios client with token refresh
- `lib/api/auth.ts` - Authentication API methods
- `lib/api/lessons.ts` - Lessons API methods
- `lib/api/exercises.ts` - Exercises API methods
- `lib/api/progress.ts` - Progress API methods

**Stores (Zustand):**
- `lib/stores/auth-store.ts` - Authentication state
- `lib/stores/progress-store.ts` - User progress state

**Utilities:**
- `lib/utils/cn.ts` - Tailwind class name merger
- `lib/utils/format.ts` - Time, XP, date formatting
- `lib/utils/validation.ts` - Zod schemas (login, register)

**Types:**
- `types/index.ts` - TypeScript interfaces for all entities

**Pages:**
- `app/page.tsx` - Landing page
- `app/auth/login/page.tsx` - Login with form validation
- `app/auth/register/page.tsx` - Registration
- `app/dashboard/page.tsx` - User dashboard
- `app/layout.tsx` - Root layout

**Usage:**
```bash
cd arQ
node scripts/generate-frontend.js
```

**Output:** 20+ files created in `frontend/`

---

## 📱 Mobile Scripts

### `setup-mobile.sh`
Initializes React Native (Expo) mobile app.

**What it does:**
- Creates Expo project with TypeScript
- Installs React Navigation
- Installs Zustand, Axios, React Query
- Creates directory structure
- Configures app.json

**Usage:**
```bash
cd arQ
bash scripts/setup-mobile.sh
```

---

## 📊 Data Scripts

### `import-quranic-data.ts`
Imports Quranic verses and word-level grammatical analysis.

**What it does:**
- Imports verses with Arabic text, translation, transliteration
- Imports word-level analysis with 7 essential grammatical properties:
  1. Part of Speech (POS)
  2. Gender
  3. Number
  4. Definiteness
  5. I'rab Case
  6. Case Sign
  7. Murakkab (Structure)
- Includes sample data for Surah Al-Fatiha (5 verses, 19 words)
- Can be extended to import full Quran (77,429 words)

**Usage:**
```bash
cd arQ/backend
npx ts-node ../scripts/import-quranic-data.ts
```

**Sample Data Included:**
- Surah Al-Fatiha verses 1-5
- Complete grammatical analysis for each word
- Ready to test word analysis features

**For Full Quran Import:**
1. Download Quranic Corpus data
2. Place JSON files in `data/quran/` directory
3. Uncomment `importFromJSONFiles()` in script
4. Run the script

---

## 🔄 Complete Setup Workflow

### Option 1: Automated Setup (Recommended)
```bash
# Run master script
bash scripts/setup-complete-project.sh

# Start backend
cd backend
npm run start:dev

# In new terminal: Setup frontend
bash scripts/setup-frontend.sh
node scripts/generate-frontend.js
cd frontend
npm run dev
```

### Option 2: Manual Step-by-Step
```bash
# 1. Backend
bash scripts/setup-backend.sh
node scripts/generate-modules.js
node scripts/generate-remaining-modules.js

cd backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev

# 2. Frontend
bash scripts/setup-frontend.sh
node scripts/generate-frontend.js

cd frontend
npm install
cp .env.local.example .env.local
npm run dev

# 3. Mobile (optional)
bash scripts/setup-mobile.sh
cd mobile
npm install
npm start

# 4. Data Import
cd backend
npx ts-node ../scripts/import-quranic-data.ts
```

---

## 📝 File Counts

**Backend Scripts Generate:**
- **generate-modules.js**: ~35 files
- **generate-remaining-modules.js**: ~30 files
- **Total Backend Files**: ~65 files

**Frontend Scripts Generate:**
- **generate-frontend.js**: ~20 files

**Total Project Files Created by Scripts:** ~85 files

---

## 🎯 What Each Script Produces

### Backend Module Structure
```
backend/src/modules/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── dto/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       └── refresh.dto.ts
├── lessons/
│   ├── lessons.module.ts
│   ├── lessons.service.ts
│   ├── lessons.controller.ts
│   └── dto/
├── exercises/
├── progress/
├── verses/
├── achievements/
└── analytics/
```

### Frontend Structure
```
frontend/
├── app/
│   ├── page.tsx (landing)
│   ├── layout.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── dashboard/
│       └── page.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── lessons.ts
│   │   └── exercises.ts
│   ├── stores/
│   │   ├── auth-store.ts
│   │   └── progress-store.ts
│   └── utils/
└── types/
```

---

## 🐛 Troubleshooting

### Script won't execute
```bash
chmod +x scripts/*.sh
```

### Module generation fails
```bash
# Make sure you're in project root
cd /home/dev/Development/arQ

# Check Node.js version (need v20+)
node --version

# Run with explicit node
node scripts/generate-modules.js
```

### Database connection fails
```bash
# Start Docker services
docker-compose up -d postgres redis

# Check if running
docker-compose ps

# Check connection
cd backend
npx prisma db push
```

### Frontend setup requires interaction
```bash
# The Next.js create command may ask questions
# Accept defaults or choose:
# - TypeScript: Yes
# - Tailwind: Yes
# - App Router: Yes
# - Import alias: @/*
```

---

## 📚 Additional Resources

- **API Documentation**: After running backend, visit http://localhost:3001/api/docs
- **Development Setup**: See `DEVELOPMENT_SETUP.md`
- **Coding Standards**: See `CODING_STANDARDS.md`
- **Project Status**: See `PROJECT_STATUS.md`
- **Implementation Guide**: See `PROJECT_IMPLEMENTATION_GUIDE.md`

---

## ✅ Verification Checklist

After running scripts, verify:

- [ ] Backend server starts: `cd backend && npm run start:dev`
- [ ] API docs accessible: http://localhost:3001/api/docs
- [ ] Database seeded: Login with student@arq.com / student123
- [ ] Frontend runs: `cd frontend && npm run dev` (after setup)
- [ ] All 50+ API endpoints visible in Swagger
- [ ] Quran data imported: Check verses in database

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
**Total Scripts**: 8
**Total Generated Files**: ~85
