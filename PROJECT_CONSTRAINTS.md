# PROJECT_CONSTRAINTS.md
**arQ - Quranic Arabic Learning Platform**

**Version:** 2.1
**Last Updated:** 2025-11-04
**Purpose:** Define constraints, patterns, and anti-patterns to prevent systematic mistakes
**Critical:** ALL agents MUST read this file before creating or modifying code

---

## Table of Contents

1. [Tech Stack Constraints](#1-tech-stack-constraints)
2. [Architecture Patterns](#2-architecture-patterns)
3. [Security Constraints](#3-security-constraints)
4. [Code Quality Standards](#4-code-quality-standards)
5. [UI/UX Constraints](#5-uiux-constraints)
6. [Database Constraints](#6-database-constraints)
7. [Component Constraints](#7-component-constraints)
8. [Anti-Patterns to Avoid](#8-anti-patterns-to-avoid)
9. [Arabic Text Handling](#9-arabic-text-handling)
10. [**Quranic Data Source Constraints**](#10-quranic-data-source-constraints) ⚠️ **CRITICAL**
11. [Validation Checklist](#11-validation-checklist)

---

## 1. TECH STACK CONSTRAINTS

### 1.1 Frontend Framework

**REQUIRED:** Next.js 14+ with App Router

```typescript
// ✅ CORRECT: Use App Router structure
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard</div>;
}

// ❌ WRONG: Don't use Pages Router
// pages/dashboard.tsx (deprecated pattern)
```

**Why Next.js 14:**
- Server-side rendering for SEO (critical for marketing pages)
- Built-in API routes (reduces backend complexity)
- Automatic image/font optimization
- Server components (better performance)
- Easy Vercel deployment

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.1

---

### 1.2 UI Library

**REQUIRED:** shadcn/ui + Tailwind CSS

```typescript
// ✅ CORRECT: Use shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ✅ CORRECT: Extend with Tailwind
<Button className="bg-primary hover:bg-primary-light">
  Continue
</Button>

// ❌ WRONG: Don't use inline styles
<button style={{ backgroundColor: '#036635' }}>Continue</button>

// ❌ WRONG: Don't install entire UI libraries
import { MuiButton } from '@mui/material';
```

**Why shadcn/ui:**
- Copy-paste components (you own the code)
- Built on Radix UI (accessible by default)
- Tailwind styling (highly customizable)
- No package bloat

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.2

---

### 1.3 Database & ORM

**REQUIRED:** PostgreSQL 15+ with Prisma ORM

```prisma
// ✅ CORRECT: Use UUID for IDs
model User {
  id        String   @id @default(cuid()) // Use cuid() for sortable UUIDs
  email     String   @unique
  createdAt DateTime @default(now())
}

// ❌ WRONG: Don't use auto-increment IDs
model User {
  id        Int      @id @default(autoincrement())
}
```

**Why PostgreSQL + Prisma:**
- JSONB support for flexible schemas (lesson content, visualization data)
- Full-text search (Arabic text)
- Type-safe queries (Prisma auto-generates types)
- Database migrations (version control)

**Reference:** QURANIC_ARABIC_LMS_DESIGN.md, Section 3

---

### 1.4 State Management

**REQUIRED:** Redux Toolkit + RTK Query

```typescript
// ✅ CORRECT: Redux Toolkit slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const lessonSlice = createSlice({
  name: 'lesson',
  initialState: { currentLesson: null },
  reducers: {
    setLesson: (state, action: PayloadAction<Lesson>) => {
      state.currentLesson = action.payload;
    },
  },
});

// ✅ CORRECT: RTK Query for API calls
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getLesson: builder.query<Lesson, string>({
      query: (id) => `/lessons/${id}`,
    }),
  }),
});
```

**Alternative (Acceptable):** Zustand for simpler apps

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.4

---

### 1.5 Authentication

**REQUIRED:** NextAuth.js

```typescript
// ✅ CORRECT: NextAuth configuration
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      // ... configuration
    }),
  ],
  session: { strategy: 'jwt' },
};

// ❌ WRONG: Don't build custom auth from scratch
// (security vulnerabilities, reinventing the wheel)
```

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.7

---

## 2. ARCHITECTURE PATTERNS

### 2.1 File Organization

**REQUIRED:** Next.js App Router structure

```
arq-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group (auth pages)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Route group (student pages)
│   │   ├── courses/
│   │   ├── lessons/
│   │   └── page.tsx              # /dashboard
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   └── lessons/
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── arabic/                   # Arabic-specific components
│   │   ├── ArabicText.tsx
│   │   ├── WordCard.tsx
│   │   └── VerseDisplay.tsx
│   └── layouts/                  # Layout components
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Helper functions
│   └── design-system.ts          # Design tokens
├── hooks/                        # Custom React hooks
├── store/                        # Redux store
├── types/                        # TypeScript types
├── prisma/                       # Prisma schema & migrations
│   └── schema.prisma
├── public/                       # Static assets
│   ├── fonts/
│   └── images/
└── package.json
```

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 6.1

---

### 2.2 Component Patterns

**REQUIRED:** TypeScript functional components with proper types

```typescript
// ✅ CORRECT: Typed props interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant,
  size = 'md',
  children,
  onClick,
  disabled
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md font-semibold',
        variantStyles[variant],
        sizeStyles[size]
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ WRONG: No types
export function Button(props) {
  return <button>{props.children}</button>;
}

// ❌ WRONG: Using 'any' type
interface ButtonProps {
  variant: any;
  onClick: any;
}
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 2.1

---

### 2.3 Data Fetching Pattern

**REQUIRED:** React Query for client-side, Server Components for server-side

```typescript
// ✅ CORRECT: Server Component (fetch data on server)
// app/lessons/[id]/page.tsx
async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
  });

  return <LessonView lesson={lesson} />;
}

// ✅ CORRECT: Client Component with React Query
'use client';
import { useQuery } from '@tanstack/react-query';

function LessonProgress() {
  const { data, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: () => fetch('/api/progress').then(r => r.json()),
  });

  if (isLoading) return <Skeleton />;
  return <ProgressBar value={data.progress} />;
}

// ❌ WRONG: Using useEffect for data fetching
useEffect(() => {
  fetch('/api/lessons').then(r => r.json()).then(setLessons);
}, []);
```

**Reference:** QURANIC_ARABIC_LMS_DESIGN.md, Section 11.1

---

### 2.4 API Route Pattern

**REQUIRED:** Next.js API routes with proper error handling

```typescript
// ✅ CORRECT: Typed API route with error handling
// app/api/lessons/[id]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().cuid(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params
    const { id } = paramsSchema.parse(params);

    // Fetch data
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ❌ WRONG: No error handling
export async function GET(request, { params }) {
  const lesson = await prisma.lesson.findUnique({ where: { id: params.id } });
  return NextResponse.json(lesson);
}
```

**Reference:** QURANIC_ARABIC_LMS_DESIGN.md, Section 11.1

---

## 3. SECURITY CONSTRAINTS

⚠️ **CRITICAL: Security Grade A- (92/100)** - See COMPREHENSIVE_SECURITY_ANALYSIS.md

### 3.1 Environment Variables

**NEVER hardcode credentials** ⚠️ **Recent incident: .env exposed with 5 JWT secrets**

```typescript
// ✅ CORRECT: Use environment variables
const dbUrl = process.env.DATABASE_URL;
const authSecret = process.env.NEXTAUTH_SECRET;

// ✅ CORRECT: Validate env vars at startup
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(64), // 256-bit minimum
  JWT_REFRESH_SECRET: z.string().min(64),
});

const env = envSchema.parse(process.env);

// ❌ WRONG: Hardcoded credentials
const dbUrl = 'postgresql://user:password@localhost:5432/arq';

// ❌ WRONG: Committing .env file
// Add .env* to .gitignore (except .env.example)
```

**.env.local** (NEVER commit):
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
ACCESS_TOKEN_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
REFRESH_TOKEN_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
JWT_ACCESS_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
JWT_REFRESH_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
REDIS_PASSWORD="your-redis-password"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

**.env.example** (Commit this):
```env
# Generate all secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/arq_dev"
JWT_SECRET="your_jwt_secret_here_generate_with_crypto_randomBytes_32"
ACCESS_TOKEN_SECRET="your_access_token_secret_generate_64_chars"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_generate_64_chars"
JWT_ACCESS_SECRET="your_jwt_access_secret_generate_64_chars"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_generate_64_chars"
REDIS_PASSWORD="your_redis_password_here"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand"
NEXTAUTH_URL="http://localhost:3000"
```

**Security Best Practices:**
- ✅ Use 256-bit (64 hex character) secrets for JWT
- ✅ Rotate secrets quarterly (see SECURITY.md section on rotation)
- ✅ Pre-commit hooks prevent .env commits (installed: `.git/hooks/pre-commit`)
- ✅ Three-layer .gitignore protection (root, backend, frontend)

**Reference:** PROJECT_OVERVIEW.md, Section "Security & Privacy"
**See Also:** SECURITY_IMPROVEMENTS_SUMMARY.md for secret rotation procedures

---

### 3.2 Authentication Guards

**REQUIRED:** Protect routes and API endpoints

```typescript
// ✅ CORRECT: Protect server component
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return <Dashboard user={session.user} />;
}

// ✅ CORRECT: Protect API route
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // ... handle request
}

// ❌ WRONG: No authentication check
async function DashboardPage() {
  return <Dashboard />; // Anyone can access
}
```

**Reference:** QURANIC_ARABIC_LMS_DESIGN.md, Section 7

---

### 3.3 Input Validation

**REQUIRED:** Validate all user input with Zod

```typescript
// ✅ CORRECT: Validate with Zod schema
import { z } from 'zod';

const createLessonSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.object({
    sections: z.array(z.object({
      type: z.enum(['introduction', 'rule', 'example', 'exercise']),
      content: z.string(),
    })),
  }),
  courseId: z.string().cuid(),
});

export async function POST(request: Request) {
  const body = await request.json();

  // Validate
  const result = createLessonSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues },
      { status: 400 }
    );
  }

  // Use validated data
  const { title, content, courseId } = result.data;
  // ...
}

