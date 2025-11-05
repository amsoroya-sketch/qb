# Testing Strategy - arQ (Quranic Arabic Grammar LMS)

**Version**: 1.0
**Last Updated**: 2025-11-03
**Owner**: QA Lead + Backend Lead + Frontend Lead

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Pyramid](#testing-pyramid)
3. [Test Coverage Requirements](#test-coverage-requirements)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [API Testing](#api-testing)
8. [Frontend Testing](#frontend-testing)
9. [Mobile Testing](#mobile-testing)
10. [Performance Testing](#performance-testing)
11. [Security Testing](#security-testing)
12. [Accessibility Testing](#accessibility-testing)
13. [Arabic/RTL Testing](#arabicrtl-testing)
14. [Test Data Management](#test-data-management)
15. [CI/CD Integration](#cicd-integration)
16. [Testing Tools](#testing-tools)

---

## Overview

This document defines the comprehensive testing strategy for the arQ project, ensuring quality, reliability, and maintainability across all components.

### Testing Philosophy

1. **Test Early, Test Often**: Write tests alongside code
2. **Test Pyramid**: Many unit tests, fewer integration tests, few E2E tests
3. **Fast Feedback**: Tests should run quickly (< 5 minutes)
4. **Deterministic**: Tests should be reliable and not flaky
5. **Isolated**: Tests should not depend on each other
6. **Readable**: Tests should be easy to understand

### Quality Gates

**Before merging to develop**:
- ✅ All tests pass
- ✅ Minimum 80% code coverage
- ✅ No critical security vulnerabilities
- ✅ No performance regressions

**Before releasing to production**:
- ✅ All tests pass (including E2E)
- ✅ Smoke tests pass
- ✅ Performance benchmarks met
- ✅ Security audit passed

---

## Testing Pyramid

We follow the testing pyramid principle:

```
        /\
       /  \      E2E Tests (5%)
      /----\     - Full user flows
     /      \    - Critical paths only
    /--------\
   /          \  Integration Tests (20%)
  /------------\ - API endpoints
 /              \- Component integration
/----------------\
|                | Unit Tests (75%)
|  Unit Tests    | - Functions
|                | - Components
|                | - Services
------------------
```

### Test Distribution

| Test Type | Percentage | Quantity (Approx) | Execution Time |
|-----------|------------|-------------------|----------------|
| Unit | 75% | 1000+ | < 30 seconds |
| Integration | 20% | 200+ | < 2 minutes |
| E2E | 5% | 50+ | < 3 minutes |

---

## Test Coverage Requirements

### Coverage Targets

| Component | Minimum Coverage | Target Coverage | Critical Path Coverage |
|-----------|------------------|-----------------|------------------------|
| Backend Services | 80% | 90% | 100% |
| Backend Controllers | 80% | 85% | 100% |
| Frontend Components | 75% | 85% | 95% |
| Frontend Hooks | 85% | 95% | 100% |
| Frontend Utils | 90% | 95% | 100% |
| Mobile Components | 70% | 80% | 90% |
| Database Queries | 80% | 90% | 100% |

### Critical Paths (100% Coverage Required)

1. **Authentication Flow**:
   - User registration
   - User login
   - Token refresh
   - Password reset

2. **User Progress**:
   - Exercise completion
   - XP calculation
   - Level progression
   - Achievement unlocking

3. **Payment Processing** (future):
   - Payment creation
   - Payment verification
   - Subscription management

4. **Data Integrity**:
   - User data operations
   - Progress tracking
   - Lesson completion

### Running Coverage Reports

```bash
# Backend coverage
cd backend
npm run test:cov

# Frontend coverage
cd frontend
npm run test:cov

# Mobile coverage
cd mobile
npm run test:cov

# View coverage report
open coverage/lcov-report/index.html
```

---

## Unit Testing

### What to Unit Test

- **Pure Functions**: Business logic, calculations, transformations
- **Services**: Service methods (with mocked dependencies)
- **Components**: React/React Native components (with mocked props)
- **Utilities**: Helper functions, formatters, validators
- **Hooks**: Custom React hooks

### Unit Test Structure

```typescript
describe('ComponentName or FunctionName', () => {
  // Setup (if needed)
  beforeEach(() => {
    // Reset state, mocks, etc.
  });

  // Teardown (if needed)
  afterEach(() => {
    // Cleanup
  });

  describe('methodName or functionality', () => {
    it('should do X when Y', () => {
      // Arrange
      const input = { };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should throw error when invalid input', () => {
      // Test error cases
    });
  });
});
```

### Backend Unit Tests (Jest)

#### Testing Services

```typescript
// lessons.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { NotFoundException } from '@nestjs/common';

describe('LessonsService', () => {
  let service: LessonsService;
  let prisma: PrismaService;
  let cache: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: PrismaService,
          useValue: {
            lesson: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    prisma = module.get<PrismaService>(PrismaService);
    cache = module.get<CacheService>(CacheService);
  });

  describe('findOne', () => {
    it('should return a lesson when found', async () => {
      const mockLesson = {
        id: '123',
        title: 'Test Lesson',
        track: 'A',
        stage: 1,
      };

      jest.spyOn(prisma.lesson, 'findUnique').mockResolvedValue(mockLesson);

      const result = await service.findOne('123');

      expect(result).toEqual(mockLesson);
      expect(prisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        include: { exercises: true, verses: true },
      });
    });

    it('should throw NotFoundException when lesson not found', async () => {
      jest.spyOn(prisma.lesson, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(prisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        include: { exercises: true, verses: true },
      });
    });
  });

  describe('findAll with caching', () => {
    it('should return cached lessons if available', async () => {
      const mockLessons = [{ id: '1', title: 'Lesson 1' }];
      jest.spyOn(cache, 'get').mockResolvedValue(JSON.stringify(mockLessons));

      const result = await service.findAll({ page: 1, limit: 20, track: 'A' });

      expect(result).toEqual(mockLessons);
      expect(cache.get).toHaveBeenCalledWith('lessons:page:1:limit:20:track:A:stage:undefined');
      expect(prisma.lesson.findMany).not.toHaveBeenCalled();
    });

    it('should query database and cache result if not cached', async () => {
      const mockLessons = [{ id: '1', title: 'Lesson 1' }];

      jest.spyOn(cache, 'get').mockResolvedValue(null);
      jest.spyOn(prisma.lesson, 'findMany').mockResolvedValue(mockLessons);
      jest.spyOn(prisma.lesson, 'count').mockResolvedValue(1);
      jest.spyOn(cache, 'set').mockResolvedValue();

      const result = await service.findAll({ page: 1, limit: 20, track: 'A' });

      expect(prisma.lesson.findMany).toHaveBeenCalled();
      expect(cache.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        300
      );
    });
  });
});
```

#### Testing Utility Functions

```typescript
// utils/xp-calculator.spec.ts
import { calculateXP } from './xp-calculator';

describe('calculateXP', () => {
  describe('accuracy-based XP', () => {
    it('should calculate XP based on accuracy for beginner level', () => {
      const result = calculateXP(85, 'beginner');
      expect(result).toBe(85); // 85 * 1.0 multiplier
    });

    it('should apply 1.5x multiplier for intermediate level', () => {
      const result = calculateXP(80, 'intermediate');
      expect(result).toBe(120); // 80 * 1.5
    });

    it('should apply 2x multiplier for advanced level', () => {
      const result = calculateXP(70, 'advanced');
      expect(result).toBe(140); // 70 * 2.0
    });
  });

  describe('edge cases', () => {
    it('should return 0 XP for 0% accuracy', () => {
      const result = calculateXP(0, 'beginner');
      expect(result).toBe(0);
    });

    it('should return max XP for 100% accuracy', () => {
      const result = calculateXP(100, 'advanced');
      expect(result).toBe(200); // 100 * 2.0
    });

    it('should throw error for negative accuracy', () => {
      expect(() => calculateXP(-10, 'beginner')).toThrow('Accuracy must be between 0 and 100');
    });

    it('should throw error for accuracy > 100', () => {
      expect(() => calculateXP(150, 'beginner')).toThrow('Accuracy must be between 0 and 100');
    });
  });
});
```

### Frontend Unit Tests (Jest + React Testing Library)

#### Testing Components

```typescript
// LessonCard.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LessonCard } from './LessonCard';
import { Lesson } from '@/types/lesson';

const mockLesson: Lesson = {
  id: '123',
  title: 'Introduction to Nouns',
  titleArabic: 'مقدمة في الأسماء',
  track: 'A',
  stage: 1,
  difficulty: 'beginner',
  estimatedTime: 15,
};

describe('LessonCard', () => {
  it('renders lesson information correctly', () => {
    const onStart = jest.fn();

    render(<LessonCard lesson={mockLesson} onStart={onStart} />);

    expect(screen.getByText('Introduction to Nouns')).toBeInTheDocument();
    expect(screen.getByText('مقدمة في الأسماء')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('calls onStart with lesson ID when Start button clicked', () => {
    const onStart = jest.fn();

    render(<LessonCard lesson={mockLesson} onStart={onStart} />);

    const button = screen.getByRole('button', { name: /start lesson/i });
    fireEvent.click(button);

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledWith('123');
  });

  it('displays bookmark button when onBookmark prop provided', () => {
    const onStart = jest.fn();
    const onBookmark = jest.fn();

    render(
      <LessonCard
        lesson={mockLesson}
        onStart={onStart}
        onBookmark={onBookmark}
        isBookmarked={false}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i });
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('calls onBookmark when bookmark button clicked', () => {
    const onStart = jest.fn();
    const onBookmark = jest.fn();

    render(
      <LessonCard
        lesson={mockLesson}
        onStart={onStart}
        onBookmark={onBookmark}
        isBookmarked={false}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i });
    fireEvent.click(bookmarkButton);

    expect(onBookmark).toHaveBeenCalledWith('123');
  });

  it('shows filled bookmark icon when isBookmarked is true', () => {
    const onStart = jest.fn();
    const onBookmark = jest.fn();

    render(
      <LessonCard
        lesson={mockLesson}
        onStart={onStart}
        onBookmark={onBookmark}
        isBookmarked={true}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /remove bookmark/i });
    expect(bookmarkButton).toBeInTheDocument();
  });
});
```

#### Testing Custom Hooks

```typescript
// useLessons.spec.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useLessons } from './useLessons';
import * as api from '@/lib/api/lessons';

jest.mock('@/lib/api/lessons');

describe('useLessons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches lessons on mount', async () => {
    const mockLessons = [
      { id: '1', title: 'Lesson 1' },
      { id: '2', title: 'Lesson 2' },
    ];

    jest.spyOn(api, 'getLessons').mockResolvedValue({
      data: mockLessons,
      meta: { total: 2, totalPages: 1 },
    });

    const { result } = renderHook(() => useLessons());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.lessons).toEqual(mockLessons);
    expect(result.current.error).toBeNull();
  });

  it('handles error when fetching fails', async () => {
    const mockError = new Error('Failed to fetch');
    jest.spyOn(api, 'getLessons').mockRejectedValue(mockError);

    const { result } = renderHook(() => useLessons());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.lessons).toEqual([]);
  });

  it('refetches lessons when refetch is called', async () => {
    const mockLessons = [{ id: '1', title: 'Lesson 1' }];

    jest.spyOn(api, 'getLessons').mockResolvedValue({
      data: mockLessons,
      meta: { total: 1, totalPages: 1 },
    });

    const { result } = renderHook(() => useLessons());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    jest.spyOn(api, 'getLessons').mockResolvedValue({
      data: [...mockLessons, { id: '2', title: 'Lesson 2' }],
      meta: { total: 2, totalPages: 1 },
    });

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.lessons).toHaveLength(2);
    });

    expect(api.getLessons).toHaveBeenCalledTimes(2);
  });
});
```

---

## Integration Testing

### What to Integration Test

- **API Endpoints**: Full request/response cycle
- **Database Operations**: CRUD operations with real database
- **Service Integration**: Multiple services working together
- **Authentication Flow**: Login, token refresh, authorization
- **Business Workflows**: Complete user workflows

### Backend Integration Tests

```typescript
// lessons.controller.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('LessonsController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Get auth token for authenticated requests
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = response.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.lesson.deleteMany();
  });

  describe('GET /api/v1/lessons', () => {
    it('should return empty array when no lessons exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all lessons', async () => {
      // Seed data
      await prisma.lesson.createMany({
        data: [
          { title: 'Lesson 1', track: 'A', stage: 1 },
          { title: 'Lesson 2', track: 'A', stage: 1 },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter lessons by track', async () => {
      await prisma.lesson.createMany({
        data: [
          { title: 'Lesson A1', track: 'A', stage: 1 },
          { title: 'Lesson B1', track: 'B', stage: 1 },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons?track=A')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Lesson A1');
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/lessons')
        .expect(401);
    });
  });

  describe('POST /api/v1/lessons', () => {
    it('should create a new lesson', async () => {
      const createDto = {
        title: 'New Lesson',
        titleArabic: 'درس جديد',
        track: 'A',
        stage: 1,
        grammarTopic: 'nouns',
        difficulty: 'beginner',
        estimatedTime: 15,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/lessons')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Lesson');

      // Verify in database
      const lesson = await prisma.lesson.findUnique({
        where: { id: response.body.data.id },
      });
      expect(lesson).toBeTruthy();
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        title: 'A', // Too short
        track: 'C', // Invalid track
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/lessons')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/v1/lessons/:id', () => {
    it('should update an existing lesson', async () => {
      const lesson = await prisma.lesson.create({
        data: {
          title: 'Original Title',
          track: 'A',
          stage: 1,
        },
      });

      const updateDto = { title: 'Updated Title' };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/lessons/${lesson.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');

      const updated = await prisma.lesson.findUnique({
        where: { id: lesson.id },
      });
      expect(updated.title).toBe('Updated Title');
    });

    it('should return 404 when lesson not found', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/lessons/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });
});
```

---

## End-to-End Testing

### What to E2E Test

- **Critical User Flows**: Registration → Login → Complete Lesson → Track Progress
- **Payment Flow** (future): Subscribe → Pay → Access Premium Content
- **Multi-Step Workflows**: Create Account → Verify Email → Complete Onboarding
- **Cross-Browser**: Chrome, Firefox, Safari
- **Mobile Flows**: Mobile-specific user journeys

### E2E Test Tools

- **Playwright**: Primary E2E testing framework
- **Cypress**: Alternative for UI-focused tests

### E2E Test Example (Playwright)

```typescript
// tests/e2e/lesson-completion.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Lesson Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'student@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  test('should complete a lesson successfully', async ({ page }) => {
    // 1. Navigate to lessons
    await page.click('text=Lessons');
    await expect(page).toHaveURL('http://localhost:3000/lessons');

    // 2. Select a lesson
    await page.click('text=Introduction to Nouns');
    await expect(page).toHaveURL(/\/lessons\/[a-z0-9-]+/);

    // 3. Start lesson
    await page.click('text=Start Lesson');

    // 4. Read lesson content
    await expect(page.locator('h1')).toContainText('Introduction to Nouns');
    await expect(page.locator('[dir="rtl"]')).toBeVisible(); // Arabic content

    // 5. Complete exercises
    await page.click('text=Next: Exercises');

    // Exercise 1: Multiple choice
    await page.click('text=Answer A');
    await page.click('text=Submit');
    await expect(page.locator('.feedback.correct')).toBeVisible();

    // Exercise 2: Fill in the blank
    await page.fill('[data-testid="answer-input"]', 'الكتاب');
    await page.click('text=Submit');
    await expect(page.locator('.feedback.correct')).toBeVisible();

    // 6. Complete lesson
    await page.click('text=Finish Lesson');

    // 7. Verify completion
    await expect(page.locator('.completion-message')).toContainText('Congratulations');
    await expect(page.locator('.xp-earned')).toContainText('XP');

    // 8. Verify progress updated
    await page.click('text=Progress');
    await expect(page).toHaveURL('http://localhost:3000/progress');
    await expect(page.locator('.lessons-completed')).toContainText('1');
  });

  test('should handle incorrect answers', async ({ page }) => {
    await page.goto('http://localhost:3000/lessons/intro-to-nouns');
    await page.click('text=Start Lesson');
    await page.click('text=Next: Exercises');

    // Submit wrong answer
    await page.click('text=Wrong Answer');
    await page.click('text=Submit');

    // Verify feedback
    await expect(page.locator('.feedback.incorrect')).toBeVisible();
    await expect(page.locator('.feedback')).toContainText('Try again');

    // Verify can retry
    await page.click('text=Try Again');
    await expect(page.locator('.feedback')).not.toBeVisible();
  });

  test('should save progress when pausing', async ({ page }) => {
    await page.goto('http://localhost:3000/lessons/intro-to-nouns');
    await page.click('text=Start Lesson');

    // Pause mid-lesson
    await page.click('text=Pause');

    // Navigate away
    await page.click('text=Dashboard');

    // Return to lessons
    await page.click('text=Lessons');

    // Verify "Continue" button appears
    await expect(page.locator('text=Continue Lesson')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('should register and login new user', async ({ page }) => {
    // 1. Navigate to registration
    await page.goto('http://localhost:3000/register');

    // 2. Fill registration form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="confirmPassword"]', 'password123');

    // 3. Submit form
    await page.click('button[type="submit"]');

    // 4. Verify redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // 5. Verify user is logged in
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();

    // 6. Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL('http://localhost:3000/login');

    // 7. Login again
    await page.fill('[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
});
```

### Cross-Browser Testing

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## API Testing

### REST API Testing (Postman/Newman)

Create Postman collections for API testing:

**Collection Structure**:
```
arQ API Tests
├── Authentication
│   ├── Register User
│   ├── Login User
│   ├── Refresh Token
│   └── Logout User
├── Lessons
│   ├── Get All Lessons
│   ├── Get Lesson by ID
│   ├── Create Lesson (Admin)
│   ├── Update Lesson (Admin)
│   └── Delete Lesson (Admin)
├── Exercises
│   ├── Get Exercises for Lesson
│   ├── Submit Exercise Answer
│   └── Get Exercise Results
└── Progress
    ├── Get User Progress
    ├── Update Progress
    └── Get Leaderboard
```

**Example Test Scripts** (in Postman):

```javascript
// Test: Login User
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success=true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Response contains accessToken", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.accessToken).to.be.a('string');
});

// Save token for subsequent requests
const jsonData = pm.response.json();
pm.environment.set("accessToken", jsonData.data.accessToken);
```

### Running API Tests

```bash
# Run Postman collection with Newman
newman run arq-api-tests.postman_collection.json \
  -e dev.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export ./reports/api-tests.html
```

---

## Frontend Testing

### Component Testing Checklist

For each component, test:

- [ ] **Rendering**: Component renders without errors
- [ ] **Props**: Different prop combinations
- [ ] **User Interactions**: Click, input, hover, etc.
- [ ] **State Changes**: State updates correctly
- [ ] **Conditional Rendering**: Show/hide based on conditions
- [ ] **Error States**: Error messages display correctly
- [ ] **Loading States**: Loading indicators display
- [ ] **Accessibility**: Keyboard navigation, ARIA labels

### Snapshot Testing

Use snapshot testing for components with stable UI:

```typescript
// LessonCard.snapshot.spec.tsx
import { render } from '@testing-library/react';
import { LessonCard } from './LessonCard';

describe('LessonCard Snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <LessonCard
        lesson={mockLesson}
        onStart={jest.fn()}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
```

---

## Mobile Testing

### React Native Testing (Jest + React Native Testing Library)

```typescript
// LessonCard.spec.tsx (React Native)
import { render, fireEvent } from '@testing-library/react-native';
import { LessonCard } from './LessonCard';

describe('LessonCard (Mobile)', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <LessonCard lesson={mockLesson} onPress={jest.fn()} />
    );

    expect(getByText('Introduction to Nouns')).toBeTruthy();
    expect(getByText('مقدمة في الأسماء')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <LessonCard lesson={mockLesson} onPress={onPress} />
    );

    fireEvent.press(getByTestId('lesson-card'));
    expect(onPress).toHaveBeenCalledWith(mockLesson.id);
  });
});
```

### Device Testing

Test on real devices:
- **iOS**: iPhone 12, iPhone 14 Pro
- **Android**: Pixel 5, Samsung Galaxy S21

Use Expo's device preview:
```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on physical device
expo start
# Scan QR code with Expo Go app
```

---

## Performance Testing

### Load Testing (Artillery)

```yaml
# load-test.yml
config:
  target: "https://api.arq.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"

scenarios:
  - name: "Get Lessons"
    flow:
      - post:
          url: "/api/v1/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.data.accessToken"
              as: "token"
      - get:
          url: "/api/v1/lessons"
          headers:
            Authorization: "Bearer {{ token }}"
```

Run load test:
```bash
artillery run load-test.yml
```

### Performance Benchmarks

| Endpoint | Target (95th percentile) | Alert Threshold |
|----------|--------------------------|-----------------|
| GET /lessons | < 100ms | 200ms |
| GET /lessons/:id | < 50ms | 100ms |
| POST /exercises/submit | < 200ms | 400ms |
| GET /progress | < 100ms | 200ms |

### Frontend Performance (Lighthouse)

Run Lighthouse CI:
```bash
npm run lighthouse
```

**Performance targets**:
- Performance score: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1

---

## Security Testing

### OWASP Top 10 Testing

Test for:
1. **Injection**: SQL injection, XSS
2. **Broken Authentication**: Weak passwords, session management
3. **Sensitive Data Exposure**: Unencrypted data
4. **XML External Entities**: XXE attacks
5. **Broken Access Control**: Unauthorized access
6. **Security Misconfiguration**: Default configs
7. **Cross-Site Scripting**: XSS vulnerabilities
8. **Insecure Deserialization**: Object injection
9. **Using Components with Known Vulnerabilities**: Outdated deps
10. **Insufficient Logging**: Missing audit trails

### Security Testing Tools

```bash
# Dependency vulnerabilities
npm audit

# OWASP ZAP (API security testing)
zap-cli quick-scan https://api.arq.com

# Snyk (vulnerability scanning)
snyk test
```

---

## Accessibility Testing

### Automated Accessibility Testing

```typescript
// accessibility.spec.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LessonCard } from './LessonCard';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <LessonCard lesson={mockLesson} onStart={jest.fn()} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Accessibility Testing

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Color Contrast**: Use WebAIM Contrast Checker
- **Focus Indicators**: Verify visible focus states

---

## Arabic/RTL Testing

### RTL Layout Testing

```typescript
describe('RTL Layout', () => {
  it('should display correctly in RTL mode', () => {
    const { container } = render(
      <div dir="rtl">
        <ArabicText text="السلام عليكم" />
      </div>
    );

    const element = container.querySelector('[dir="rtl"]');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({ direction: 'rtl' });
  });

  it('should mirror UI elements in RTL', () => {
    const { container } = render(
      <Navigation dir="rtl" />
    );

    // Verify icons are mirrored
    // Verify text alignment is right
  });
});
```

### Arabic Text Testing

- **Diacritics Display**: Verify diacritics render correctly
- **Search**: Test search with and without diacritics
- **Sorting**: Verify Arabic text sorts correctly
- **Input**: Test Arabic text input

---

## Test Data Management

### Test Database

Use separate test database:

```env
# .env.test
DATABASE_URL=postgresql://postgres:password@localhost:5432/arq_test
```

### Database Seeding

```typescript
// tests/seed-data.ts
export const seedTestData = async (prisma: PrismaService) => {
  // Clean database
  await prisma.lesson.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  await prisma.user.createMany({
    data: [
      { email: 'student@example.com', password: 'hashed', role: 'STUDENT' },
      { email: 'teacher@example.com', password: 'hashed', role: 'TEACHER' },
      { email: 'admin@example.com', password: 'hashed', role: 'ADMIN' },
    ],
  });

  // Seed lessons
  await prisma.lesson.createMany({
    data: [
      { title: 'Lesson 1', track: 'A', stage: 1 },
      { title: 'Lesson 2', track: 'A', stage: 2 },
    ],
  });
};
```

### Factory Pattern for Test Data

```typescript
// tests/factories/lesson.factory.ts
import { faker } from '@faker-js/faker';

export const createLesson = (overrides?: Partial<Lesson>): Lesson => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  titleArabic: 'درس تجريبي',
  track: 'A',
  stage: 1,
  difficulty: 'beginner',
  estimatedTime: 15,
  ...overrides,
});

// Usage
const lesson1 = createLesson();
const advancedLesson = createLesson({ difficulty: 'advanced', stage: 5 });
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-backend:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: arq_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run type check
        working-directory: backend
        run: npm run type-check

      - name: Run linting
        working-directory: backend
        run: npm run lint

      - name: Run unit tests
        working-directory: backend
        run: npm run test:cov

      - name: Run integration tests
        working-directory: backend
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/arq_test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: backend

  test-frontend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Run type check
        working-directory: frontend
        run: npm run type-check

      - name: Run linting
        working-directory: frontend
        run: npm run lint

      - name: Run tests
        working-directory: frontend
        run: npm run test:cov

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Testing Tools

### Backend Testing

| Tool | Purpose |
|------|---------|
| **Jest** | Unit and integration testing |
| **Supertest** | HTTP assertions |
| **@nestjs/testing** | NestJS test utilities |
| **Faker.js** | Test data generation |

### Frontend Testing

| Tool | Purpose |
|------|---------|
| **Jest** | Test runner |
| **React Testing Library** | Component testing |
| **jest-axe** | Accessibility testing |
| **MSW** | API mocking |

### E2E Testing

| Tool | Purpose |
|------|---------|
| **Playwright** | Browser automation |
| **Cypress** | Alternative E2E framework |

### Performance Testing

| Tool | Purpose |
|------|---------|
| **Artillery** | Load testing |
| **Lighthouse CI** | Performance metrics |
| **k6** | Alternative load testing |

### Security Testing

| Tool | Purpose |
|------|---------|
| **npm audit** | Dependency vulnerabilities |
| **Snyk** | Security scanning |
| **OWASP ZAP** | API security testing |

---

## Summary

### Test Execution Commands

```bash
# Backend
cd backend
npm run test              # Run unit tests
npm run test:cov          # Run with coverage
npm run test:e2e          # Run integration tests
npm run test:watch        # Watch mode

# Frontend
cd frontend
npm run test              # Run unit tests
npm run test:cov          # Run with coverage
npm run test:watch        # Watch mode

# E2E
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # Run with UI

# Mobile
cd mobile
npm run test              # Run unit tests
npm run test:cov          # Run with coverage

# All tests
npm run test:all          # Run all tests across projects
```

---

**Last Updated**: 2025-11-03
**Maintained By**: QA Lead + Backend Lead + Frontend Lead

**Related Documents**:
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
