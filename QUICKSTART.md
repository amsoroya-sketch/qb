# arQ - Quick Start Guide

Get the arQ Quranic Arabic Grammar LMS up and running in minutes!

## 🎯 Prerequisites

Ensure you have these installed:
- **Node.js** 20+ LTS
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)
- **Docker** (optional, but recommended)
- **npm** or **yarn**

## ⚡ 1-Minute Quick Start

```bash
# Clone and navigate
git clone https://github.com/your-org/arq.git
cd arq

# Run complete setup (automated)
bash scripts/setup-complete-project.sh

# Start backend
cd backend
npm run start:dev
```

**Done!** API is now running at http://localhost:3001/api/v1

Visit http://localhost:3001/api/docs to see all 50+ endpoints.

---

## 🚀 Detailed Setup

### Step 1: Backend Setup

```bash
# Setup backend structure
bash scripts/setup-backend.sh

# Generate all modules
node scripts/generate-modules.js
node scripts/generate-remaining-modules.js

# Navigate to backend
cd backend

# Install dependencies (if not done)
npm install

# Setup database
npx prisma migrate dev --name init

# Seed with sample data
npm run seed

# Start development server
npm run start:dev
```

**Backend is now running!**
- API: http://localhost:3001/api/v1
- Swagger Docs: http://localhost:3001/api/docs

**Test Login:**
- Email: `student@arq.com`
- Password: `student123`

---

### Step 2: Frontend Setup

```bash
# In project root
bash scripts/setup-frontend.sh

# Generate frontend code
node scripts/generate-frontend.js

# Navigate to frontend
cd frontend

# Create environment file
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend is now running!**
- Web App: http://localhost:3000

---

### Step 3: Mobile Setup (Optional)

```bash
# In project root
bash scripts/setup-mobile.sh

cd mobile
npm install
npm start

# Scan QR code with Expo Go app
```

---

### Step 4: Import Quranic Data (Optional)

```bash
cd backend
npx ts-node ../scripts/import-quranic-data.ts
```

This imports sample data from Surah Al-Fatiha. For full Quran data, see `scripts/README.md`.

---

## 🐳 Docker Quick Start

If you have Docker installed:

```bash
# Start all services
docker-compose up -d

# This starts:
# - PostgreSQL on port 5432
# - Redis on port 6379
# - Backend API on port 3001
# - Frontend on port 3000

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 📊 What Gets Created

### Backend (65+ files)
- ✅ 8 complete modules (Auth, Users, Lessons, Exercises, Progress, Verses, Achievements, Analytics)
- ✅ 50+ API endpoints
- ✅ JWT authentication with refresh tokens
- ✅ Prisma ORM with 15 database models
- ✅ Redis caching layer
- ✅ Swagger/OpenAPI documentation
- ✅ Input validation with class-validator
- ✅ Exception filters and interceptors

### Frontend (20+ files)
- ✅ Next.js 14 with App Router
- ✅ API client with axios
- ✅ Zustand state management
- ✅ Authentication pages (login, register)
- ✅ Dashboard page
- ✅ Form validation with Zod
- ✅ Shadcn/ui components
- ✅ Tailwind CSS styling

### Database
- ✅ 15 database models
- ✅ Sample users (admin + student)
- ✅ 3 Track A lessons with exercises
- ✅ 1 Track B lesson (Surah Al-Fatiha analysis)
- ✅ 3 Quran verses with word analysis
- ✅ 5 achievements

---

## 🧪 Testing the API

### Using Swagger UI
1. Open http://localhost:3001/api/docs
2. Click "Authorize" button
3. Login to get JWT token:
   ```
   POST /auth/login
   {
     "email": "student@arq.com",
     "password": "student123"
   }
   ```
4. Copy the `accessToken` from response
5. Paste into "Authorize" dialog: `Bearer YOUR_TOKEN_HERE`
6. Now you can test all endpoints!

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@arq.com",
    "password": "student123"
  }'