// ❌ WRONG: No validation
const { title, content } = await request.json();
await prisma.lesson.create({ data: { title, content } }); // SQL injection risk
```

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.6

---

### 3.4 SQL Injection Prevention

**REQUIRED:** Use Prisma parameterized queries (automatic protection)

```typescript
// ✅ CORRECT: Prisma prevents SQL injection automatically
const user = await prisma.user.findUnique({
  where: { email: userInput }, // Safe, parameterized
});

// ✅ CORRECT: Even with raw queries, use parameters
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`;

// ❌ WRONG: String concatenation (vulnerable)
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userInput}'`
); // SQL injection vulnerability!
```

**Reference:** PROJECT_OVERVIEW.md, Section "Security Measures"

---

### 3.5 Security Best Practices (From Comprehensive Analysis)

**JWT Token Management:**
```typescript
// ✅ Access Token: Short-lived (15 minutes)
const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
  expiresIn: '15m'
});

// ✅ Refresh Token: Long-lived (7 days) with rotation
const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
  expiresIn: '7d'
});

// Store refresh token hash in database for rotation tracking
await prisma.refreshToken.create({
  data: {
    tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    familyId: generateFamilyId(),
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
});
```

**HttpOnly Cookie Authentication:**
```typescript
// ✅ CORRECT: HttpOnly cookies (XSS protection)
response.cookie('accessToken', accessToken, {
  httpOnly: true,        // Cannot be accessed by JavaScript
  secure: isProduction,  // HTTPS only in production
  sameSite: 'strict',    // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
});

response.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth', // Only sent to auth endpoints
});

// ❌ WRONG: localStorage (XSS vulnerable)
localStorage.setItem('accessToken', accessToken);
```

**Password Security:**
```typescript
// ✅ CORRECT: Bcrypt with 10 salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

// ✅ CORRECT: Constant-time comparison
const valid = await bcrypt.compare(password, user.password);

// ✅ CORRECT: Password complexity requirements
import { IsStrongPassword } from '@/validators/password-strength';

class RegisterDto {
  @IsStrongPassword() // Enforces: upper, lower, number, special char
  password: string;
}
```

**Account Lockout:**
```typescript
// ✅ CORRECT: Redis-based account lockout (5 attempts, 15 min)
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60; // 15 minutes

await accountLockoutService.recordFailedAttempt(email, ipAddress);
const isLocked = await accountLockoutService.isLocked(email, ipAddress);

if (isLocked) {
  throw new UnauthorizedException('Account locked. Try again in 15 minutes.');
}
```

**Token Blacklist:**
```typescript
// ✅ CORRECT: Redis-based token blacklist for logout
await tokenBlacklistService.blacklistToken(accessToken, expiresIn);

// ✅ CORRECT: Blacklist all user tokens on password change
await tokenBlacklistService.blacklistAllUserTokens(userId, 7 * 24 * 60 * 60);
```

**Audit Logging:**
```typescript
// ✅ CORRECT: Log all security events
auditLogService.log({
  eventType: AuditEventType.LOGIN_SUCCESS,
  userId,
  ipAddress: getClientIp(request),
  userAgent: request.headers['user-agent'],
  endpoint: '/api/v1/auth/login',
  method: 'POST',
  statusCode: 200,
  metadata: { duration: Date.now() - startTime },
});

// Event types to log:
// - LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT
// - PASSWORD_CHANGE, TOKEN_REFRESH
// - TOKEN_REUSE_DETECTED (security incident!)
// - ACCOUNT_LOCKED, ACCESS_DENIED
// - DATA_EXPORT_REQUESTED, ACCOUNT_DELETED
```

**GDPR Compliance:**
```typescript
// ✅ CORRECT: Data export endpoint (Article 20)
@Get('gdpr/export')
async exportUserData(@CurrentUser() userId: string) {
  return {
    exportMetadata: {
      userId,
      exportedAt: new Date().toISOString(),
      formatVersion: '1.0',
    },
    userData: {
      profile: await this.getUserProfile(userId),
      progress: await this.getUserProgress(userId),
      exercises: await this.getUserExercises(userId),
      // ... all user data
    }
  };
}

// ✅ CORRECT: Account deletion endpoint (Article 17)
@Delete('gdpr/delete-account')
async deleteAccount(@CurrentUser() userId: string) {
  // Cascade delete all user data
  await prisma.user.delete({
    where: { id: userId },
    // All related data deleted via onDelete: Cascade
  });

  // Audit log BEFORE deletion
  await auditLog.log({ eventType: 'ACCOUNT_DELETED', userId });
}
```

**Security Headers (Helmet.js):**
```typescript
// ✅ CORRECT: Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.sentry.io'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

**Rate Limiting:**
```typescript
// ✅ CORRECT: NestJS Throttler
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // Time window (60 seconds)
      limit: 10,    // Max requests per window
    }),
  ],
})

// Custom rate limit for sensitive operations
@Throttle(5, 60) // 5 requests per minute
@Post('password-reset')
async resetPassword() {}
```

**Reference:** COMPREHENSIVE_SECURITY_ANALYSIS.md, SECURITY.md

---

## 4. CODE QUALITY STANDARDS

### 4.1 TypeScript Configuration

**REQUIRED:** Strict mode enabled

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

```typescript
// ✅ CORRECT: Explicit types
function calculateProgress(completed: number, total: number): number {
  return (completed / total) * 100;
}

// ✅ CORRECT: Nullable types handled
function getUser(id: string): User | null {
  return users.find(u => u.id === id) ?? null;
}

// ❌ WRONG: Using 'any'
function processData(data: any) { // Type-unsafe
  return data.map((item: any) => item.value);
}

// ❌ WRONG: Implicit 'any'
function fetchLesson(id) { // Missing type annotation
  return fetch(`/api/lessons/${id}`);
}
```

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.1

---

### 4.2 ESLint + Prettier

**REQUIRED:** Zero warnings before commit

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn", // Warn on console.log
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

**Git Hook (Pre-commit):**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 8

---

### 4.3 Test Coverage

**REQUIRED:** >80% coverage for critical paths

```typescript
// ✅ CORRECT: Unit test for component
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

**Critical paths that MUST be tested:**
- Authentication flow
- Lesson progress tracking
- Exercise submission and grading
- Payment processing (if applicable)
- Data validation

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 5.3

---

## 5. UI/UX CONSTRAINTS

### 5.1 Color Palette

**REQUIRED:** Use design system colors (no random colors)

```typescript
// ✅ CORRECT: Use design tokens
<div className="bg-primary text-white">Content</div>
<span className="text-noun">Noun</span>
<span className="text-verb">Verb</span>

