# Getting Started with arQ Platform

## 🚀 Quick Start Guide for Developers

Welcome to the arQ Quranic Arabic Learning Platform! This guide will help you get the project running locally.

---

## Prerequisites

### Required Software
- **Node.js**: 20.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: 10.0.0 or higher (comes with Node.js)
- **PostgreSQL**: 15.0 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** (Optional): For caching ([Download](https://redis.io/download))
- **Git**: For version control

### Verify Installation
```bash
node --version  # v20.x.x
npm --version   # 10.x.x
psql --version  # 15.x
```

---

## Project Structure

```
arQ/
├── frontend/          # Next.js 14 frontend application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities, API, stores
│   └── types/        # TypeScript type definitions
├── backend/          # NestJS backend API
│   ├── src/          # Source code
│   ├── prisma/       # Database schema & migrations
│   └── test/         # Unit & E2E tests
├── docs/             # Project documentation
└── quran-morphology-data/  # Quranic text data
```

---

## Step 1: Clone Repository

```bash
git clone https://github.com/your-org/arQ.git
cd arQ
```

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/arq_dev"

# JWT Secrets (use: openssl rand -base64 32)
JWT_ACCESS_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Redis (optional for development)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# API
PORT="3001"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 2.3 Database Setup

#### Create Database
```bash
# Using psql
psql -U postgres
CREATE DATABASE arq_dev;
\q
```

#### Run Migrations
```bash
npx prisma migrate dev
npx prisma generate
```

#### Seed Database (Optional)
```bash
npm run seed
```

#### Import Quranic Data
```bash
# Fetch data from corpus.quran.com
npm run quran:fetch

# Import to database
npm run quran:import

# Verify import
npm run quran:verify
```

### 2.4 Start Backend Server
```bash
# Development mode (hot reload)
npm run start:dev

# Backend should be running at http://localhost:3001
```

**Test Backend:**
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok"}
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

### 3.2 Configure Environment
```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

**Required Environment Variables:**
```env
# API URL
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Environment
NEXT_PUBLIC_ENV="development"
```

### 3.3 Start Frontend Server
```bash
# Development mode (hot reload)
npm run dev

# Frontend should be running at http://localhost:3000
```

**Test Frontend:**
Open your browser and navigate to: `http://localhost:3000`

---

## Step 4: Verify Setup

### Backend Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-04T..."
}
```

### Frontend Pages
Visit these URLs to verify:
- Home: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Dashboard: http://localhost:3000/dashboard (requires login)

### Test Account
Use these credentials for testing:
- **Email**: `student@arq.com`
- **Password**: `Student123@`

---

## Development Workflow

### Running Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Code Quality Checks

#### TypeScript Type Checking
```bash
cd frontend
npm run type-check
# Should show: 0 errors
```

#### Linting
```bash
cd frontend
npm run lint
# Should pass with 0 errors
```

#### Formatting
```bash
cd frontend
npm run format
```

#### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
```

#### Frontend Tests
```bash
cd frontend
npm run test          # Playwright E2E tests
npm run test:ui       # Visual test runner
```

---

## Common Tasks

### Database Management

#### View Database with Prisma Studio
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

#### Create New Migration
```bash
cd backend
npx prisma migrate dev --name add_new_feature
```

#### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### Adding New Features

#### 1. Create Database Model
```prisma
// backend/prisma/schema.prisma
model NewFeature {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @db.VarChar(255)
  createdAt DateTime @default(now())
}
```

#### 2. Run Migration
```bash
npx prisma migrate dev --name add_new_feature
```

#### 3. Generate Types
```bash
npx prisma generate
```

#### 4. Create Backend Service
```bash
cd backend/src
nest g module new-feature
nest g service new-feature
nest g controller new-feature
```

#### 5. Create Frontend Components
```bash
cd frontend/components/features
mkdir new-feature
# Add components here
```

### Debugging

#### Backend Debugging (VS Code)
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Debug Backend",
  "port": 9229
}
```

```bash
# Start in debug mode
npm run start:debug
# Attach debugger in VS Code (F5)
```

#### Frontend Debugging
- Use React DevTools extension
- Use Next.js built-in error overlay
- Check browser console for errors

#### Database Debugging
```sql
-- Connect to database
psql $DATABASE_URL

-- View tables
\dt

