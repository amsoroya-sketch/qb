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

### 3.1 Environment Variables

**NEVER hardcode credentials**

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
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

**.env.example** (Commit this):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/arq"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand"
NEXTAUTH_URL="http://localhost:3000"
```

**Reference:** PROJECT_OVERVIEW.md, Section "Security & Privacy"

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

**END OF DOCUMENT**

**Remember:** This document exists to **prevent mistakes before they happen**, not to fix them afterward. Read it before every task.