// ✅ CORRECT: Access via CSS variables
const styles = {
  backgroundColor: 'var(--primary)',
  color: 'var(--noun)',
};

// ❌ WRONG: Hardcoded colors
<div style={{ backgroundColor: '#036635' }}>Content</div>

// ❌ WRONG: Random colors
<span style={{ color: '#ff0000' }}>Error</span> // Use --error instead
```

**Design System Colors:**
```css
:root {
  /* Brand */
  --primary: #036635;        /* Islamic Green */
  --secondary: #D4AF37;      /* Gold */

  /* Grammatical Color Coding */
  --noun: #4169E1;           /* Royal Blue */
  --verb: #2E8B57;           /* Sea Green */
  --particle: #FF8C00;       /* Dark Orange */
  --pronoun: #9370DB;        /* Medium Purple */

  /* I'rab Cases */
  --nominative: #DC143C;     /* Crimson (مرفوع) */
  --accusative: #FF6347;     /* Tomato (منصوب) */
  --genitive: #8B008B;       /* Dark Magenta (مجرور) */

  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 1.1

---

### 5.2 Typography

**REQUIRED:** Proper font loading and RTL support

```typescript
// ✅ CORRECT: Load fonts with Next.js font optimization
// app/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const amiri = localFont({
  src: '../public/fonts/Amiri-Regular.woff2',
  variable: '--font-arabic',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

// ✅ CORRECT: Arabic text with proper font
<p className="font-arabic text-2xl" dir="rtl">
  الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
</p>

// ❌ WRONG: No font specification for Arabic
<p>الْحَمْدُ لِلَّهِ</p> // Will use default font (poor rendering)

// ❌ WRONG: Blocking font load
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri" />
// Use next/font instead
```

**Font Families:**
```css
:root {
  --font-quran: 'KFGQPC Uthmanic Script Hafs', 'Amiri Quran', serif;
  --font-arabic: 'Amiri', 'Traditional Arabic', serif;
  --font-arabic-ui: 'Cairo', 'Tajawal', sans-serif;
  --font-primary: 'Inter', -apple-system, sans-serif;
}
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 1.2

---

### 5.3 RTL (Right-to-Left) Support

**REQUIRED:** All Arabic content MUST have dir="rtl"

```typescript
// ✅ CORRECT: RTL for Arabic content
<div dir="rtl" className="font-arabic text-xl">
  {verseText}
</div>

// ✅ CORRECT: Use logical properties for RTL compatibility
<div className="ms-4"> {/* margin-inline-start (works in both LTR/RTL) */}
  Content
</div>

// ✅ CORRECT: Auto-detect direction
<p dir={isArabic(text) ? 'rtl' : 'ltr'}>
  {text}
</p>

// ❌ WRONG: Missing dir attribute
<div className="font-arabic">
  {verseText} {/* Text will render LTR (backwards) */}
</div>

// ❌ WRONG: Using directional properties
<div className="ml-4"> {/* margin-left (breaks in RTL) */}
  Content
</div>
// Use 'ms-4' (margin-start) instead
```

**Tailwind RTL Plugin:**
```bash
npm install tailwindcss-rtl
```

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
};
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 9.3

---

### 5.4 Accessibility (WCAG 2.1 AA)

**REQUIRED:** All interactive elements must be keyboard accessible

```typescript
// ✅ CORRECT: Accessible button
<button
  onClick={handleClick}
  aria-label="Close dialog"
  className="focus:ring-2 focus:ring-primary focus:outline-none"
>
  <X className="h-4 w-4" />
</button>

// ✅ CORRECT: Form with labels
<label htmlFor="email" className="text-sm font-medium">
  Email Address
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-error text-sm">
    {errors.email.message}
  </p>
)}

// ✅ CORRECT: Custom interactive element
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  aria-pressed={isActive}
>
  Custom Button
</div>

// ❌ WRONG: No label
<button onClick={handleClick}>
  <X /> {/* Screen reader won't know what this does */}
</button>

// ❌ WRONG: Div as button without keyboard support
<div onClick={handleClick}>Click me</div> // Not keyboard accessible
```

**Focus Indicators:**
```css
/* ✅ CORRECT: Always provide focus indicator */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ❌ WRONG: Removing outline without replacement */
*:focus {
  outline: none; /* Accessibility violation */
}
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 7

---

### 5.5 Responsive Design

**REQUIRED:** Mobile-first approach

```typescript
// ✅ CORRECT: Mobile-first responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>

// ✅ CORRECT: Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Heading
</h1>

// ✅ CORRECT: Conditional rendering for mobile
<div className="hidden md:block">
  Desktop sidebar
</div>
<div className="block md:hidden">
  Mobile navigation
</div>

// ❌ WRONG: Desktop-first (harder to maintain)
<div className="w-1/3 md:w-1/2 sm:w-full"> // Backwards logic
  Content
</div>
```

**Breakpoints:**
```css
/* Mobile first */
.element { } /* Default: mobile */

@media (min-width: 640px) { } /* sm: tablet */
@media (min-width: 768px) { } /* md: small laptop */
@media (min-width: 1024px) { } /* lg: desktop */
@media (min-width: 1440px) { } /* xl: large desktop */
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 6

---

## 6. DATABASE CONSTRAINTS

### 6.1 Schema Design

**REQUIRED:** UUID for primary keys, timestamps on all tables

```prisma
// ✅ CORRECT: Prisma schema
model User {
  id        String   @id @default(cuid()) // Use cuid() for sortable UUIDs
  email     String   @unique
  name      String
  role      Role     @default(STUDENT)

  // Always include timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  courses   CourseProgress[]
}

model Lesson {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  slug        String   @unique

  // JSONB for flexible content
  content     Json

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations with proper indexes
  course      Course   @relation(fields: [courseId], references: [id])

  @@index([courseId]) // Add index for foreign keys
  @@index([slug]) // Add index for frequently queried fields
}

// ❌ WRONG: Auto-increment IDs
model User {
  id    Int    @id @default(autoincrement()) // Avoid
  email String
}

// ❌ WRONG: Missing timestamps
model Lesson {
  id    String @id @default(cuid())
  title String
  // Missing createdAt, updatedAt
}

// ❌ WRONG: No indexes on foreign keys
model Lesson {
  courseId String
  course   Course @relation(fields: [courseId], references: [id])
  // Missing @@index([courseId])
}
```

**Reference:** QURANIC_ARABIC_LMS_DESIGN.md, Section 3.1

---

### 6.2 JSONB Usage

**REQUIRED:** Use JSONB for flexible schemas (lesson content, visualization data)

```prisma
model Lesson {
  id      String @id @default(cuid())
  content Json   // JSONB column
}
```

```typescript
// ✅ CORRECT: Typed JSONB content
interface LessonContent {
  sections: Array<{
    section_id: string;
    section_type: 'introduction' | 'rule' | 'example' | 'exercise';
    title: {
      en: string;
      ar: string;
    };
    content: {
      en: string;
      ar: string;
    };
    display_order: number;
  }>;
  learning_objectives: Array<{
    objective_id: string;
    text_en: string;
    text_ar: string;
  }>;
}

const lesson = await prisma.lesson.findUnique({
  where: { id: lessonId },
});

// Type-cast JSONB to typed interface
const content = lesson.content as LessonContent;

// Access typed data
content.sections.forEach(section => {
  console.log(section.title.en); // Type-safe
});

// ✅ CORRECT: Query JSONB fields
const lessons = await prisma.lesson.findMany({
  where: {
    content: {
      path: ['sections', '0', 'section_type'],
      equals: 'introduction',
    },
  },
});

// ❌ WRONG: No type safety
const content: any = lesson.content; // Lost type information
content.sections.forEach((section: any) => {
  console.log(section.title.en); // No autocomplete, no safety
});
```

**Why JSONB:**
- Flexible schema for UI variations (color-coded, tree diagram, card stack)
- Easy to add new fields without migrations
- GIN indexes make queries fast
- Perfect for multilingual content

**Reference:** QURANIC_ARABIC_LMS_DESIGN.md, Section 3.2

---

### 6.3 Indexing Strategy

**REQUIRED:** Index all foreign keys and frequently queried fields

```prisma
model Lesson {
  id       String @id @default(cuid())
  courseId String
  slug     String @unique

  course   Course @relation(fields: [courseId], references: [id])

  // ✅ CORRECT: Indexes on foreign keys
  @@index([courseId])

  // ✅ CORRECT: Index on unique slug for fast lookups
  @@index([slug])
}

