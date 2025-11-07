# Integrated Testing Solution with 100 Users & Real Backend

## 🎯 Overview

This document provides a complete solution for integrated Playwright testing with 100 diverse users and real backend data (no offline mode).

## 📁 Files Created

### 1. Seed Scripts
- `/backend/prisma/seeds/seed-100-users.ts` - Creates 100 diverse test users
- `/backend/prisma/seeds/seed-achievements.ts` - Creates 15 achievements
- `/backend/prisma/seeds/run-all-seeds.ts` - Master seed runner

### 2. Test Configuration (TODO - Next Steps)
- `/frontend/tests/integration/` - New integrated test suite
- `/frontend/playwright.config.integration.ts` - Non-offline configuration

## 🐛 Issues Found & Fixed

### Frontend Issues ✅
1. **Achievements Card** - `colors` undefined → Added fallbacks
2. **Lessons Page** - `filteredLessons` undefined → Added optional chaining
3. **Lessons Page** - Iterator undefined → Added array guard

### Backend Issues ❌ (Still Need Fixing)
1. **Achievements API** returns 500 error
   - Root cause: Achievement schema uses `name` not `title`
   - Fix needed: Update seed scripts to match schema

2. **Practice API** returns empty/error
   - Root cause: No practice exercises in database
   - Fix needed: Create practice exercise seed

### Test Configuration Issue ❌
- Tests run in "offline mode" by default
- Backend failures are skipped/mocked
- Need: New test config for real backend integration

## 🔧 How to Fix & Run

### Step 1: Fix Achievement Seed Script

The achievement model uses these fields:
- `name` (not `title`)
- `nameArabic` (required)
- `rarity` must be: `COMMON`, `RARE`, `EPIC`, `LEGENDARY` (uppercase)

Update `/backend/prisma/seeds/seed-achievements.ts`:
```typescript
const achievements = [
  {
    name: 'First Steps',  // Changed from 'title'
    nameArabic: 'الخطوات الأولى',  // Added
    description: 'Complete your first lesson',
    icon: 'trophy',
    category: 'learning',
    rarity: 'COMMON',  // Uppercase
    xpReward: 50,
    requirement: { type: 'lessons_completed', value: 1 },  // Direct object, not JSON.stringify
  },
  // ... rest of achievements
];
```

### Step 2: Run Seeds

```bash
cd /home/dev/Development/arQ/backend
npx tsx prisma/seeds/run-all-seeds.ts
```

This will create:
- ✅ 15 achievements
- ✅ 100 users (20 new, 20 beginners, 20 intermediate, 20 advanced, 10 power, 5 inactive, 3 teachers, 2 admins)

### Step 3: Verify Backend APIs

Test the fixed APIs:
```bash
# Login
curl -c cookies.txt -X POST http://localhost:3001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"beginner1@test.com","password":"Test123@"}'

# Test achievements (should return 200 now)
curl -b cookies.txt http://localhost:3001/api/v1/achievements/my

# Test dashboard
curl -b cookies.txt http://localhost:3001/api/v1/progress/me/dashboard
```

### Step 4: Create Integrated Test Config

Create `/frontend/playwright.config.integration.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report-integration' }],
    ['json', { outputFile: 'test-results-integration.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // IMPORTANT: No global setup (no offline mode)
  // globalSetup: undefined,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'PORT=3005 npm run dev',
    url: 'http://localhost:3005',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

### Step 5: Create Integrated Tests

Create `/frontend/tests/integration/100-users.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

const TEST_USERS = [
  // New users
  ...Array.from({ length: 20 }, (_, i) => ({
    email: `newuser${i + 1}@test.com`,
    password: 'Test123@',
    type: 'new',
    expectedLessons: 0,
    expectedXP: 0,
  })),

  // Beginners
  ...Array.from({ length: 20 }, (_, i) => ({
    email: `beginner${i + 1}@test.com`,
    password: 'Test123@',
    type: 'beginner',
    expectedLessons: { min: 1, max: 5 },
    expectedXP: { min: 50, max: 500 },
  })),

  // ... more user types
];

test.describe('100 Users Integration Tests', () => {
  for (const user of TEST_USERS) {
    test(`${user.type}: ${user.email} - Dashboard loads correctly`, async ({ page }) => {
      // Login
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button:has-text("Login")');

      // Wait for dashboard
      await expect(page).toHaveURL(/.*dashboard/);

      // Verify stats match expected
      if (user.type === 'new') {
        await expect(page.locator('[data-testid="lessons-completed"]')).toContainText('0');
        await expect(page.locator('[data-testid="current-xp"]')).toContainText('0');
      }

      // Logout
      await page.click('[data-testid="logout-button"]');
    });

    test(`${user.type}: ${user.email} - Achievements page works`, async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button:has-text("Login")');

      await page.goto('/achievements');

      // Should NOT show loading forever
      await expect(page.locator('[data-testid="achievements-grid"]')).toBeVisible({ timeout: 10000 });

      // Should show achievement cards
      const cards = page.locator('[data-testid="achievement-card"]');
      await expect(cards).toHaveCountGreaterThan(0);
    });
  }
});
```

### Step 6: Run Integrated Tests

```bash
cd /home/dev/Development/arQ/frontend

# Run with real backend
npx playwright test --config=playwright.config.integration.ts

# Run specific test
npx playwright test tests/integration/100-users.spec.ts --config=playwright.config.integration.ts

# View report
npx playwright show-report playwright-report-integration
```

## 📊 Test Coverage

### User Scenarios (100 users)
1. **New Users (20)** - Just registered, 0 progress
2. **Beginners (20)** - 1-5 lessons, learning basics
3. **Intermediate (20)** - 10-20 lessons, active learners
4. **Advanced (20)** - 30+ lessons, experienced
5. **Power Users (10)** - 50+ lessons, near completion
6. **Inactive (5)** - Good progress but 30+ days inactive
7. **Teachers (3)** - Different role permissions
8. **Admins (2)** - Full system access

### Test Types
- ✅ Login/Authentication (100 users)
- ✅ Dashboard stats accuracy (100 users)
- ✅ Achievements page (100 users)
- ✅ Lessons page (100 users)
- ✅ Practice page (100 users)
- ✅ Progress tracking (100 users)
- ✅ Role-based access (teachers, admins)

## 🎯 Success Criteria

All tests should:
1. ✅ Connect to real backend (no mocking)
2. ✅ Login successfully with each user
3. ✅ Display correct data based on user scenario
4. ✅ Handle API errors gracefully
5. ✅ Complete within reasonable time (<5min for 100 users)

## 📝 Next Steps

1. Fix achievement seed script (name/nameArabic/rarity)
2. Run seeds to populate database
3. Verify backend APIs work (no 500 errors)
4. Create integrated test config
5. Create 100-user test suite
6. Run and validate all tests pass

## 🔍 Why This Approach?

**Problem:** Current tests run in "offline mode" and skip backend failures
**Solution:** New integrated tests that:
- Connect to real backend
- Test actual data
- Fail when APIs are broken (as they should!)
- Cover 100 diverse user scenarios

This ensures the app works for ALL user types, not just mocked data.
