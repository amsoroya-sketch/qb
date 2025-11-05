# Code Review Checklist - arQ (Quranic Arabic Grammar LMS)

**Version**: 1.0
**Last Updated**: 2025-11-03
**Owner**: QA Lead + Solution Architect

---

## Table of Contents

1. [Overview](#overview)
2. [Author Pre-Review Checklist](#author-pre-review-checklist)
3. [Reviewer Checklist](#reviewer-checklist)
4. [Code Quality Checks](#code-quality-checks)
5. [Architecture & Design](#architecture--design)
6. [Security Review](#security-review)
7. [Performance Review](#performance-review)
8. [Testing Review](#testing-review)
9. [Documentation Review](#documentation-review)
10. [UI/UX Review](#uiux-review)
11. [Accessibility Review](#accessibility-review)
12. [Arabic/RTL Review](#arabicrtl-review)
13. [Database Review](#database-review)
14. [API Review](#api-review)
15. [Final Approval Checklist](#final-approval-checklist)

---

## Overview

This document provides a comprehensive checklist for code reviews in the arQ project. Use this as a guide during PR reviews to ensure code quality, security, and consistency.

### Severity Levels

Use these prefixes in review comments:

- **[MUST]** - Blocking issue, must be fixed before merge
- **[SHOULD]** - Recommended change, should be addressed
- **[CONSIDER]** - Suggestion, optional
- **[QUESTION]** - Asking for clarification
- **[PRAISE]** - Positive feedback

### Review Time Expectations

| PR Size | Lines Changed | Review Time | Max Wait Time |
|---------|---------------|-------------|---------------|
| XS | < 50 | 10 min | 2 hours |
| S | 50-200 | 30 min | 4 hours |
| M | 200-400 | 1 hour | 1 day |
| L | 400-800 | 2 hours | 2 days |
| XL | > 800 | Split PR | Split PR |

---

## Author Pre-Review Checklist

**Before requesting review, verify:**

### Code Quality
- [ ] Code compiles with zero warnings (`npm run type-check`)
- [ ] All linting rules pass (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] No `console.log` or debug code
- [ ] No commented-out code
- [ ] No TODOs without ticket references
- [ ] All TypeScript types are explicit (no `any`)

### Testing
- [ ] All existing tests pass (`npm run test`)
- [ ] New tests added for new functionality
- [ ] Test coverage meets minimum 80%
- [ ] Edge cases are tested
- [ ] Error cases are tested

### Self-Review
- [ ] Read through all changed code
- [ ] Verified logic is correct
- [ ] Checked for code duplication
- [ ] Verified error handling is adequate
- [ ] Checked for security issues

### Documentation
- [ ] Code comments added for complex logic
- [ ] API endpoints documented (Swagger)
- [ ] README updated (if needed)
- [ ] CHANGELOG updated (if release)

### Git
- [ ] Branch is up to date with base branch
- [ ] Commit messages follow conventions
- [ ] PR description is complete
- [ ] Related issues are linked

### Manual Testing
- [ ] Tested locally
- [ ] Verified UI changes (if applicable)
- [ ] Tested with different user roles
- [ ] Tested edge cases
- [ ] Verified Arabic/RTL layout (if applicable)

---

## Reviewer Checklist

### Initial Review

- [ ] PR description is clear and complete
- [ ] PR size is reasonable (< 400 lines)
- [ ] Changes match PR description
- [ ] Related issues are linked
- [ ] Labels are appropriate
- [ ] CI/CD checks pass

### If PR is Too Large

**[MUST]** If PR > 400 lines, request author to split into smaller PRs:

```
[MUST] This PR is too large to review effectively (850 lines changed).
Please split into smaller PRs:
1. Authentication endpoints
2. User profile UI
3. Test updates
```

---

## Code Quality Checks

### General Code Quality

- [ ] **Readability**: Code is easy to read and understand
- [ ] **Clarity**: Variable and function names are descriptive
- [ ] **Simplicity**: Code is as simple as possible (no over-engineering)
- [ ] **DRY**: No unnecessary code duplication
- [ ] **Single Responsibility**: Functions/components do one thing
- [ ] **Consistency**: Code style matches existing codebase

### TypeScript Quality

- [ ] **Strict Types**: No `any` types used (unless justified)
  ```typescript
  // ❌ BAD
  function process(data: any) { }

  // ✅ GOOD
  function process(data: UserData) { }
  ```

- [ ] **Type Safety**: All types are explicit
  ```typescript
  // ❌ BAD
  const calculateXP = (accuracy) => accuracy * 100;

  // ✅ GOOD
  const calculateXP = (accuracy: number): number => accuracy * 100;
  ```

- [ ] **Proper Type Usage**: Interface vs Type used correctly
  ```typescript
  // ✅ GOOD - Interface for object shapes
  interface User {
    id: string;
    email: string;
  }

  // ✅ GOOD - Type for unions
  type UserRole = 'student' | 'teacher' | 'admin';
  ```

- [ ] **No Type Assertions**: Avoid `as` unless necessary
  ```typescript
  // ❌ BAD
  const user = response.data as User;

  // ✅ GOOD
  function isUser(data: unknown): data is User {
    return typeof data === 'object' && data !== null && 'id' in data;
  }
  ```

### Naming Conventions

- [ ] **Files**: Correct case used (PascalCase for components, camelCase for utilities)
- [ ] **Variables**: camelCase with descriptive names
- [ ] **Constants**: UPPER_SNAKE_CASE
- [ ] **Booleans**: Prefixed with `is`, `has`, `should`, `can`
- [ ] **Functions**: camelCase with verb prefix
- [ ] **Event Handlers**: Prefixed with `handle` or `on`

### Code Organization

- [ ] **Imports**: Organized (external → internal → relative)
- [ ] **File Length**: Files are not too long (< 300 lines)
- [ ] **Function Length**: Functions are not too long (< 50 lines)
- [ ] **Component Structure**: Follows standard structure
  ```typescript
  // 1. Imports
  // 2. Types/Interfaces
  // 3. Constants
  // 4. Component
  //    - State hooks
  //    - Custom hooks
  //    - useEffect hooks
  //    - Event handlers
  //    - Helper functions
  //    - Render
  ```

### Error Handling

- [ ] **Try-Catch**: Proper error handling in async functions
- [ ] **Error Messages**: Clear, user-friendly error messages
- [ ] **Error Logging**: Errors are logged appropriately
- [ ] **Graceful Degradation**: App doesn't crash on errors

**Examples**:
```typescript
// ✅ GOOD - Backend
try {
  const lesson = await this.findLesson(id);
  return lesson;
} catch (error) {
  this.logger.error(`Failed to find lesson: ${error.message}`, error.stack);

  if (error instanceof NotFoundException) {
    throw error;
  }

  throw new InternalServerErrorException('Failed to retrieve lesson');
}

// ✅ GOOD - Frontend
try {
  await loginUser(email, password);
  router.push('/dashboard');
} catch (error) {
  if (error instanceof ApiError && error.statusCode === 401) {
    setError('Invalid email or password');
  } else {
    setError('An error occurred. Please try again.');
  }
}
```

---

## Architecture & Design

### Design Patterns

- [ ] **Appropriate Patterns**: Design patterns used correctly
- [ ] **No Anti-Patterns**: No known anti-patterns present
- [ ] **SOLID Principles**: Code follows SOLID principles
- [ ] **Separation of Concerns**: Clear separation (UI, business logic, data)

### Component Architecture (React)

- [ ] **Component Hierarchy**: Logical component structure
- [ ] **Props Interface**: Props are well-defined with TypeScript
- [ ] **State Management**: Appropriate state management (local vs global)
- [ ] **Side Effects**: useEffect used correctly
- [ ] **Memoization**: Appropriate use of useMemo/useCallback

**Review questions**:
- Is this component too large? Should it be split?
- Is state managed at the right level?
- Are there unnecessary re-renders?

### Service Architecture (NestJS)

- [ ] **Service Layer**: Business logic in services, not controllers
- [ ] **Controller Responsibility**: Controllers only handle HTTP
- [ ] **Dependency Injection**: DI used correctly
- [ ] **Module Organization**: Modules are logically organized

**Examples**:
```typescript
// ✅ GOOD - Thin controller
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  async findAll(@Query() query: FindLessonsDto) {
    return this.lessonsService.findAll(query);
  }
}

// ❌ BAD - Fat controller with business logic
@Controller('lessons')
export class LessonsController {
  @Get()
  async findAll(@Query() query: FindLessonsDto) {
    // Business logic in controller (BAD)
    const lessons = await prisma.lesson.findMany({...});
    const filtered = lessons.filter(...);
    return filtered.map(...);
  }
}
```

---

## Security Review

### Authentication & Authorization

- [ ] **Protected Routes**: Sensitive endpoints have auth guards
  ```typescript
  // ✅ GOOD
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) { }
  ```

- [ ] **Role-Based Access**: Authorization checks for role-specific endpoints
  ```typescript
  // ✅ GOOD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/users')
  getAllUsers() { }
  ```

- [ ] **Token Management**: Tokens handled securely
- [ ] **Session Management**: Sessions expire appropriately

### Input Validation

- [ ] **DTO Validation**: All inputs validated with DTOs
  ```typescript
  // ✅ GOOD
  export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
  }
  ```

- [ ] **Sanitization**: User input is sanitized
- [ ] **Type Checking**: Types enforced at runtime (not just compile-time)

### SQL Injection Prevention

- [ ] **Parameterized Queries**: No string interpolation in SQL
  ```typescript
  // ✅ GOOD - Prisma (safe)
  await prisma.user.findUnique({ where: { email } });

  // ❌ BAD - Raw SQL with string interpolation
  await prisma.$queryRaw`SELECT * FROM users WHERE email = '${email}'`;

  // ✅ GOOD - Raw SQL with parameters
  await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
  ```

### XSS Prevention

- [ ] **Output Escaping**: User-generated content is escaped
- [ ] **No dangerouslySetInnerHTML**: Or properly sanitized if used
  ```typescript
  // ✅ GOOD - React escapes by default
  <div>{userContent}</div>

  // ❌ BAD - Unsafe HTML
  <div dangerouslySetInnerHTML={{ __html: userContent }} />

  // ✅ GOOD - Sanitized HTML
  import DOMPurify from 'isomorphic-dompurify';
  const clean = DOMPurify.sanitize(userContent);
  <div dangerouslySetInnerHTML={{ __html: clean }} />
  ```

### Sensitive Data

- [ ] **No Hardcoded Secrets**: No API keys, passwords, tokens in code
- [ ] **Environment Variables**: Secrets in environment variables
- [ ] **No Logging Secrets**: Passwords/tokens not logged
- [ ] **Password Hashing**: Passwords hashed with bcrypt
  ```typescript
  // ✅ GOOD
  const hash = await bcrypt.hash(password, 10);

  // ❌ BAD - Plain text password
  user.password = password;
  ```

### API Security

- [ ] **Rate Limiting**: Rate limiting on sensitive endpoints
- [ ] **CORS**: CORS configured correctly
- [ ] **HTTPS**: HTTPS enforced in production
- [ ] **Headers**: Security headers set (helmet.js)

### Common Vulnerabilities

- [ ] **No Eval**: No use of `eval()` or `Function()` constructor
- [ ] **No Unsafe Regex**: No regex susceptible to ReDoS
- [ ] **Dependency Security**: No known vulnerable dependencies
- [ ] **File Upload Security**: File uploads validated (if applicable)

---

## Performance Review

### Database Performance

- [ ] **Query Optimization**: Queries are optimized
  ```typescript
  // ✅ GOOD - Select only needed fields
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  });

  // ❌ BAD - Select all fields
  const users = await prisma.user.findMany();
  ```

- [ ] **N+1 Queries Avoided**: No N+1 query problems
  ```typescript
  // ✅ GOOD - Include related data
  const lessons = await prisma.lesson.findMany({
    include: { exercises: true }
  });

  // ❌ BAD - N+1 problem
  const lessons = await prisma.lesson.findMany();
  for (const lesson of lessons) {
    lesson.exercises = await prisma.exercise.findMany({
      where: { lessonId: lesson.id }
    });
  }
  ```

- [ ] **Indexes Used**: Appropriate indexes exist
- [ ] **Pagination**: Large result sets are paginated
- [ ] **Connection Pooling**: Database connections managed

### Caching

- [ ] **Cache Strategy**: Appropriate caching for expensive operations
- [ ] **Cache Invalidation**: Cache invalidated when data changes
- [ ] **Cache TTL**: Reasonable TTL set

**Example**:
```typescript
// ✅ GOOD - Caching expensive query
async getLessons(track: string, stage: number) {
  const cacheKey = `lessons:${track}:${stage}`;

  const cached = await this.cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const lessons = await this.prisma.lesson.findMany({
    where: { track, stage }
  });

  await this.cache.set(cacheKey, JSON.stringify(lessons), 300);
  return lessons;
}
```

### React Performance

- [ ] **Unnecessary Re-renders**: Components don't re-render unnecessarily
- [ ] **useMemo/useCallback**: Used appropriately for expensive operations
  ```typescript
  // ✅ GOOD - Memoize expensive calculation
  const sortedLessons = useMemo(() => {
    return lessons.sort((a, b) => a.order - b.order);
  }, [lessons]);
  ```

- [ ] **React.memo**: Used for expensive components
- [ ] **Code Splitting**: Large components are lazy-loaded
  ```typescript
  // ✅ GOOD - Lazy load
  const LessonDetail = lazy(() => import('./LessonDetail'));
  ```

### Asset Optimization

- [ ] **Image Optimization**: Images optimized (Next.js Image component)
- [ ] **Bundle Size**: No unnecessary dependencies
- [ ] **Tree Shaking**: Imports are tree-shakable

### API Performance

- [ ] **Response Time**: Endpoints respond quickly (< 200ms)
- [ ] **Payload Size**: Response payloads are reasonable
- [ ] **Compression**: Compression enabled (gzip)

---

## Testing Review

### Test Coverage

- [ ] **Coverage Threshold**: Minimum 80% coverage met
- [ ] **Critical Paths**: 100% coverage for critical code
- [ ] **New Code**: All new code has tests

### Test Quality

- [ ] **Test Readability**: Tests are clear and well-named
  ```typescript
  // ✅ GOOD - Descriptive test name
  it('should throw NotFoundException when lesson does not exist', async () => {
    // ...
  });

  // ❌ BAD - Unclear test name
  it('test lesson', async () => {
    // ...
  });
  ```

- [ ] **Test Independence**: Tests don't depend on each other
- [ ] **Test Data**: Test data is realistic
- [ ] **Mocking**: External dependencies are mocked appropriately
- [ ] **Assertions**: Tests have clear assertions

### Test Types

- [ ] **Unit Tests**: Individual functions/methods tested
- [ ] **Integration Tests**: Components work together
- [ ] **Edge Cases**: Edge cases are tested
- [ ] **Error Cases**: Error handling is tested
  ```typescript
  // ✅ GOOD - Test error case
  it('should throw BadRequestException for invalid email', async () => {
    await expect(service.register({ email: 'invalid', password: 'pass' }))
      .rejects.toThrow(BadRequestException);
  });
  ```

### React Component Tests

- [ ] **Render Tests**: Components render without errors
- [ ] **User Interaction**: User interactions are tested
- [ ] **Props**: Different prop combinations tested
- [ ] **State Changes**: State changes are tested

**Example**:
```typescript
// ✅ GOOD - Component test
describe('LessonCard', () => {
  it('renders lesson information', () => {
    const { getByText } = render(<LessonCard lesson={mockLesson} />);
    expect(getByText('Test Lesson')).toBeInTheDocument();
  });

  it('calls onStart when button clicked', () => {
    const onStart = jest.fn();
    const { getByRole } = render(<LessonCard lesson={mockLesson} onStart={onStart} />);

    fireEvent.click(getByRole('button', { name: /start/i }));
    expect(onStart).toHaveBeenCalledWith(mockLesson.id);
  });
});
```

---

## Documentation Review

### Code Comments

- [ ] **Complex Logic**: Complex algorithms are commented
- [ ] **Why Not What**: Comments explain "why", not "what"
  ```typescript
  // ❌ BAD - Obvious comment
  // Set loading to true
  setIsLoading(true);

  // ✅ GOOD - Explains why
  // Cache must be invalidated before refresh to prevent stale data
  await this.cache.del(cacheKey);
  ```

- [ ] **No Commented Code**: No commented-out code blocks
- [ ] **TODOs**: TODOs have ticket references
  ```typescript
  // ✅ GOOD
  // TODO(ARQ-123): Add pagination support

  // ❌ BAD
  // TODO: fix this later
  ```

### Function Documentation

- [ ] **TSDoc**: Public functions have TSDoc comments
  ```typescript
  /**
   * Calculates XP earned for exercise completion
   *
   * @param accuracy - Exercise accuracy (0-100)
   * @param difficulty - Difficulty level
   * @returns XP points earned
   *
   * @example
   * const xp = calculateXP(85, 'intermediate'); // Returns 127
   */
  function calculateXP(accuracy: number, difficulty: Difficulty): number {
    // ...
  }
  ```

- [ ] **Parameter Descriptions**: Complex parameters are documented
- [ ] **Return Values**: Return values are documented
- [ ] **Examples**: Examples provided for complex functions

### API Documentation

- [ ] **Swagger/OpenAPI**: API endpoints documented
  ```typescript
  // ✅ GOOD
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findAll() { }
  ```

- [ ] **Request Examples**: Request examples provided
- [ ] **Response Examples**: Response examples provided
- [ ] **Error Responses**: Error responses documented

### README Updates

- [ ] **Setup Instructions**: Updated if setup changed
- [ ] **New Features**: New features documented
- [ ] **Breaking Changes**: Breaking changes highlighted

---

## UI/UX Review

### User Interface

- [ ] **Design Match**: UI matches design mockups
- [ ] **Responsive**: Layout responsive on mobile/tablet/desktop
- [ ] **Visual Consistency**: Consistent with existing UI
- [ ] **Loading States**: Loading indicators present
- [ ] **Error States**: Error messages displayed clearly
- [ ] **Empty States**: Empty states handled gracefully

### User Experience

- [ ] **Intuitive**: UI is intuitive and user-friendly
- [ ] **Feedback**: User receives feedback for actions
- [ ] **Navigation**: Navigation is clear
- [ ] **Forms**: Form validation is clear and helpful
- [ ] **Confirmation**: Destructive actions require confirmation

### Frontend Performance

- [ ] **Load Time**: Pages load quickly (< 2 seconds)
- [ ] **Smooth Animations**: Animations are smooth (60fps)
- [ ] **No Layout Shift**: Minimal cumulative layout shift
- [ ] **Image Loading**: Images load without blocking

---

## Accessibility Review

### WCAG 2.1 AA Compliance

- [ ] **Semantic HTML**: Proper HTML5 semantic elements
  ```html
  <!-- ✅ GOOD -->
  <nav>
    <ul>
      <li><a href="/lessons">Lessons</a></li>
    </ul>
  </nav>

  <!-- ❌ BAD -->
  <div class="nav">
    <div class="link">Lessons</div>
  </div>
  ```

- [ ] **Heading Hierarchy**: Proper heading structure (h1 → h2 → h3)
- [ ] **Alt Text**: Images have descriptive alt text
- [ ] **Form Labels**: Form inputs have associated labels

### Keyboard Navigation

- [ ] **Tab Order**: Logical tab order
- [ ] **Focus Indicators**: Clear focus indicators
- [ ] **Keyboard Shortcuts**: Important actions accessible via keyboard
- [ ] **No Keyboard Traps**: No keyboard traps

**Example**:
```typescript
// ✅ GOOD - Keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>
```

### Screen Reader Support

- [ ] **ARIA Labels**: ARIA labels for icon buttons
  ```typescript
  // ✅ GOOD
  <button aria-label="Close dialog">
    <CloseIcon />
  </button>
  ```

- [ ] **ARIA Roles**: Appropriate ARIA roles
- [ ] **Live Regions**: Dynamic content updates announced
- [ ] **Hidden Content**: Decorative content hidden from screen readers

### Color Contrast

- [ ] **Text Contrast**: Text meets 4.5:1 contrast ratio
- [ ] **Large Text Contrast**: Large text meets 3:1 contrast ratio
- [ ] **Focus Indicators**: Focus indicators meet 3:1 contrast ratio
- [ ] **No Color-Only Info**: Information not conveyed by color alone

---

## Arabic/RTL Review

### RTL Layout

- [ ] **Direction Attribute**: Correct `dir` attribute
  ```html
  <!-- ✅ GOOD -->
  <div dir="rtl" lang="ar">{arabicText}</div>
  <div dir="ltr" lang="en">{englishText}</div>
  ```

- [ ] **RTL Styles**: Styles work correctly in RTL
- [ ] **Mirroring**: UI elements mirrored appropriately
- [ ] **Icons**: Icons oriented correctly for RTL

### Arabic Text Display

- [ ] **Font Loading**: Arabic fonts loaded correctly
- [ ] **Diacritics**: Diacritics display correctly
- [ ] **Text Rendering**: No text rendering issues
- [ ] **Line Height**: Adequate line height for Arabic

### Bidirectional Text

- [ ] **Mixed Content**: Mixed LTR/RTL content handled
  ```html
  <!-- ✅ GOOD -->
  <p dir="rtl">
    {arabicText} <span dir="ltr">{englishWord}</span> {moreArabicText}
  </p>
  ```

- [ ] **Numbers**: Numbers display correctly in Arabic context
- [ ] **Punctuation**: Punctuation placed correctly

### Arabic-Specific Features

- [ ] **Search**: Arabic search works (with/without diacritics)
- [ ] **Sorting**: Arabic text sorts correctly
- [ ] **Input**: Arabic text input works correctly

---

## Database Review

### Schema Design

- [ ] **Normalization**: Database is properly normalized
- [ ] **Foreign Keys**: Foreign key relationships defined
- [ ] **Constraints**: Appropriate constraints (unique, not null)
- [ ] **Data Types**: Correct data types used

### Migrations

- [ ] **Reversible**: Migration can be rolled back
- [ ] **Data Safety**: Existing data is preserved
- [ ] **Performance**: Migration doesn't lock tables excessively
- [ ] **Tested**: Migration tested locally

### Indexes

- [ ] **Query Optimization**: Indexes for common queries
- [ ] **Composite Indexes**: Composite indexes used appropriately
- [ ] **Index Size**: Indexes don't bloat database excessively

**Example**:
```prisma
// ✅ GOOD - Indexes for common queries
model Lesson {
  id String @id @default(uuid())
  track String
  stage Int

  @@index([track, stage])
  @@index([grammarTopic])
}
```

### Query Review

- [ ] **Efficient Queries**: Queries are efficient
- [ ] **Select Specific Fields**: Only needed fields selected
- [ ] **Transaction Usage**: Transactions used where needed
- [ ] **Connection Management**: Connections properly managed

---

## API Review

### Endpoint Design

- [ ] **RESTful**: API follows REST principles
- [ ] **Resource Naming**: Resource names are plural nouns
- [ ] **HTTP Methods**: Correct HTTP methods used
  - GET: Retrieve
  - POST: Create
  - PUT: Full update
  - PATCH: Partial update
  - DELETE: Delete

### Request/Response

- [ ] **Consistent Format**: Consistent response format
  ```json
  {
    "success": true,
    "data": { },
    "meta": { }
  }
  ```

- [ ] **Error Format**: Consistent error format
  ```json
  {
    "success": false,
    "error": {
      "statusCode": 400,
      "message": "Validation failed",
      "errors": { }
    }
  }
  ```

- [ ] **Status Codes**: Appropriate HTTP status codes
- [ ] **Pagination**: Large result sets paginated

### Validation

- [ ] **Input Validation**: All inputs validated
- [ ] **Type Validation**: Types enforced
- [ ] **Business Rules**: Business rules validated

### Versioning

- [ ] **API Version**: API version in URL (`/api/v1/`)
- [ ] **Breaking Changes**: Breaking changes in new version

---

## Final Approval Checklist

### Before Approving

**Reviewer must verify**:

- [ ] All [MUST] comments addressed
- [ ] No security vulnerabilities
- [ ] No performance issues
- [ ] Tests are comprehensive and passing
- [ ] Documentation is adequate
- [ ] Code follows project standards
- [ ] PR size is reasonable
- [ ] Changes are backward compatible (or migration provided)

### Approval Types

**✅ Approve** when:
- All required changes are made
- Code meets quality standards
- Ready to merge

**💬 Comment** when:
- Only suggestions or questions
- No blocking issues
- Early feedback on draft PR

**🔄 Request Changes** when:
- [MUST] issues exist
- Tests are missing or failing
- Security concerns
- Breaking changes without discussion

### After Approval

- [ ] Squash and merge (for feature branches)
- [ ] Delete source branch
- [ ] Verify CI/CD pipeline passes
- [ ] Monitor for issues after merge

---

## Quick Reference

### Common Issues

| Issue | Severity | Example |
|-------|----------|---------|
| Hardcoded secrets | [MUST] | `const API_KEY = 'abc123'` |
| No input validation | [MUST] | No DTO validation on endpoint |
| SQL injection risk | [MUST] | String interpolation in SQL |
| Missing tests | [MUST] | No tests for new feature |
| Poor naming | [SHOULD] | `function x(a, b)` |
| Code duplication | [SHOULD] | Same logic repeated |
| Missing comments | [CONSIDER] | Complex algorithm not explained |
| Could optimize | [CONSIDER] | Potential performance improvement |

### Review Time by Component

| Component | Focus Areas |
|-----------|-------------|
| **Backend** | Security, performance, error handling, tests |
| **Frontend** | Accessibility, RTL, performance, UX |
| **Database** | Indexes, migrations, query optimization |
| **API** | Documentation, validation, consistency |
| **Tests** | Coverage, quality, edge cases |

---

## Templates

### Review Comment Template

```markdown
## Summary
Brief summary of review feedback.

## 🚨 Blocking Issues ([MUST])
1. [Security] Hardcoded API key in auth.service.ts:42
2. [Tests] No tests for new registration endpoint

## 💡 Recommendations ([SHOULD])
1. [Performance] Consider caching lesson queries
2. [Code Quality] Extract complex calculation to separate function

## 🤔 Questions ([QUESTION])
1. Why was approach A chosen over approach B for lesson filtering?

## 👍 Praise ([PRAISE])
1. Excellent error handling in the service layer
2. Great test coverage on the exercise module

## Overall
Code quality is good, but security issues must be addressed before merge.
```

### Author Response Template

```markdown
## Changes Made

### Blocking Issues
- ✅ Fixed: Moved API key to environment variable
- ✅ Fixed: Added unit tests for registration endpoint

### Recommendations
- ✅ Implemented caching for lesson queries
- ✅ Extracted calculation to `calculateLessonProgress()`

### Questions
> Why was approach A chosen over approach B?

Approach A provides better type safety and aligns with our
existing patterns in the exercises module.

## Ready for Re-Review
All blocking issues have been addressed. Ready for re-review.
```

---

**Last Updated**: 2025-11-03
**Maintained By**: QA Lead + Solution Architect

**Related Documents**:
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