model UserCourseProgress {
  userId   String
  courseId String
  progress Float

  user     User   @relation(fields: [userId], references: [id])
  course   Course @relation(fields: [courseId], references: [id])

  // ✅ CORRECT: Composite unique constraint
  @@unique([userId, courseId])

  // ✅ CORRECT: Indexes for queries
  @@index([userId]) // Query all courses for a user
  @@index([courseId]) // Query all users for a course
}

// ❌ WRONG: Missing indexes
model Lesson {
  courseId String
  course   Course @relation(fields: [courseId], references: [id])
  // Missing @@index([courseId]) - slow queries
}
```

**Reference:** DATA_ARCHITECTURE.md (from project docs)

---

### 6.4 Data Validation

**REQUIRED:** Validate data before database operations

```typescript
// ✅ CORRECT: Validate with Zod before Prisma
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
});

async function createUser(data: unknown) {
  // Validate first
  const validated = createUserSchema.parse(data);

  // Hash password
  const hashedPassword = await bcrypt.hash(validated.password, 12);

  // Then create
  const user = await prisma.user.create({
    data: {
      email: validated.email,
      name: validated.name,
      passwordHash: hashedPassword,
    },
  });

  return user;
}

// ❌ WRONG: No validation before database
async function createUser(data: any) {
  return prisma.user.create({ data }); // Unvalidated data
}
```

**Reference:** TEMPLATES_AND_FRAMEWORKS_RECOMMENDATIONS.md, Section 1.6

---

## 7. COMPONENT CONSTRAINTS

### 7.1 Component Structure

**REQUIRED:** Export props interface, use TypeScript

```typescript
// ✅ CORRECT: Proper component structure
// components/ui/Button.tsx
import { cn } from '@/lib/utils';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md font-semibold transition-colors',
        {
          'bg-primary text-white hover:bg-primary-light': variant === 'primary',
          'bg-secondary text-white hover:bg-secondary-light': variant === 'secondary',
          'border border-gray-300 hover:bg-gray-50': variant === 'outline',
          'hover:bg-gray-100': variant === 'ghost',
        },
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2.5 text-base': size === 'md',
          'px-5 py-3 text-lg': size === 'lg',
        },
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ WRONG: Missing exports, no types
function Button(props) {
  return <button>{props.children}</button>;
}

// ❌ WRONG: Not exporting props interface
interface ButtonProps { ... }
export function Button({ ... }: ButtonProps) { ... }
// Should export ButtonProps for reuse
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 2.1

---

### 7.2 Composition over Props Drilling

**REQUIRED:** Don't pass props more than 2 levels deep

```typescript
// ✅ CORRECT: Use context for deeply nested data
// contexts/LessonContext.tsx
const LessonContext = createContext<LessonContextValue | null>(null);

export function LessonProvider({ children, lessonId }: Props) {
  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => fetchLesson(lessonId),
  });

  return (
    <LessonContext.Provider value={{ lesson }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const context = useContext(LessonContext);
  if (!context) throw new Error('useLesson must be used within LessonProvider');
  return context;
}

// Components can access lesson without prop drilling
function WordCard() {
  const { lesson } = useLesson(); // No props needed
  return <div>{lesson.title}</div>;
}

// ❌ WRONG: Props drilling (passing through multiple levels)
<GrandParent lesson={lesson}>
  <Parent lesson={lesson}>
    <Child lesson={lesson}>
      <GrandChild lesson={lesson} /> {/* 4 levels deep! */}
    </Child>
  </Parent>
</GrandParent>
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 4

---

### 7.3 Performance Optimization

**REQUIRED:** Memoize expensive computations and components

```typescript
// ✅ CORRECT: Memoize expensive computation
import { useMemo } from 'react';

function WordAnalysis({ word }: Props) {
  const analysis = useMemo(() => {
    return analyzeWordGrammar(word); // Expensive operation
  }, [word]); // Only recompute when word changes

  return <div>{analysis.pos}</div>;
}

// ✅ CORRECT: Memoize component
import { memo } from 'react';

const WordCard = memo(function WordCard({ word }: Props) {
  return (
    <div className="card">
      <ArabicText text={word.text} />
      <span>{word.translation}</span>
    </div>
  );
});

// ✅ CORRECT: Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';

function VerseList({ verses }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: verses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(item => (
          <VerseCard key={item.key} verse={verses[item.index]} />
        ))}
      </div>
    </div>
  );
}

// ❌ WRONG: No memoization
function WordAnalysis({ word }: Props) {
  const analysis = analyzeWordGrammar(word); // Runs on every render
  return <div>{analysis.pos}</div>;
}

// ❌ WRONG: Rendering 1000s of items without virtualization
<div>
  {verses.map(verse => <VerseCard verse={verse} />)} {/* DOM explosion */}
</div>
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 8.5

---

## 8. ANTI-PATTERNS TO AVOID

### 8.1 NO Inline Styles

```typescript
// ❌ WRONG: Inline styles
<div style={{ backgroundColor: '#036635', padding: '16px' }}>
  Content
</div>

// ✅ CORRECT: Use Tailwind classes
<div className="bg-primary p-4">
  Content
</div>

// ✅ CORRECT: If dynamic, use CSS variables
<div style={{ backgroundColor: `var(--${color})` }}>
  Content
</div>
```

---

### 8.2 NO 'any' Type

```typescript
// ❌ WRONG: Using 'any'
function processData(data: any) {
  return data.map((item: any) => item.value);
}

// ✅ CORRECT: Proper types
interface DataItem {
  value: string;
  label: string;
}

function processData(data: DataItem[]) {
  return data.map(item => item.value);
}

// ✅ CORRECT: Unknown for truly unknown data
function processApiResponse(data: unknown) {
  // Validate before use
  const validated = apiResponseSchema.parse(data);
  return validated;
}
```

---

### 8.3 NO console.log in Production

```typescript
// ❌ WRONG: Console logs in production
console.log('User data:', user); // Remove before commit

// ✅ CORRECT: Use proper logging library
import { logger } from '@/lib/logger';

logger.info('User logged in', { userId: user.id });

// ✅ CORRECT: Development-only logs
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

**Configure ESLint:**
```json
{
  "rules": {
    "no-console": "warn" // Prevents accidental commits
  }
}
```

---

### 8.4 NO API Calls in Components

```typescript
// ❌ WRONG: Direct API calls in component
function LessonList() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch('/api/lessons')
      .then(r => r.json())
      .then(setLessons);
  }, []);

  return <div>{lessons.map(...)}</div>;
}

// ✅ CORRECT: Use React Query hook
function LessonList() {
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => fetch('/api/lessons').then(r => r.json()),
  });

  if (isLoading) return <Skeleton />;
  return <div>{lessons.map(...)}</div>;
}

// ✅ CORRECT: Custom hook abstraction
function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: () => fetch('/api/lessons').then(r => r.json()),
  });
}

function LessonList() {
  const { data: lessons, isLoading } = useLessons();
  // ...
}
```

---

### 8.5 NO Prop Drilling > 2 Levels

```typescript
// ❌ WRONG: Prop drilling
<Level1 user={user}>
  <Level2 user={user}>
    <Level3 user={user}>
      <Level4 user={user} /> {/* Too deep! */}
    </Level3>
  </Level2>
</Level1>

// ✅ CORRECT: Use Context or Redux
const UserContext = createContext<User | null>(null);

function App() {
  const user = useCurrentUser();
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}

function DeepNestedComponent() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

---

## 9. ARABIC TEXT HANDLING

### 9.1 Font Loading

**REQUIRED:** Preload Arabic fonts, subset for performance

```typescript
// ✅ CORRECT: Next.js font optimization
import localFont from 'next/font/local';

const amiri = localFont({
  src: [
    {
      path: '../public/fonts/Amiri-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Amiri-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-arabic',
  display: 'swap', // Prevent invisible text (FOIT)
  preload: true, // Preload for faster rendering
  // Subset for Arabic range only (smaller file size)
  // Use https://wakamaifondue.com/ to generate subsets
});

// ❌ WRONG: External font loading (slow)
<link
  href="https://fonts.googleapis.com/css2?family=Amiri"
  rel="stylesheet"
/>
```