-- Query data
SELECT * FROM users LIMIT 5;

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM quran_verses WHERE surah_number = 1;
```

---

## Project Documentation

### Essential Reading
1. **PROJECT_CONSTRAINTS.md** - Technical constraints and requirements (2,225 lines)
2. **COMPREHENSIVE_UI_REQUIREMENTS.md** - Complete design system (14,000 words)
3. **WORD_AYAT_ANALYSIS_PAGE_DESIGN.md** - Core feature specification (8,000 words)
4. **DEPLOYMENT_GUIDE.md** - Production deployment instructions

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐│
│  │   Pages     │  │  Components  │  │    Stores      ││
│  │ (App Router)│  │  (shadcn/ui) │  │   (Zustand)    ││
│  └─────────────┘  └──────────────┘  └────────────────┘│
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────┐
│                    Backend (NestJS)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐│
│  │ Controllers │  │   Services   │  │   Validators   ││
│  │   (REST)    │  │  (Business)  │  │     (DTOs)     ││
│  └─────────────┘  └──────────────┘  └────────────────┘│
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma ORM
┌───────────────────────▼─────────────────────────────────┐
│                PostgreSQL Database                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐│
│  │    Users    │  │    Lessons   │  │ Quran Verses   ││
│  │  Exercises  │  │   Progress   │  │  Word Analysis ││
│  └─────────────┘  └──────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Key Technologies

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Testing**: Playwright

#### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT + Passport
- **Caching**: Redis + ioredis
- **Validation**: class-validator
- **Testing**: Jest

---

## Code Style Guide

### TypeScript
```typescript
// ✅ DO: Use proper types
interface UserData {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): Promise<UserData> {
  return fetchUser(id);
}

// ❌ DON'T: Use 'any'
function getUser(id: any): any {
  return fetchUser(id);
}
```

### React Components
```typescript
// ✅ DO: Export interfaces, use proper naming
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ DON'T: Inline prop types
export function Button(props: any) {
  return <button>{props.children}</button>;
}
```

### CSS/Tailwind
```typescript
// ✅ DO: Use Tailwind classes
<div className="flex items-center gap-4 p-6 rounded-lg">

// ❌ DON'T: Use inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

### Commits
```bash
# ✅ DO: Descriptive commit messages
git commit -m "feat: add word comparison feature

- Add comparison store
- Create comparison UI component
- Implement side-by-side view
- Add tests

Co-Authored-By: Claude <noreply@anthropic.com>"

# ❌ DON'T: Vague messages
git commit -m "update code"
```

---

## Troubleshooting

### Common Issues

#### 1. "Port 3000 is already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 2. "Database connection failed"
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Use pgAdmin or Services app
```

#### 3. "Prisma client not generated"
```bash
cd backend
npx prisma generate
```

#### 4. "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. "Build failed" errors
```bash
# Clear Next.js cache
rm -rf frontend/.next
cd frontend
npm run build
```

### Getting Help

1. **Check Documentation**: Read PROJECT_CONSTRAINTS.md
2. **Search Issues**: GitHub issues or project Discord
3. **Ask Team**: Slack channel or team lead
4. **Debug**: Use console.log, React DevTools, Network tab

---

## Contributing

### Before You Start
1. Read PROJECT_CONSTRAINTS.md
2. Check existing issues
3. Create feature branch from `main`
4. Follow code style guide

### Development Process
1. **Branch**: `git checkout -b feature/your-feature`
2. **Code**: Write code following style guide
3. **Test**: Run type-check, lint, tests
4. **Commit**: Use descriptive commit messages
5. **Push**: `git push origin feature/your-feature`
6. **PR**: Create pull request with description

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Tests pass
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors

## Testing
How to test these changes

## Screenshots (if applicable)
```

---

## Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Guides](https://www.prisma.io/docs/guides)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Tools
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging
- [VS Code Extensions](https://marketplace.visualstudio.com/):
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma

### Community
- **Documentation**: `/docs` folder
- **GitHub**: github.com/your-org/arq
- **Discord**: discord.gg/arq-platform
- **Email**: dev@arqplatform.com

---

## Next Steps

After setup:
1. **Explore Codebase**: Browse components and pages
2. **Read Docs**: PROJECT_CONSTRAINTS.md is essential
3. **Run Tests**: Familiarize yourself with test suite
4. **Pick a Task**: Check GitHub issues for "good first issue"
5. **Ask Questions**: Don't hesitate to ask the team

---

## Quick Reference

### Commands Cheatsheet
```bash
# Backend
cd backend
npm run start:dev       # Start dev server
npm run build           # Build for production
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Run migrations

# Frontend
cd frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run type-check      # Check TypeScript
npm run lint            # Lint code
npm run lint:fix        # Fix lint errors
npm run format          # Format code
npm run test            # Run Playwright tests
```

### Useful Aliases (Optional)
Add to your `~/.bashrc` or `~/.zshrc`:
```bash
alias arq-backend="cd ~/path/to/arQ/backend && npm run start:dev"
alias arq-frontend="cd ~/path/to/arQ/frontend && npm run dev"
alias arq-db="cd ~/path/to/arQ/backend && npx prisma studio"
alias arq-test="cd ~/path/to/arQ/frontend && npm run type-check && npm run lint"
```

---

**Welcome to the arQ team! Happy coding! 🚀**

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