```

**Get Lessons:**
```bash
curl -X GET http://localhost:3001/api/v1/lessons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Progress:**
```bash
curl -X GET http://localhost:3001/api/v1/progress/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 Test Credentials

### Admin Account
- Email: `admin@arq.com`
- Password: `admin123`
- Role: ADMIN

### Student Account
- Email: `student@arq.com`
- Password: `student123`
- Role: STUDENT
- Progress: Level 2, 150 XP, 5-day streak

---

## 📁 Project Structure

```
arQ/
├── backend/              # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma # Database schema (15 models)
│   │   ├── migrations/   # Database migrations
│   │   └── seed.ts       # Seed data
│   ├── src/
│   │   ├── main.ts       # Application entry
│   │   ├── app.module.ts # Root module (imports all 8 modules)
│   │   ├── modules/      # Feature modules (65+ files)
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── lessons/
│   │   │   ├── exercises/
│   │   │   ├── progress/
│   │   │   ├── verses/
│   │   │   ├── achievements/
│   │   │   └── analytics/
│   │   ├── prisma/       # Prisma service
│   │   └── common/       # Common utilities
│   └── package.json
│
├── frontend/             # Next.js 14 web app
│   ├── app/
│   │   ├── page.tsx      # Landing page
│   │   ├── auth/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── api/          # API client
│   │   ├── stores/       # Zustand stores
│   │   └── utils/
│   └── types/
│
├── mobile/               # React Native (Expo)
│   └── src/
│
├── scripts/              # Setup & generation scripts
│   ├── setup-complete-project.sh     # 🚀 Main entry point
│   ├── setup-backend.sh
│   ├── setup-frontend.sh
│   ├── setup-mobile.sh
│   ├── generate-modules.js
│   ├── generate-remaining-modules.js
│   ├── generate-frontend.js
│   ├── import-quranic-data.ts
│   └── README.md         # Detailed script documentation
│
├── docs/                 # Documentation (400+ pages)
│   ├── API_SPECIFICATION.md
│   ├── SOLUTION_ARCHITECTURE.md
│   ├── CODING_STANDARDS.md
│   ├── TESTING_STRATEGY.md
│   └── ... (11 major docs)
│
├── docker-compose.yml    # Docker services
├── README.md
├── PROJECT_STATUS.md     # Complete project status
├── QUICKSTART.md         # This file
└── .github/
    └── workflows/
        └── ci.yml        # CI/CD pipeline
```

---

## 🎯 Available API Endpoints

### Authentication (5 endpoints)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Get current user profile

### Lessons (8 endpoints)
- `GET /lessons` - List all lessons (with filters)
- `GET /lessons/:id` - Get single lesson
- `POST /lessons/:id/start` - Start a lesson
- `POST /lessons/:id/complete` - Complete a lesson
- `GET /lessons/:id/progress` - Get lesson progress

### Exercises (6 endpoints)
- `GET /exercises` - List exercises
- `GET /exercises/:id` - Get single exercise
- `GET /exercises/lesson/:lessonId` - Get exercises by lesson
- `POST /exercises/:id/submit` - Submit answer
- `GET /exercises/:id/attempts` - Get user attempts
- `GET /exercises/:id/stats` - Get exercise statistics

### Progress (6 endpoints)
- `GET /progress/me` - Get current user progress
- `GET /progress/me/dashboard` - Get dashboard stats
- `GET /progress/me/lessons` - Get lesson progress
- `GET /progress/me/achievements` - Get achievements
- `POST /progress/me/streak` - Update streak

### Verses (7 endpoints)
- `GET /verses` - List verses
- `GET /verses/search` - Search verses
- `GET /verses/grammar` - Find by grammar
- `GET /verses/:surah/:verse` - Get single verse
- `GET /verses/words/:id` - Get word analysis
- `POST /verses/:surah/:verse/bookmark` - Bookmark verse
- `DELETE /verses/:surah/:verse/bookmark` - Remove bookmark

### Achievements (4 endpoints)
- `GET /achievements` - List all achievements
- `GET /achievements/:id` - Get single achievement
- `GET /achievements/me/unlocked` - Get user achievements
- `POST /achievements/me/check` - Check and unlock

### Analytics (4 endpoints)
- `POST /analytics/track` - Track event
- `GET /analytics/me` - Get user analytics
- `GET /analytics/leaderboard` - Get leaderboard
- `GET /analytics/admin` - Admin dashboard (admin only)

### Users (6 endpoints)
- `GET /users` - List users (admin only)
- `GET /users/:id` - Get user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin only)

**Total: 50+ endpoints**

---

## 🎮 Sample Workflow

### 1. Student Registration & Login
```bash
# Register
POST /auth/register
{
  "email": "newstudent@arq.com",
  "password": "Password123",
  "name": "New Student"
}