**Font Subsetting:**
```bash
# Use pyftsubset (from fonttools) to subset fonts
pip install fonttools

pyftsubset Amiri-Regular.ttf \
  --unicodes="U+0600-06FF" \ # Arabic block
  --output-file="Amiri-Regular-subset.woff2" \
  --flavor=woff2
```

**Reference:** COMPREHENSIVE_UI_REQUIREMENTS.md, Section 1.2

---

### 9.2 Diacritic Handling

**REQUIRED:** Proper line-height for diacritics

```typescript
// ✅ CORRECT: Arabic text with proper styling
<p
  className="font-quran text-3xl leading-loose" // Extra line-height
  dir="rtl"
  style={{
    textRendering: 'optimizeLegibility', // Better diacritic rendering
  }}
>
  {verseText}
</p>

// CSS for diacritics
.quran-text {
  font-family: var(--font-quran);
  line-height: 2.5; /* Extra space for diacritics above/below */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// ❌ WRONG: Tight line-height (diacritics cut off)
<p className="font-quran text-3xl leading-tight" dir="rtl">
  {verseText} {/* Diacritics will overlap/be cut off */}
</p>
```

---

### 9.3 Word-by-Word Display

**REQUIRED:** Proper word segmentation for clickable words

```typescript
// ✅ CORRECT: Render verse as clickable words
interface Word {
  id: string;
  text: string;
  position: number;
  analysis: GrammaticalAnalysis;
}

function VerseDisplay({ verse, words }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  return (
    <div dir="rtl" className="font-quran text-3xl leading-loose">
      {words.map((word, index) => (
        <React.Fragment key={word.id}>
          <span
            className={cn(
              'cursor-pointer transition-colors',
              'hover:bg-gray-100 rounded px-1',
              word.id === selectedWord && 'bg-primary-light text-white'
            )}
            onClick={() => setSelectedWord(word.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSelectedWord(word.id);
            }}
            aria-label={`Word ${index + 1}: ${word.text}`}
          >
            {word.text}
          </span>
          {index < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </div>
  );
}

// ❌ WRONG: Entire verse as one string (can't click individual words)
<div dir="rtl" className="font-quran text-3xl">
  {verse.fullText}
</div>
```

**Reference:** UI_DESIGN_RECOMMENDATIONS_AND_EVALUATION.md, Section 1

---

## 10. QURANIC DATA SOURCE CONSTRAINTS

⚠️ **CRITICAL RULE: WE ARE NOT ISLAMIC SCHOLARS**

### 10.1 Philosophy: Zero Inference, Zero Modification

**Golden Rule:** We are SOFTWARE ENGINEERS, not scholars. Our role is to:
- ✅ Fetch authoritative data
- ✅ Store it accurately
- ✅ Present it beautifully
- ❌ **NEVER** make scholarly decisions
- ❌ **NEVER** infer or guess grammar
- ❌ **NEVER** modify religious content

---

### 10.2 Authorized Data Sources

**ONLY these sources are permitted:**

#### Source 1: Quranic Text & Translation
- **Primary:** quran.com API (`https://quran.com/api/`)
- **Fallback:** api.alquran.cloud (`https://api.alquran.cloud/v1`)
- **What we fetch:** Arabic text (Uthmani script), English translations
- **Editions allowed:**
  - `quran-uthmani` (with diacritics)
  - `quran-simple` (without diacritics)
  - `en.sahih` (Sahih International translation)

#### Source 2: Grammatical Analysis
- **Primary:** corpus.quran.com (Quranic Arabic Corpus)
- **URL:** `http://corpus.quran.com`
- **Download:** `http://corpus.quran.com/download/`
- **Version:** v0.4 (or latest official release)
- **What we fetch:** Complete morphological analysis for all 77,429 words
- **Authority:** Peer-reviewed by Islamic scholars, University of Leeds
- **License:** GNU GPL (free to use, must attribute)

**NO OTHER SOURCES PERMITTED.**

---

### 10.3 Forbidden Practices

```typescript
// ❌ FORBIDDEN: Inferring grammar rules
function inferPOS(word: string): string {
  if (word.startsWith('و')) return 'particle'; // WE ARE NOT SCHOLARS!
  return 'noun'; // GUESSING IS FORBIDDEN!
}

// ❌ FORBIDDEN: Default/placeholder grammar
const grammarData = {
  gender: 'masculine',     // DEFAULT GUESS - FORBIDDEN!
  number: 'singular',      // DEFAULT GUESS - FORBIDDEN!
  case: 'nominative',      // DEFAULT GUESS - FORBIDDEN!
};

// ❌ FORBIDDEN: Modifying Arabic text
const modified = arabicText.replace('ا', 'أ'); // NEVER MODIFY QURAN!

// ❌ FORBIDDEN: Using third-party/unofficial sources
const data = await fetch('https://random-quran-api.com'); // NOT AUTHORIZED!
const data = await fetch('https://github.com/someuser/quran-data'); // NOT AUTHORIZED!

// ❌ FORBIDDEN: Creating our own translations
const translation = translateArabicToEnglish(text); // WE ARE NOT TRANSLATORS!
```

---

### 10.4 Permitted Operations

```typescript
// ✅ PERMITTED: Unicode normalization (technical, not content)
const normalized = arabicText.normalize('NFC');
// Why: Ensures consistent Unicode encoding
// Effect: ZERO visual change, same characters

// ✅ PERMITTED: Whitespace trimming
const trimmed = text.trim();
// Why: Remove extra spaces from API responses
// Effect: Cleaner storage, no meaning change

// ✅ PERMITTED: Fetching from authorized sources
const verse = await fetch('https://api.alquran.cloud/v1/ayah/1:1');
const morphology = await fetchFromCorpusQuran(1, 1);

// ✅ PERMITTED: Storing data as-is
await prisma.verseWord.create({
  data: {
    posType: corpusData.pos,           // Direct from corpus
    gender: corpusData.gender,         // Direct from corpus
    irabCase: corpusData.case,         // Direct from corpus
  }
});

// ✅ PERMITTED: Presenting data beautifully
<div className="bg-noun text-white">
  {word.posType} {/* Displaying what scholars decided */}
</div>
```

---

### 10.5 Data Flow Requirements

**REQUIRED Pipeline:**

```
Step 1: Fetch from Authorized Source
    ↓
  quran.com API (text)
  corpus.quran.com (grammar)
    ↓
Step 2: Validate Data Received
    ↓
  Check: Is this from authorized source?
  Check: Is data complete?
  Check: No modifications made?
    ↓
Step 3: Store Exactly As-Is
    ↓
  PostgreSQL database
  NO transformations (except Unicode NFC, whitespace trim)
    ↓
Step 4: Display Beautifully
    ↓
  UI components with Islamic design
  Color-coding, visualizations, interactivity
```

**FORBIDDEN:**
```
❌ Fetch → Infer Grammar → Store
❌ Fetch → Modify Text → Store
❌ Fetch from Unauthorized → Store
❌ Use Placeholder Data → Store
```

---

### 10.6 Attribution Requirements

**REQUIRED in UI footer and documentation:**

```typescript
// ✅ REQUIRED: Attribution component
export function DataAttribution() {
  return (
    <div className="text-sm text-gray-600">
      <p>
        Quranic text from{' '}
        <a href="https://quran.com" className="underline">
          quran.com
        </a>
      </p>
      <p>
        Grammatical analysis from{' '}
        <a href="http://corpus.quran.com" className="underline">
          Quranic Arabic Corpus
        </a>
        {' '}(University of Leeds)
      </p>
      <p>English translation: Sahih International</p>
    </div>
  );
}
```

**License Compliance:**
- Quranic Corpus: GNU GPL (must link back, cannot modify original)
- quran.com: Must attribute source
- Cannot claim original authorship of Quranic data

---

### 10.7 Code Review Checklist for Quranic Data

Before ANY commit involving Quranic data:

- [ ] **Source verification:** Data comes from quran.com OR corpus.quran.com ONLY
- [ ] **Zero inference:** No `inferPOS()`, `inferGrammar()`, or similar functions
- [ ] **Zero defaults:** No default values like `gender: 'masculine'`
- [ ] **Zero modifications:** Arabic text stored exactly as received
- [ ] **Attribution present:** Links to quran.com and corpus.quran.com
- [ ] **License compliance:** GNU GPL terms followed (if using Corpus data)
- [ ] **No third-party sources:** No GitHub repos, random APIs, etc.
- [ ] **Validation present:** Check that fetched data is complete

---

### 10.8 What to Do If Source is Unavailable

**If corpus.quran.com is down or unavailable:**

```typescript
// ✅ CORRECT: Fail gracefully, inform user
if (!morphologyData) {
  return {
    error: 'Unable to fetch grammatical data from authoritative source',
    message: 'Please try again later. We only use peer-reviewed data.',
    fallback: null, // NO FALLBACK TO INFERENCE!
  };
}

// ❌ WRONG: Use inference as fallback
if (!morphologyData) {
  return inferMorphology(word); // FORBIDDEN!
}
```

**Options when source is unavailable:**
1. Show cached data (if previously fetched)
2. Show error message to user
3. Contact corpus.quran.com team for access
4. Wait for service to resume
5. **NEVER** use inference or third-party sources as fallback

---

### 10.9 Placeholder Code Must Be Marked

**If using placeholder data for development/testing:**

```typescript
// ✅ CORRECT: Clearly marked placeholder
/**
 * ⚠️ PLACEHOLDER DATA - FOR DEVELOPMENT ONLY
 * TODO: Replace with corpus.quran.com data before production
 * See: backend/src/scripts/fetchers/quran-corpus-fetcher.ts
 */
const PLACEHOLDER_MORPHOLOGY = {
  pos: 'noun',
  note: 'THIS IS NOT REAL DATA - DO NOT USE IN PRODUCTION',
};

if (process.env.NODE_ENV === 'production') {
  throw new Error('Placeholder morphology data used in production!');
}

// ❌ WRONG: Unmarked placeholder that looks real
const morphology = {
  pos: 'noun',
  gender: 'masculine',
}; // Looks real, but isn't!
```

---

### 10.10 Emergency Contact

**If you need Quranic data and unsure about source:**

1. **Stop immediately** - Do not guess or infer
2. **Check this document** - Is source in section 10.2?
3. **Ask user/team** - Get explicit approval
4. **Document decision** - Update this constraint file
5. **Never proceed** with uncertain sources

**Remember:** Better to wait for authoritative data than to use incorrect data.

---

### 10.11 Examples of Violations

**Real violations to avoid:**

```typescript
// ❌ VIOLATION 1: Using GitHub mirror without checking
const data = await fetch('https://raw.githubusercontent.com/user/quran/data.json');
// Problem: Not official source, might be modified

// ❌ VIOLATION 2: Inferring based on rules
if (word.includes('ال')) {
  definiteness = 'definite'; // Scholar decision, not ours!
}

// ❌ VIOLATION 3: Combining multiple sources without verification
const text = await fetch('source1.com');
const morphology = await fetch('source2.com');
// Problem: Sources might be inconsistent

// ❌ VIOLATION 4: Using AI/ML to analyze
const analysis = await openai.analyze(arabicWord);
// Problem: AI is not a scholar, not authoritative

// ❌ VIOLATION 5: Copy-paste from random website
const verses = [
  { text: 'بسم الله', translation: 'In the name' }, // Where did this come from?
];
```

---

### 10.12 When in Doubt

**ASK THESE QUESTIONS:**

1. Is this data from quran.com or corpus.quran.com?
   - **YES** → Proceed
   - **NO** → STOP

2. Am I modifying the content in any way?
   - **NO** → Proceed
   - **YES** → STOP (unless Unicode normalization/whitespace)

3. Am I making any scholarly decisions?
   - **NO** → Proceed
   - **YES** → STOP

4. Can I trace this data back to its authoritative source?
   - **YES** → Proceed
   - **NO** → STOP

**If ANY answer is wrong, DO NOT proceed.**

---

## 11. VALIDATION CHECKLIST

Before committing ANY code, verify:

### 11.1 Code Quality
- [ ] TypeScript compiles with **0 errors** (`npm run type-check`)
- [ ] ESLint passes with **0 warnings** (`npm run lint`)
- [ ] Prettier formatting applied (`npm run format`)
- [ ] No `console.log` statements in code
- [ ] No `any` types used
- [ ] All imports are used (no unused imports)

### 11.2 Functionality
- [ ] Feature works as intended
- [ ] Edge cases handled (empty states, errors, loading)
- [ ] Form validation works (try invalid inputs)
- [ ] Error handling implemented (try to break it)

### 11.3 Security
- [ ] No hardcoded credentials (check for API keys, passwords)
- [ ] Input validation on all user inputs
- [ ] Authentication checks on protected routes
- [ ] SQL injection prevention (using Prisma parameterized queries)
- [ ] XSS prevention (React auto-escapes, but verify user-generated content)

### 11.4 Performance
- [ ] No blocking operations on main thread
- [ ] Images optimized (use next/image)
- [ ] Fonts preloaded (use next/font)
- [ ] Long lists virtualized (use @tanstack/react-virtual)
- [ ] Expensive computations memoized (useMemo, memo)

### 11.5 Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels on buttons/inputs
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Focus indicators visible

### 11.6 Responsive Design
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Touch targets > 44px (mobile)

### 11.7 Arabic/RTL
- [ ] Arabic text has `dir="rtl"`
- [ ] Proper fonts loaded (Amiri, Uthmanic Script)
- [ ] Diacritics render correctly (check line-height)
- [ ] RTL layout works (test with actual Arabic content)

### 11.8 Testing
- [ ] Unit tests written for new functions/components
- [ ] Tests pass (`npm run test`)
- [ ] Critical paths tested (auth, payments, data validation)
- [ ] E2E tests for user flows (if applicable)

### 11.9 Quranic Data (if applicable)
- [ ] Data comes ONLY from quran.com OR corpus.quran.com
- [ ] NO inference functions (`inferPOS`, `inferGrammar`, etc.)
- [ ] NO default values for grammar (no `gender: 'masculine'` defaults)
- [ ] NO modifications to Arabic text (except Unicode NFC, whitespace trim)
- [ ] Attribution links present (quran.com, corpus.quran.com)
- [ ] GNU GPL license compliance (for corpus.quran.com data)
- [ ] Placeholder code clearly marked with warnings
- [ ] Fails gracefully if authoritative source unavailable (no inference fallback)

---

## APPENDIX A: Quick Reference Commands

### Development
```bash
# Start dev server
npm run dev

# Type-check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Test
npm run test

# Build
npm run build
```

### Database
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Push schema changes (dev only)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Git Workflow
```bash
# Before commit
npm run lint
npm run type-check
npm run test

# Commit
git add .
git commit -m "feat: add lesson viewer component"

# Pre-commit hook will run automatically (lint-staged)
```

---

## APPENDIX B: Common Patterns

### Pattern: Server Component with Data Fetching
```typescript
// app/lessons/[id]/page.tsx
import { prisma } from '@/lib/prisma';

async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: { course: true },
  });

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} />;
}
```

### Pattern: Client Component with React Query
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';

export function LessonProgress({ lessonId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['progress', lessonId],
    queryFn: () => fetch(`/api/progress/${lessonId}`).then(r => r.json()),
  });

  if (isLoading) return <Skeleton />;
  return <ProgressBar value={data.progress} />;
}
```

### Pattern: Form with Validation
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## VERSION HISTORY

**v2.1 (2025-11-04)**
- **CRITICAL:** Added Section 10: Quranic Data Source Constraints
- Enforces use of ONLY quran.com and corpus.quran.com as data sources
- Prohibits all inference, guessing, or default values for Quranic grammar
- Prohibits use of third-party sources (GitHub mirrors, random APIs)
- Requires proper attribution and GNU GPL compliance
- Added Quranic data checklist to validation section (11.9)
- **Rationale:** Prevents use of unauthentic data or scholarly inference by non-scholars

**v2.0 (2025-11-04)**
- Comprehensive rewrite based on all specification documents
- Added tech stack constraints (Next.js 14, shadcn/ui, Prisma)
- Added architecture patterns
- Added security constraints
- Added code quality standards
- Added UI/UX constraints
- Added database constraints
- Added component constraints
- Added anti-patterns section
- Added Arabic text handling
- Added validation checklist
- Added appendices with quick reference and common patterns

**v1.0 (2025-11-02)**
- Initial version with UX patterns

---

## FEEDBACK & UPDATES

This document should be updated when:
- New patterns are discovered
- Common mistakes are identified
- Tech stack changes
- Security vulnerabilities are found
- Performance bottlenecks are discovered

**How to update:**
1. Create a new section or update existing
2. Add version number and date
3. Notify all team members
4. Update version history

---

---

## 12. CRITICAL TESTING REQUIREMENTS

**Version:** 3.0
**Last Updated:** 2025-11-07
**Based On:** Analysis of 283 test failures from production test run

⚠️ **MANDATORY POLICY: 100% Playwright MCP Test Coverage**

**ALL UI features MUST have comprehensive Playwright E2E tests before being considered complete.**

---

### 12.1 Test Execution Requirements

**Before ANY pull request:**

```bash
# Navigate to frontend
cd /home/dev/Development/arQ/frontend