# Login
POST /auth/login
{
  "email": "newstudent@arq.com",
  "password": "Password123"
}
# → Returns { user, accessToken, refreshToken }
```

### 2. Browse Lessons
```bash
# Get Track A lessons for beginners
GET /lessons?track=A&difficulty=BEGINNER&page=1&limit=10
```

### 3. Start a Lesson
```bash
# Start lesson
POST /lessons/{lessonId}/start

# → Creates UserLessonProgress record
```

### 4. Complete Exercises
```bash
# Get exercises for lesson
GET /exercises/lesson/{lessonId}

# Submit answer
POST /exercises/{exerciseId}/submit
{
  "userAnswer": "الكتاب",
  "timeSpent": 45
}
# → Returns { isCorrect, xpEarned, explanation }
```

### 5. Complete Lesson
```bash
POST /lessons/{lessonId}/complete
{
  "timeSpent": 900
}
# → Awards XP, updates progress
```

### 6. Check Progress
```bash
# Get dashboard
GET /progress/me/dashboard
# → Returns XP, level, streak, lessons completed, accuracy, etc.

# Check achievements
POST /achievements/me/check
# → Unlocks any newly earned achievements
```

---

## 📝 Development Commands

### Backend
```bash
cd backend

# Development
npm run start:dev        # Start with hot-reload

# Database
npx prisma studio        # GUI for database
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma Client
npm run seed             # Seed database

# Testing
npm run test             # Unit tests
npm run test:e2e         # Integration tests
npm run test:cov         # Coverage report

# Production
npm run build            # Build for production
npm run start:prod       # Start production server
```

### Frontend
```bash
cd frontend

npm run dev              # Development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run tests
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database connection error
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Reset database
cd backend
npx prisma migrate reset
npm run seed
```

### Prisma Client not generated
```bash
cd backend
npx prisma generate
```

### Module not found errors
```bash
# Clean install
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. **Explore the API**
   - Open http://localhost:3001/api/docs
   - Test all endpoints with sample data

2. **Read Documentation**
   - `API_SPECIFICATION.md` - Complete API reference
   - `SOLUTION_ARCHITECTURE.md` - System architecture
   - `CODING_STANDARDS.md` - Code guidelines
   - `TESTING_STRATEGY.md` - Testing approach

3. **Customize**
   - Add more lessons in seed.ts
   - Import full Quranic data
   - Customize UI theme
   - Add new features

4. **Deploy**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Configure production environment variables
   - Set up CI/CD pipeline
   - Deploy to Vercel (frontend) and DigitalOcean (backend)

---

## 🤝 Contributing

See `GIT_WORKFLOW.md` and `CODE_REVIEW_CHECKLIST.md` for contribution guidelines.

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: All docs in project root
- **Scripts Help**: See `scripts/README.md`

---

**Built with ❤️ for Quranic Arabic learners worldwide**

**Last Updated**: 2025-11-03 | **Version**: 1.0.0