# Run ALL E2E tests
NEXT_PUBLIC_APP_URL=http://localhost:3005 npx playwright test --reporter=list

# REQUIRED: 100% pass rate (0 failures allowed)
# Current baseline: 3,528 tests
```

**Test Success Criteria:**
- ✅ All tests must pass (3,528/3,528)
- ✅ Zero compilation errors
- ✅ Zero timeout errors
- ✅ Test execution < 5 minutes

---

### 12.2 Root Cause Analysis: Never Repeat These Mistakes

**Documented from 2025-11-07 test run with 283 failures:**

#### ❌ ANTI-PATTERN 1: Missing Test Data (150+ failures)

**Symptoms:**
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded
Cannot find lesson/exercise/achievement elements
Empty arrays from API endpoints
```

**Root Cause:**
- Database not seeded with test data
- Tests expect lessons, exercises, achievements to exist
- API returns empty arrays `[]`

**Solution:**
```bash
# ALWAYS seed database before running tests
cd /home/dev/Development/arQ/backend
npm run seed

# Verify data exists
npx prisma studio
```

**Agent Requirement:**
```typescript
// BEFORE creating ANY UI feature with database dependencies:

// 1. Check if seed script exists
if (!fs.existsSync('prisma/seed.ts')) {
  throw new Error('Create seed script first!');
}

// 2. Verify test data requirements
const REQUIRED_TEST_DATA = {
  lessons: { trackA: 5, trackB: 5 },
  exercises: { multipleChoice: 10, trueFalse: 10 },
  achievements: { bronze: 5, silver: 5, gold: 5 },
};

// 3. Run seed before tests
await exec('npm run seed');

// 4. Verify data was seeded
const lessonCount = await prisma.lesson.count();
if (lessonCount === 0) {
  throw new Error('Seed failed - no lessons in database');
}
```

---

#### ❌ ANTI-PATTERN 2: Form Validation Not Displaying Errors (60+ failures)

**Symptoms:**
```
Test expects error message "Invalid email format"
No error message displayed in UI
Form submits with invalid data
```

**Root Cause:**
- Client-side validation not implemented
- Server validation errors not captured
- Error messages not displayed in UI

**Solution - ALWAYS implement BOTH validations:**

```typescript
// 1. CLIENT-SIDE VALIDATION (immediate feedback)
const validateLoginForm = (data: LoginData) => {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
};

// 2. SERVER-SIDE VALIDATION (security)
// backend/src/modules/auth/dto/login.dto.ts
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

// 3. DISPLAY ERRORS IN UI (MANDATORY)
const LoginForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: LoginData) => {
    // Step 1: Client validation
    const clientErrors = validateLoginForm(data);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return; // STOP if client validation fails
    }

    try {
      // Step 2: Submit to server
      const response = await api.login(data);
    } catch (error) {
      // Step 3: Display server errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        error={errors.email} // MUST display error
      />
      {errors.email && ( // MUST show error message
        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
      )}
      <Input
        name="password"
        error={errors.password}
      />
      {errors.password && (
        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
      )}
      {errors.general && (
        <Alert variant="error">{errors.general}</Alert>
      )}
    </form>
  );
};
```

**Agent Checklist:**
- [ ] Client validation function created
- [ ] Server validation DTO created
- [ ] Error state managed in component
- [ ] Errors displayed in UI
- [ ] Test written to verify error display

---

#### ❌ ANTI-PATTERN 3: Missing Dependencies (Build failures)

**Symptoms:**
```
Cannot find module '@prisma/client'
Cannot find module 'prom-client'
TypeScript compilation fails
```

**Root Cause:**
- Package used but not in package.json
- Dependencies not installed

**Solution:**
```bash
# BEFORE using ANY package:

# 1. Check if it exists
grep "package-name" package.json || echo "Package not found!"

# 2. Install if missing
npm install package-name

# 3. Verify installation
npm list package-name
```

**Agent Requirement:**
```typescript
// NEVER use a package without checking installation

// ❌ WRONG
import { PrismaClient } from '@prisma/client'; // Assumes installed

// ✅ CORRECT
// 1. Check package.json first
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
if (!packageJson.dependencies['@prisma/client']) {
  throw new Error('@prisma/client not installed. Run: npm install @prisma/client');
}

// 2. Then import
import { PrismaClient } from '@prisma/client';
```

---

### 12.3 Test Data Requirements (MANDATORY)

**Every test database MUST have:**

```typescript
// backend/prisma/seed-test-data.ts

export const MINIMUM_TEST_DATA = {
  users: {
    demo: {
      email: 'demo@arq.com',
      password: 'Demo123!',
      role: 'STUDENT',
      emailVerified: true,
    },
  },

  lessons: {
    trackA: {
      beginner: 5,      // At least 5 Track A beginner lessons
      intermediate: 5,  // At least 5 Track A intermediate lessons
      advanced: 3,      // At least 3 Track A advanced lessons
    },
    trackB: {
      beginner: 5,
      intermediate: 5,
      advanced: 3,
    },
  },

  exercises: {
    multipleChoice: 10,   // At least 10 multiple choice
    trueFalse: 10,        // At least 10 true/false
    fillInBlank: 10,      // At least 10 fill-in-blank
  },

  achievements: {
    bronze: 5,     // At least 5 bronze tier
    silver: 5,     // At least 5 silver tier
    gold: 5,       // At least 5 gold tier
    platinum: 3,   // At least 3 platinum tier
  },

  verses: {
    minimumSurahs: 1,   // At least Surah Al-Fatiha
    minimumVerses: 7,   // At least 7 verses
  },

  progress: {
    demo: {
      lessonsCompleted: 2,
      exercisesCompleted: 5,
      xpEarned: 500,
      currentStreak: 3,
    },
  },
};
```

**Seed Script Template:**

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test database...');

  // 1. Create demo user
  const hashedPassword = await bcrypt.hash('Demo123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@arq.com' },
    update: {},
    create: {
      email: 'demo@arq.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'STUDENT',
      emailVerified: true,
    },
  });
  console.log('✅ Demo user created');

  // 2. Create Track A lessons
  for (let i = 1; i <= 5; i++) {
    await prisma.lesson.create({
      data: {
        title: `Track A - Beginner Lesson ${i}`,
        track: 'A',
        difficulty: 'BEGINNER',
        content: { /* ... */ },
      },
    });
  }
  console.log('✅ Track A lessons created');

  // 3. Create exercises
  // 4. Create achievements
  // 5. Create progress data

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

### 12.4 Test Writing Standards

**EVERY new feature MUST include these test types:**

#### 1. Display Tests
```typescript
test('should display all required elements', async ({ page }) => {
  await page.goto('/achievements');

  // Verify page loads
  await expect(page.locator('h1')).toContainText('Achievements');

  // Verify all UI elements present
  await expect(page.locator('[data-testid="achievement-card"]')).toBeVisible();
  await expect(page.locator('[data-testid="filter-tabs"]')).toBeVisible();
  await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
});
```

#### 2. Interaction Tests
```typescript
test('should filter achievements', async ({ page }) => {
  await page.goto('/achievements');

  // Click filter
  await page.locator('[data-testid="filter-unlocked"]').click();

  // Verify filtered results
  const achievements = page.locator('[data-testid="achievement-card"]');
  await expect(achievements).toHaveCount(5); // Expecting 5 unlocked
});
```

#### 3. Validation Tests
```typescript
test('should show validation error for invalid email', async ({ page }) => {
  await page.goto('/login');

  // Enter invalid email
  await page.fill('[name="email"]', 'invalid-email');
  await page.click('[type="submit"]');

  // Verify error message
  await expect(page.locator('.error-message')).toContainText('Invalid email format');
});
```

#### 4. API Integration Tests
```typescript
test('should handle API error gracefully', async ({ page }) => {
  // Mock API error
  await page.route('/api/v1/achievements', route => {
    route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
  });

  await page.goto('/achievements');

  // Verify error state displayed
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});
```

#### 5. Responsive Tests
```typescript
test('should work on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

  await page.goto('/achievements');

  // Verify mobile layout
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
});
```

#### 6. Performance Tests
```typescript
test('should load page quickly', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/achievements');
  await page.waitForSelector('[data-testid="achievement-card"]');

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // < 3 seconds
});
```

---

### 12.5 Agent Development Workflow with Tests

**MANDATORY workflow for ALL agents:**

```
1. REQUIREMENTS GATHERING
   ├─ Read PROJECT_CONSTRAINTS.md (this file)
   ├─ Identify required test data
   ├─ List validation requirements
   └─ Plan test scenarios

2. IMPLEMENT BACKEND (if needed)
   ├─ Create Prisma models
   ├─ Create API endpoints with validation
   ├─ Add to seed script
   └─ Run: npm run seed

3. IMPLEMENT FRONTEND
   ├─ Create components
   ├─ Add form validation (client + server)
   ├─ Add error handling
   ├─ Add loading states
   └─ Add accessibility features

4. WRITE TESTS (BEFORE considering feature complete)
   ├─ Display tests (all elements visible)
   ├─ Interaction tests (user workflows)
   ├─ Validation tests (error messages)
   ├─ API integration tests (loading, errors)
   ├─ Responsive tests (mobile, tablet)
   └─ Performance tests (page load)

5. VERIFY TESTS PASS
   ├─ Run: npm run type-check (0 errors)
   ├─ Run: npm run lint (0 warnings)
   ├─ Run: npm run seed (verify data)
   ├─ Run: npm run test:e2e (0 failures)
   └─ Fix any failures (DO NOT proceed with failures)

6. AGENT SELF-VALIDATION CHECKLIST
   ├─ [ ] All tests pass (0 failures)
   ├─ [ ] Test data seeded successfully
   ├─ [ ] Form validation working (client + server)
   ├─ [ ] Error messages displayed in UI
   ├─ [ ] No missing dependencies
   ├─ [ ] No TypeScript errors
   ├─ [ ] No console.log statements
   └─ [ ] Feature works on mobile

7. RETURN TO PM
   ├─ Provide test results summary
   ├─ List any warnings or issues
   └─ Confirm 100% test pass rate
```

---

### 12.6 Common Test Failures and Solutions

#### Failure 1: "Element not found"
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded
```

**Solution:**
```typescript
// Check if test data exists
const lessonCount = await prisma.lesson.count();
if (lessonCount === 0) {
  throw new Error('No lessons in database. Run: npm run seed');
}

// Use proper selectors
await page.waitForSelector('[data-testid="lesson-card"]', {
  timeout: 10000 // Give it enough time
});
```

#### Failure 2: "Validation error not displayed"
```
Expected error message, got nothing
```

**Solution:**
```typescript
// ALWAYS display errors in UI
{errors.email && (
  <p className="text-sm text-red-500 mt-1" data-testid="email-error">
    {errors.email}
  </p>
)}

// Test can find error
await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
```

#### Failure 3: "API returns 404"
```
API endpoint /api/v1/lessons returns 404
```

**Solution:**
```typescript
// Verify API route exists
// app/api/v1/lessons/route.ts
export async function GET(request: Request) {
  const lessons = await prisma.lesson.findMany();
  return NextResponse.json(lessons);
}
```

---

### 12.7 Test Coverage Requirements

**Minimum coverage for each feature:**

| Feature Type | Minimum Tests Required |
|--------------|------------------------|
| Authentication | 15+ tests (login, register, validation, errors) |
| CRUD Feature | 10+ tests (create, read, update, delete, validation) |
| List/Browse | 8+ tests (display, filter, search, pagination) |
| Form | 12+ tests (display, validation, submit, errors) |
| Dashboard | 6+ tests (display, stats, navigation) |

**Example: Login Feature**
- ✅ Display login form (1 test)
- ✅ Login with valid credentials (1 test)
- ✅ Show error for invalid email (1 test)
- ✅ Show error for wrong password (1 test)
- ✅ Show error for empty fields (1 test)
- ✅ Password visibility toggle (1 test)
- ✅ Remember me checkbox (1 test)
- ✅ Forgot password link (1 test)
- ✅ Navigate to register (1 test)
- ✅ API error handling (500, 404) (2 tests)
- ✅ Loading state (1 test)
- ✅ Session persistence (1 test)
- ✅ Redirect after login (1 test)
- ✅ Mobile responsive (1 test)
- ✅ Accessibility (1 test)

**Total: 15 tests minimum**

---

### 12.8 Pre-Commit Checklist

**Before EVERY commit:**

```bash
# 1. Type check
cd backend && npm run type-check
cd frontend && npm run type-check

# 2. Lint
cd backend && npm run lint
cd frontend && npm run lint

# 3. Seed database (if tests need data)
cd backend && npm run seed

# 4. Run E2E tests
cd frontend && NEXT_PUBLIC_APP_URL=http://localhost:3005 npx playwright test

# 5. Verify results
# ✅ 0 TypeScript errors
# ✅ 0 ESLint warnings
# ✅ All tests passing (3,528/3,528)
# ✅ No timeouts
```

**If ANY check fails: DO NOT COMMIT**

---

### 12.9 Test Data Validation Script

**Create this helper script:**

```typescript
// scripts/validate-test-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateTestData() {
  console.log('🔍 Validating test data...\n');

  const checks = {
    users: await prisma.user.count(),
    lessons: await prisma.lesson.count(),
    exercises: await prisma.exercise.count(),
    achievements: await prisma.achievement.count(),
  };

  const requirements = {
    users: 1,
    lessons: 20, // 5 beginner + 5 intermediate + 3 advanced × 2 tracks
    exercises: 30, // 10 multiple choice + 10 true/false + 10 fill-in-blank
    achievements: 18, // 5 bronze + 5 silver + 5 gold + 3 platinum
  };

  let allPassed = true;

  for (const [key, count] of Object.entries(checks)) {
    const required = requirements[key];
    const status = count >= required ? '✅' : '❌';

    console.log(`${status} ${key}: ${count}/${required}`);

    if (count < required) {
      allPassed = false;
    }
  }

  if (!allPassed) {
    console.error('\n❌ Test data validation failed!');
    console.error('Run: npm run seed');
    process.exit(1);
  }

  console.log('\n✅ Test data validation passed!');
}

validateTestData();
```

**Run before tests:**
```bash
npx ts-node scripts/validate-test-data.ts
```

---

### 12.10 Quick Reference: Test Failure Patterns

| Error Message | Root Cause | Solution |
|---------------|------------|----------|
| `TimeoutError: locator.waitFor` | Missing test data | Run `npm run seed` |
| `Expected error, got nothing` | Validation not displaying | Add error display in UI |
| `Cannot find module` | Missing dependency | Run `npm install <package>` |
| `API returns 404` | Route doesn't exist | Create API route file |
| `API returns empty array []` | No database data | Run `npm run seed` |
| `Element not visible` | CSS display issue | Check responsive design |
| `Navigation timeout` | Slow page load | Optimize performance |

---

## VERSION HISTORY

**v3.0 (2025-11-07)**
- **CRITICAL:** Added Section 12: Testing Requirements
- Based on analysis of 283 test failures from production run
- Documented root causes: missing test data, form validation, dependencies
- Added test data requirements and seed script templates
- Added test writing standards (6 test types required)
- Added agent workflow with mandatory testing steps
- Added pre-commit checklist and validation scripts
- **Rationale:** Prevents test failures by requiring tests BEFORE feature completion

**v2.1 (2025-11-04)**
- Added Section 10: Quranic Data Source Constraints

**v2.0 (2025-11-04)**
- Comprehensive rewrite with all project constraints

**v1.0 (2025-11-02)**
- Initial version

---

**END OF DOCUMENT**

**Remember:** This document exists to **prevent mistakes before they happen**, not to fix them afterward. Read it before every task.

**NEW RULE:** NO feature is complete without comprehensive Playwright tests that pass 100%.
