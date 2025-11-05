# Coding Standards - arQ (Quranic Arabic Grammar LMS)

**Version**: 1.0
**Last Updated**: 2025-11-03
**Owner**: Solution Architect + Backend Lead + Frontend Lead + Mobile Lead

---

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [Backend Standards (NestJS)](#backend-standards-nestjs)
4. [Frontend Standards (Next.js/React)](#frontend-standards-nextjsreact)
5. [Mobile Standards (React Native)](#mobile-standards-react-native)
6. [Database Standards](#database-standards)
7. [Naming Conventions](#naming-conventions)
8. [Code Organization](#code-organization)
9. [Comment and Documentation Standards](#comment-and-documentation-standards)
10. [Testing Standards](#testing-standards)
11. [Git Commit Standards](#git-commit-standards)
12. [Code Review Checklist](#code-review-checklist)
13. [Security Best Practices](#security-best-practices)
14. [Performance Guidelines](#performance-guidelines)
15. [Accessibility Standards](#accessibility-standards)
16. [Arabic/RTL-Specific Standards](#arabicrtl-specific-standards)
17. [Error Handling](#error-handling)
18. [Configuration and Environment](#configuration-and-environment)

---

## General Principles

### 1. Code Quality Mantras

- **Readability over cleverness**: Write code that is easy to understand, not code that shows off technical prowess
- **Explicit over implicit**: Prefer clarity over brevity
- **Fail fast**: Validate inputs early and throw meaningful errors
- **DRY (Don't Repeat Yourself)**: But not at the expense of readability
- **SOLID principles**: Especially Single Responsibility Principle
- **YAGNI (You Aren't Gonna Need It)**: Don't add features speculatively

### 2. Code Style Enforcement

All code MUST pass these checks before committing:

```bash
# TypeScript type checking
npm run type-check

# Linting (ESLint)
npm run lint

# Formatting (Prettier)
npm run format

# Unit tests
npm run test

# Integration tests (if applicable)
npm run test:e2e
```

### 3. Zero Warnings Policy

- **No TypeScript warnings**: All code must compile with zero warnings
- **No ESLint warnings**: Fix all linting issues, don't disable rules
- **No console.log in production**: Use proper logging (Winston/Pino)

---

## TypeScript Standards

### 1. Type Safety

**ALWAYS use strict TypeScript**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. Type Definitions

**DO** - Use explicit types:
```typescript
// ✅ GOOD
function calculateXP(lessonId: string, accuracy: number): number {
  return Math.floor(accuracy * 100);
}

interface UserProgress {
  userId: string;
  currentXP: number;
  currentLevel: number;
  lessonsCompleted: string[];
}
```

**DON'T** - Use implicit any:
```typescript
// ❌ BAD
function calculateXP(lessonId, accuracy) {
  return Math.floor(accuracy * 100);
}

// ❌ BAD - Using 'any'
function processData(data: any) {
  // ...
}
```

### 3. Type vs Interface

**Use `interface` for object shapes** (extensible):
```typescript
// ✅ GOOD - Use interface for API responses
interface UserResponse {
  id: string;
  email: string;
  name: string;
}

// Can be extended later
interface StudentResponse extends UserResponse {
  currentXP: number;
  currentLevel: number;
}
```

**Use `type` for unions, intersections, primitives**:
```typescript
// ✅ GOOD - Use type for unions
type POSType = 'noun' | 'verb' | 'particle' | 'pronoun';

type GrammarField = {
  arabic: string;
  english: string;
  value: string;
};

// Intersection types
type UserWithProgress = User & { progress: Progress };
```

### 4. Avoid Type Assertions

**DO** - Use type guards:
```typescript
// ✅ GOOD
function isStudent(user: User): user is Student {
  return 'currentXP' in user;
}

if (isStudent(user)) {
  console.log(user.currentXP); // Type-safe
}
```

**DON'T** - Use 'as' assertions unless absolutely necessary:
```typescript
// ❌ BAD - Avoid type assertions
const user = response.data as Student;
```

### 5. Enums vs Union Types

**Prefer string literal unions over enums** (better for API serialization):
```typescript
// ✅ GOOD - String literal union
type UserRole = 'student' | 'teacher' | 'admin';

// ❌ BAD - Avoid enums unless needed for flags
enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin'
}
```

### 6. Utility Types

Use TypeScript utility types effectively:
```typescript
// Pick - Select specific properties
type UserBasicInfo = Pick<User, 'id' | 'email' | 'name'>;

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Partial - Make all properties optional
type UserUpdateDto = Partial<User>;

// Required - Make all properties required
type UserCreateDto = Required<Pick<User, 'email' | 'password' | 'name'>>;

// Record - Create object type with specific keys
type GrammarFields = Record<POSType, GrammarField[]>;
```

---

## Backend Standards (NestJS)

### 1. Module Organization

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   └── tests/
│   │       ├── auth.controller.spec.ts
│   │       ├── auth.service.spec.ts
│   ├── users/
│   ├── lessons/
│   ├── exercises/
│   ├── progress/
│   └── analytics/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── redis.config.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

### 2. Controller Standards

```typescript
// ✅ GOOD - Well-structured controller
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';

@ApiTags('lessons')
@Controller('api/v1/lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({
    status: 201,
    description: 'Lesson created successfully',
    type: LessonResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons with pagination' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('track') track?: 'A' | 'B',
    @Query('stage') stage?: number,
  ) {
    return this.lessonsService.findAll({ page, limit, track, stage });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async findOne(@Param('id') id: string): Promise<LessonResponseDto> {
    return this.lessonsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete lesson by ID' })
  @ApiResponse({ status: 204, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.lessonsService.remove(id);
  }
}
```

### 3. Service Standards

```typescript
// ✅ GOOD - Service with error handling and logging
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    this.logger.log(`Creating lesson: ${createLessonDto.title}`);

    try {
      const lesson = await this.prisma.lesson.create({
        data: createLessonDto,
      });

      // Invalidate cache
      await this.cache.del('lessons:all');

      this.logger.log(`Lesson created: ${lesson.id}`);
      return this.mapToResponseDto(lesson);
    } catch (error) {
      this.logger.error(`Failed to create lesson: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create lesson');
    }
  }

  async findAll(options: {
    page: number;
    limit: number;
    track?: 'A' | 'B';
    stage?: number;
  }) {
    const { page, limit, track, stage } = options;
    const skip = (page - 1) * limit;

    // Try cache first
    const cacheKey = `lessons:page:${page}:limit:${limit}:track:${track}:stage:${stage}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return JSON.parse(cached);
    }

    // Build where clause
    const where = {
      ...(track && { track }),
      ...(stage && { stage }),
    };

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    const result = {
      data: lessons.map(this.mapToResponseDto),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 5 minutes
    await this.cache.set(cacheKey, JSON.stringify(result), 300);

    return result;
  }

  async findOne(id: string): Promise<LessonResponseDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        exercises: true,
        verses: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return this.mapToResponseDto(lesson);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<LessonResponseDto> {
    // Check if lesson exists
    await this.findOne(id);

    try {
      const lesson = await this.prisma.lesson.update({
        where: { id },
        data: updateLessonDto,
      });

      // Invalidate cache
      await this.cache.del('lessons:all');
      await this.cache.delPattern(`lessons:page:*`);

      this.logger.log(`Lesson updated: ${id}`);
      return this.mapToResponseDto(lesson);
    } catch (error) {
      this.logger.error(`Failed to update lesson: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update lesson');
    }
  }

  async remove(id: string): Promise<void> {
    // Check if lesson exists
    await this.findOne(id);

    try {
      await this.prisma.lesson.delete({
        where: { id },
      });

      // Invalidate cache
      await this.cache.del('lessons:all');
      await this.cache.delPattern(`lessons:page:*`);

      this.logger.log(`Lesson deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete lesson: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete lesson');
    }
  }

  private mapToResponseDto(lesson: any): LessonResponseDto {
    return {
      id: lesson.id,
      title: lesson.title,
      titleArabic: lesson.titleArabic,
      description: lesson.description,
      track: lesson.track,
      stage: lesson.stage,
      grammarTopic: lesson.grammarTopic,
      difficulty: lesson.difficulty,
      estimatedTime: lesson.estimatedTime,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
```

### 4. DTO Validation

**ALWAYS validate DTOs with class-validator**:

```typescript
// ✅ GOOD - Validated DTO
import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty, IsOptional, IsIn, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson title (English)', example: 'Introduction to Arabic Nouns' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Lesson title (Arabic)', example: 'مقدمة في الأسماء العربية' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  titleArabic: string;

  @ApiPropertyOptional({ description: 'Lesson description' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ description: 'Learning track', enum: ['A', 'B'] })
  @IsString()
  @IsIn(['A', 'B'])
  track: 'A' | 'B';

  @ApiProperty({ description: 'Learning stage (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  stage: number;

  @ApiProperty({ description: 'Grammar topic', example: 'nouns' })
  @IsString()
  @IsNotEmpty()
  grammarTopic: string;

  @ApiProperty({ description: 'Difficulty level', enum: ['beginner', 'intermediate', 'advanced'] })
  @IsString()
  @IsIn(['beginner', 'intermediate', 'advanced'])
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: 'Estimated completion time (minutes)', example: 15 })
  @IsNumber()
  @Min(1)
  @Max(180)
  estimatedTime: number;
}
```

### 5. Error Handling

**Use NestJS built-in exceptions**:

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';

// ✅ GOOD - Explicit error handling
async findUserByEmail(email: string): Promise<User> {
  const user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }

  return user;
}

async createUser(createUserDto: CreateUserDto): Promise<User> {
  // Check if user already exists
  const existingUser = await this.prisma.user.findUnique({
    where: { email: createUserDto.email },
  });

  if (existingUser) {
    throw new ConflictException('User with this email already exists');
  }

  try {
    return await this.prisma.user.create({ data: createUserDto });
  } catch (error) {
    this.logger.error(`Failed to create user: ${error.message}`, error.stack);
    throw new InternalServerErrorException('Failed to create user');
  }
}
```

### 6. Global Exception Filter

```typescript
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: typeof message === 'string' ? message : (message as any).message || message,
      },
    };

    // Log error
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json(errorResponse);
  }
}
```

---

## Frontend Standards (Next.js/React)

### 1. Component Organization

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── lessons/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── progress/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── features/         # Feature-specific components
│   │   ├── lessons/
│   │   │   ├── LessonCard.tsx
│   │   │   ├── LessonList.tsx
│   │   │   └── LessonDetail.tsx
│   │   ├── grammar/
│   │   │   ├── HierarchicalGrammar.tsx
│   │   │   ├── GrammarLayer.tsx
│   │   │   └── GrammarTable.tsx
│   │   └── exercises/
│   │       ├── ExerciseCard.tsx
│   │       └── ExerciseSubmit.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── api/              # API client functions
│   │   ├── lessons.ts
│   │   ├── exercises.ts
│   │   └── auth.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLessons.ts
│   │   └── useProgress.ts
│   ├── utils/            # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── arabic.ts
│   └── store/            # Zustand stores
│       ├── authStore.ts
│       ├── lessonsStore.ts
│       └── progressStore.ts
├── types/
│   ├── api.ts
│   ├── lesson.ts
│   └── user.ts
└── styles/
    └── globals.css
```

### 2. Component Standards

**Functional Components with TypeScript**:

```typescript
// ✅ GOOD - Well-structured component
import React, { useState, useEffect } from 'react';
import { Lesson } from '@/types/lesson';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface LessonCardProps {
  lesson: Lesson;
  onStart: (lessonId: string) => void;
  onBookmark?: (lessonId: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onStart,
  onBookmark,
  isBookmarked = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleStart = () => {
    onStart(lesson.id);
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(lesson.id);
    }
  };

  return (
    <Card
      className={`lesson-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="lesson-card-header">
        <h3 className="lesson-title">{lesson.title}</h3>
        <p className="lesson-title-arabic" dir="rtl">
          {lesson.titleArabic}
        </p>
      </div>

      <div className="lesson-card-body">
        <p className="lesson-description">{lesson.description}</p>

        <div className="lesson-meta">
          <span className="badge badge-{lesson.difficulty}">
            {lesson.difficulty}
          </span>
          <span className="lesson-duration">
            {lesson.estimatedTime} min
          </span>
        </div>
      </div>

      <div className="lesson-card-footer">
        <Button onClick={handleStart} variant="primary">
          Start Lesson
        </Button>

        {onBookmark && (
          <Button
            onClick={handleBookmark}
            variant="ghost"
            icon={isBookmarked ? 'bookmark-filled' : 'bookmark'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          />
        )}
      </div>
    </Card>
  );
};

// Default export for code splitting
export default LessonCard;
```

### 3. Custom Hooks

**Extract reusable logic into custom hooks**:

```typescript
// ✅ GOOD - Custom hook for lessons
import { useState, useEffect } from 'react';
import { Lesson } from '@/types/lesson';
import { getLessons } from '@/lib/api/lessons';

interface UseLessonsOptions {
  track?: 'A' | 'B';
  stage?: number;
  page?: number;
  limit?: number;
}

interface UseLessonsReturn {
  lessons: Lesson[];
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  refetch: () => void;
}

export function useLessons(options: UseLessonsOptions = {}): UseLessonsReturn {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getLessons(options);

      setLessons(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [options.track, options.stage, options.page, options.limit]);

  return {
    lessons,
    isLoading,
    error,
    totalPages,
    refetch: fetchLessons,
  };
}
```

### 4. State Management (Zustand)

```typescript
// ✅ GOOD - Zustand store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 5. API Client

```typescript
// ✅ GOOD - API client with error handling
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors, token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 (token expired)
    if (error.response?.status === 401 && originalRequest) {
      try {
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Refresh token
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update store
        useAuthStore.getState().setAuth(
          response.data.data.user,
          newAccessToken,
          newRefreshToken
        );

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Typed API error
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error parser
export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.error?.message || 'An error occurred';
    const errors = error.response?.data?.error?.errors;

    return new ApiError(message, statusCode, errors);
  }

  return new ApiError('An unexpected error occurred', 500);
}
```

### 6. Server Components vs Client Components

**Use Server Components by default** (Next.js 14 App Router):

```typescript
// ✅ GOOD - Server Component (default)
// app/lessons/page.tsx
import { getLessons } from '@/lib/api/lessons';
import { LessonList } from '@/components/features/lessons/LessonList';

export default async function LessonsPage() {
  const lessons = await getLessons(); // Fetch on server

  return (
    <div className="lessons-page">
      <h1>Lessons</h1>
      <LessonList lessons={lessons} />
    </div>
  );
}

// ✅ GOOD - Client Component (with 'use client')
// components/features/lessons/LessonList.tsx
'use client';

import { useState } from 'react';
import { Lesson } from '@/types/lesson';
import { LessonCard } from './LessonCard';

interface LessonListProps {
  lessons: Lesson[];
}

export function LessonList({ lessons }: LessonListProps) {
  const [filter, setFilter] = useState<'all' | 'A' | 'B'>('all');

  const filteredLessons = lessons.filter(
    (lesson) => filter === 'all' || lesson.track === filter
  );

  return (
    <div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('A')}>Track A</button>
        <button onClick={() => setFilter('B')}>Track B</button>
      </div>

      <div className="lessons-grid">
        {filteredLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
```

---

## Mobile Standards (React Native)

### 1. Component Structure

```typescript
// ✅ GOOD - React Native component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lesson } from '@/types/lesson';

interface LessonCardProps {
  lesson: Lesson;
  onPress: (lessonId: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onPress }) => {
  const handlePress = () => {
    onPress(lesson.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={[styles.titleArabic, styles.rtl]}>{lesson.titleArabic}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description}
        </Text>

        <View style={styles.meta}>
          <View style={[styles.badge, styles[`badge${lesson.difficulty}`]]}>
            <Text style={styles.badgeText}>{lesson.difficulty}</Text>
          </View>
          <Text style={styles.duration}>{lesson.estimatedTime} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  titleArabic: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a4a4a',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  body: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgebeginner: {
    backgroundColor: '#e3f2fd',
  },
  badgeintermediate: {
    backgroundColor: '#fff3e0',
  },
  badgeadvanced: {
    backgroundColor: '#fce4ec',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
});
```

### 2. Navigation (Expo Router)

```typescript
// ✅ GOOD - Typed navigation
import { useRouter } from 'expo-router';
import { Lesson } from '@/types/lesson';

export function useLessonNavigation() {
  const router = useRouter();

  const navigateToLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`);
  };

  const navigateToExercise = (lessonId: string, exerciseId: string) => {
    router.push(`/lessons/${lessonId}/exercises/${exerciseId}`);
  };

  const goBack = () => {
    router.back();
  };

  return {
    navigateToLesson,
    navigateToExercise,
    goBack,
  };
}
```

---

## Database Standards

### 1. Prisma Schema

```prisma
// ✅ GOOD - Well-structured Prisma schema
model User {
  id        String   @id @default(uuid()) @db.Uuid
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)
  name      String   @db.VarChar(255)
  role      UserRole @default(STUDENT)

  // Timestamps
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  progress    UserProgress?
  achievements UserAchievement[]
  exercises   UserExercise[]

  // Indexes
  @@index([email])
  @@map("users")
}

model Lesson {
  id            String   @id @default(uuid()) @db.Uuid
  title         String   @db.VarChar(255)
  titleArabic   String   @map("title_arabic") @db.VarChar(255)
  description   String?  @db.Text
  track         Track    @db.VarChar(1)
  stage         Int      @db.SmallInt
  grammarTopic  String   @map("grammar_topic") @db.VarChar(100)
  difficulty    Difficulty @db.VarChar(20)
  estimatedTime Int      @map("estimated_time") @db.SmallInt

  // Timestamps
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  exercises Exercise[]
  verses    LessonVerse[]

  // Indexes
  @@index([track, stage])
  @@index([grammarTopic])
  @@map("lessons")
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

enum Track {
  A
  B
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

### 2. Query Optimization

**Use indexes, select specific fields, avoid N+1 queries**:

```typescript
// ✅ GOOD - Optimized query
async findLessonsWithExercises(track: 'A' | 'B', stage: number) {
  return this.prisma.lesson.findMany({
    where: {
      track,
      stage,
    },
    select: {
      id: true,
      title: true,
      titleArabic: true,
      difficulty: true,
      estimatedTime: true,
      exercises: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// ❌ BAD - N+1 query problem
async findLessonsWithExercises(track: 'A' | 'B', stage: number) {
  const lessons = await this.prisma.lesson.findMany({
    where: { track, stage },
  });

  // This creates N+1 queries (one query per lesson)
  for (const lesson of lessons) {
    lesson.exercises = await this.prisma.exercise.findMany({
      where: { lessonId: lesson.id },
    });
  }

  return lessons;
}
```

### 3. Transactions

**Use transactions for operations that must succeed or fail together**:

```typescript
// ✅ GOOD - Transaction for exercise completion
async completeExercise(userId: string, exerciseId: string, accuracy: number) {
  return this.prisma.$transaction(async (prisma) => {
    // 1. Record exercise attempt
    const userExercise = await prisma.userExercise.create({
      data: {
        userId,
        exerciseId,
        accuracy,
        timeSpent: 120, // seconds
        completedAt: new Date(),
      },
    });

    // 2. Calculate XP
    const xpEarned = Math.floor(accuracy * 10);

    // 3. Update user progress
    const userProgress = await prisma.userProgress.update({
      where: { userId },
      data: {
        currentXP: {
          increment: xpEarned,
        },
        exercisesCompleted: {
          increment: 1,
        },
      },
    });

    // 4. Check for level up
    const newLevel = Math.floor(userProgress.currentXP / 1000) + 1;
    if (newLevel > userProgress.currentLevel) {
      await prisma.userProgress.update({
        where: { userId },
        data: { currentLevel: newLevel },
      });
    }

    return {
      userExercise,
      xpEarned,
      newLevel,
    };
  });
}
```

---

## Naming Conventions

### 1. Files and Folders

- **Components**: PascalCase - `LessonCard.tsx`, `GrammarTable.tsx`
- **Utilities**: camelCase - `formatDate.ts`, `validateEmail.ts`
- **Hooks**: camelCase with `use` prefix - `useAuth.ts`, `useLessons.ts`
- **Types**: camelCase - `lesson.ts`, `user.ts`, `api.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_BASE_URL`, `MAX_UPLOAD_SIZE`
- **Folders**: kebab-case - `user-profile`, `lesson-detail`

### 2. Variables and Functions

```typescript
// ✅ GOOD naming
const userName = 'Ahmed'; // camelCase for variables
const API_BASE_URL = 'https://api.example.com'; // UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;

function calculateXP(accuracy: number): number { // camelCase for functions
  return Math.floor(accuracy * 100);
}

class LessonService { // PascalCase for classes
  private readonly logger = new Logger(); // camelCase for private properties

  async findAll(): Promise<Lesson[]> { // camelCase for methods
    // ...
  }
}

interface UserProgress { // PascalCase for interfaces
  userId: string;
  currentXP: number;
}

type POSType = 'noun' | 'verb' | 'particle'; // PascalCase for types
```

### 3. Boolean Variables

**Prefix with `is`, `has`, `should`, `can`**:

```typescript
// ✅ GOOD
const isLoading = true;
const hasPermission = false;
const shouldRefresh = true;
const canEdit = false;

// ❌ BAD
const loading = true;
const permission = false;
```

### 4. Event Handlers

**Prefix with `handle` or `on`**:

```typescript
// ✅ GOOD
const handleSubmit = () => { /* ... */ };
const handleClick = () => { /* ... */ };
const onSuccess = () => { /* ... */ };
const onError = () => { /* ... */ };

// ❌ BAD
const submit = () => { /* ... */ };
const clicked = () => { /* ... */ };
```

---

## Code Organization

### 1. Import Order

```typescript
// ✅ GOOD - Organized imports
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// 2. Internal modules (absolute imports)
import { Button } from '@/components/ui/Button';
import { useLessons } from '@/lib/hooks/useLessons';
import { Lesson } from '@/types/lesson';

// 3. Relative imports
import { LessonCard } from './LessonCard';
import styles from './LessonList.module.css';

// 4. Types (if not imported above)
import type { NextPage } from 'next';
```

### 2. Component Structure

```typescript
// ✅ GOOD - Organized component
import React, { useState, useEffect } from 'react';

// 1. Types
interface Props {
  // ...
}

// 2. Constants
const MAX_LESSONS = 20;

// 3. Component
export const LessonList: React.FC<Props> = ({ lessons }) => {
  // 3a. State hooks
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // 3b. Custom hooks
  const { refetch } = useLessons();

  // 3c. useEffect hooks
  useEffect(() => {
    // ...
  }, []);

  // 3d. Event handlers
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  // 3e. Helper functions
  const filterLessons = () => {
    // ...
  };

  // 3f. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
};

// 4. Helper components (if any)
const FilterButton = () => {
  // ...
};
```

---

## Comment and Documentation Standards

### 1. TSDoc Comments

**Use TSDoc for functions, classes, and interfaces**:

```typescript
/**
 * Calculates XP earned based on exercise accuracy
 *
 * @param accuracy - Exercise accuracy as a percentage (0-100)
 * @param difficulty - Difficulty level of the exercise
 * @returns XP earned (integer)
 *
 * @example
 * ```typescript
 * const xp = calculateXP(85, 'intermediate');
 * // Returns: 85
 * ```
 */
export function calculateXP(
  accuracy: number,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  const baseXP = Math.floor(accuracy);
  const multiplier = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 1.5 : 2;
  return Math.floor(baseXP * multiplier);
}
```

### 2. When to Comment

**DO comment**:
- Complex algorithms or business logic
- Non-obvious code (regex, mathematical formulas)
- Workarounds or hacks (with explanation)
- Important assumptions or constraints

```typescript
// ✅ GOOD - Useful comment
// Calculate level from XP using logarithmic scale
// Level 1 = 0-999 XP, Level 2 = 1000-2999 XP, Level 3 = 3000-5999 XP, etc.
const level = Math.floor(Math.log2(currentXP / 1000 + 1)) + 1;

// ✅ GOOD - Explaining workaround
// HACK: Safari doesn't support lookbehind in regex, using alternative approach
const pattern = /(?:^|\s)(\w+)/g; // Match words after whitespace
```

**DON'T comment**:
- Obvious code
- What the code does (code should be self-explanatory)
- Commented-out code (delete it instead)

```typescript
// ❌ BAD - Obvious comment
// Set isLoading to true
setIsLoading(true);

// ❌ BAD - Commented-out code (delete it!)
// const oldFunction = () => { /* ... */ };
```

### 3. TODO Comments

```typescript
// TODO: Add caching for lesson data
// FIXME: Handle edge case when user has no progress
// HACK: Workaround for iOS keyboard bug
// NOTE: This function is called from multiple places
```

---

## Testing Standards

### 1. Test File Naming

- Unit tests: `*.spec.ts` or `*.test.ts`
- E2E tests: `*.e2e-spec.ts`
- Integration tests: `*.integration-spec.ts`

### 2. Unit Test Structure

```typescript
// ✅ GOOD - Well-structured test
import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LessonsService', () => {
  let service: LessonsService;
  let prisma: PrismaService;

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
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    prisma = module.get<PrismaService>(PrismaService);
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
    });
  });

  describe('create', () => {
    it('should create a lesson successfully', async () => {
      const createDto = {
        title: 'New Lesson',
        track: 'A',
        stage: 1,
      };

      const mockLesson = { id: '123', ...createDto };

      jest.spyOn(prisma.lesson, 'create').mockResolvedValue(mockLesson);

      const result = await service.create(createDto);

      expect(result).toEqual(mockLesson);
      expect(prisma.lesson.create).toHaveBeenCalledWith({ data: createDto });
    });
  });
});
```

### 3. React Component Testing (Jest + React Testing Library)

```typescript
// ✅ GOOD - Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { LessonCard } from './LessonCard';
import { Lesson } from '@/types/lesson';

const mockLesson: Lesson = {
  id: '123',
  title: 'Test Lesson',
  titleArabic: 'درس تجريبي',
  track: 'A',
  stage: 1,
  difficulty: 'beginner',
  estimatedTime: 15,
};

describe('LessonCard', () => {
  it('renders lesson information correctly', () => {
    const onStart = jest.fn();

    render(<LessonCard lesson={mockLesson} onStart={onStart} />);

    expect(screen.getByText('Test Lesson')).toBeInTheDocument();
    expect(screen.getByText('درس تجريبي')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('calls onStart when Start Lesson button is clicked', () => {
    const onStart = jest.fn();

    render(<LessonCard lesson={mockLesson} onStart={onStart} />);

    const button = screen.getByRole('button', { name: /start lesson/i });
    fireEvent.click(button);

    expect(onStart).toHaveBeenCalledWith('123');
  });
});
```

### 4. Test Coverage Requirements

- **Minimum coverage**: 80% for all code
- **Critical paths**: 100% coverage (auth, payments, user data)
- **Run coverage**: `npm run test:coverage`

---

## Git Commit Standards

### 1. Conventional Commits

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature/bug change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, configs)
- `ci`: CI/CD changes

**Examples**:
```
feat(lessons): add filtering by difficulty level
fix(auth): resolve token refresh race condition
docs(api): update API documentation for lessons endpoint
refactor(grammar): extract grammar layer component
test(lessons): add unit tests for LessonService
chore(deps): upgrade Next.js to 14.1.0
```

### 2. Commit Message Body

```
feat(progress): add XP calculation for exercise completion

- Calculate XP based on accuracy and difficulty
- Update user progress in database
- Emit XP_EARNED event for achievements

Closes #123
```

---

## Code Review Checklist

### Before Submitting PR

- [ ] Code compiles with zero warnings (`npm run type-check`)
- [ ] All linting rules pass (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] All tests pass (`npm run test`)
- [ ] Test coverage meets minimum 80%
- [ ] No console.log or debugging code left
- [ ] No commented-out code
- [ ] All TypeScript types are explicit (no `any`)
- [ ] API endpoints documented (Swagger)
- [ ] README updated (if needed)

### Reviewer Checklist

- [ ] Code follows project standards
- [ ] Logic is correct and handles edge cases
- [ ] Error handling is adequate
- [ ] Performance is acceptable
- [ ] Security issues addressed
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] RTL support for Arabic text
- [ ] Tests are comprehensive
- [ ] Documentation is clear

---

## Security Best Practices

### 1. Authentication

```typescript
// ✅ GOOD - Hash passwords with bcrypt
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ❌ BAD - Never store plain text passwords
password: string; // NEVER DO THIS
```

### 2. SQL Injection Prevention

```typescript
// ✅ GOOD - Use Prisma (parameterized queries)
await prisma.user.findUnique({
  where: { email: userEmail },
});

// ❌ BAD - Raw SQL with string interpolation
await prisma.$queryRaw`SELECT * FROM users WHERE email = '${userEmail}'`; // VULNERABLE

// ✅ GOOD - If raw SQL needed, use parameterized queries
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;
```

### 3. XSS Prevention

```typescript
// ✅ GOOD - React escapes by default
<div>{userInput}</div>

// ❌ BAD - Dangerously setting HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD - If HTML needed, sanitize first
import DOMPurify from 'isomorphic-dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### 4. Environment Variables

```typescript
// ✅ GOOD - Use environment variables for secrets
const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_ACCESS_SECRET must be defined');
}

// ❌ BAD - Never hardcode secrets
const JWT_SECRET = 'my-secret-key'; // NEVER DO THIS
```

### 5. Rate Limiting

```typescript
// ✅ GOOD - Rate limiting for API endpoints
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // ...
}
```

---

## Performance Guidelines

### 1. Database Query Optimization

```typescript
// ✅ GOOD - Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
  },
});

// ❌ BAD - Select all fields
const users = await prisma.user.findMany();
```

### 2. Caching Strategy

```typescript
// ✅ GOOD - Cache expensive queries
async getLessons(track: string, stage: number) {
  const cacheKey = `lessons:${track}:${stage}`;

  const cached = await this.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const lessons = await this.prisma.lesson.findMany({
    where: { track, stage },
  });

  await this.cache.set(cacheKey, JSON.stringify(lessons), 300); // 5 minutes

  return lessons;
}
```

### 3. React Performance

```typescript
// ✅ GOOD - Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ GOOD - Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ GOOD - Memoize components
const MemoizedComponent = React.memo(Component);
```

### 4. Image Optimization

```typescript
// ✅ GOOD - Use Next.js Image component
import Image from 'next/image';

<Image
  src="/lesson-image.jpg"
  alt="Lesson illustration"
  width={600}
  height={400}
  loading="lazy"
  placeholder="blur"
/>

// ❌ BAD - Standard img tag
<img src="/lesson-image.jpg" alt="Lesson illustration" />
```

---

## Accessibility Standards

### 1. Semantic HTML

```typescript
// ✅ GOOD - Semantic HTML
<nav>
  <ul>
    <li><a href="/lessons">Lessons</a></li>
    <li><a href="/progress">Progress</a></li>
  </ul>
</nav>

<main>
  <h1>Lessons</h1>
  <article>
    <h2>Lesson Title</h2>
    <p>Lesson description</p>
  </article>
</main>

// ❌ BAD - Divs for everything
<div className="nav">
  <div className="link">Lessons</div>
  <div className="link">Progress</div>
</div>

<div className="main">
  <div className="heading">Lessons</div>
</div>
```

### 2. ARIA Labels

```typescript
// ✅ GOOD - ARIA labels for accessibility
<button
  onClick={handleBookmark}
  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
  aria-pressed={isBookmarked}
>
  <BookmarkIcon />
</button>

<input
  type="search"
  placeholder="Search lessons"
  aria-label="Search lessons"
/>
```

### 3. Keyboard Navigation

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

### 4. Color Contrast

**Ensure WCAG 2.1 AA compliance**:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Arabic/RTL-Specific Standards

### 1. RTL Support

```typescript
// ✅ GOOD - RTL support
<div dir="rtl" lang="ar">
  <p className="text-arabic">{arabicText}</p>
</div>

<div dir="ltr" lang="en">
  <p>{englishText}</p>
</div>
```

### 2. Arabic Text Display

```typescript
// ✅ GOOD - Preserve diacritics
<span className="arabic-with-diacritics" style={{ fontFamily: 'Amiri' }}>
  {textWithDiacritics}
</span>

// ✅ GOOD - Separate fields for with/without diacritics
interface Verse {
  textArabic: string; // With diacritics
  textWithoutDiacritics: string; // For search
}
```

### 3. Font Loading

```typescript
// ✅ GOOD - Load Arabic fonts
// app/layout.tsx
import { Amiri } from 'next/font/google';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={amiri.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 4. Bidirectional Text

```typescript
// ✅ GOOD - Handle mixed LTR/RTL
<p dir="auto">{mixedText}</p> {/* Auto-detect direction */}

// ✅ GOOD - Explicit direction for clarity
<p dir="rtl">
  {arabicText} <span dir="ltr">{englishWord}</span> {moreArabicText}
</p>
```

---

## Error Handling

### 1. Backend Error Handling

```typescript
// ✅ GOOD - Comprehensive error handling
try {
  const lesson = await this.prisma.lesson.findUnique({
    where: { id },
  });

  if (!lesson) {
    throw new NotFoundException(`Lesson with ID ${id} not found`);
  }

  return lesson;
} catch (error) {
  if (error instanceof NotFoundException) {
    throw error; // Re-throw known errors
  }

  this.logger.error(`Failed to find lesson: ${error.message}`, error.stack);
  throw new InternalServerErrorException('Failed to retrieve lesson');
}
```

### 2. Frontend Error Handling

```typescript
// ✅ GOOD - User-friendly error messages
try {
  await loginUser(email, password);
  router.push('/dashboard');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      setError('Invalid email or password');
    } else if (error.statusCode === 429) {
      setError('Too many login attempts. Please try again later.');
    } else {
      setError('An error occurred. Please try again.');
    }
  } else {
    setError('Network error. Please check your connection.');
  }
}
```

### 3. Error Boundaries (React)

```typescript
// ✅ GOOD - Error boundary component
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Configuration and Environment

### 1. Environment Variables

```env
# .env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/arq_dev

# JWT
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# API
API_PORT=3001
API_BASE_URL=http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Config Service (NestJS)

```typescript
// ✅ GOOD - Centralized configuration
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.getOrThrow('DATABASE_URL');
  }

  get jwtAccessSecret(): string {
    return this.getOrThrow('JWT_ACCESS_SECRET');
  }

  get jwtAccessExpiration(): string {
    return this.configService.get('JWT_ACCESS_EXPIRATION', '15m');
  }

  private getOrThrow(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Configuration key ${key} is not defined`);
    }
    return value;
  }
}
```

---

## ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      { "allowExpressions": true }
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index"
        ],
        "newlines-between": "always"
      }
    ],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

## Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Summary

**Key Takeaways**:

1. **Type Safety First**: Use strict TypeScript, explicit types, no `any`
2. **Zero Warnings**: No compiler warnings, no linting warnings
3. **Test Coverage**: Minimum 80% coverage, 100% for critical paths
4. **Performance**: Cache expensive queries, optimize images, memoize React components
5. **Security**: Hash passwords, prevent SQL injection, sanitize HTML, use environment variables
6. **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, ARIA labels, keyboard navigation
7. **RTL Support**: Proper Arabic text handling, font loading, bidirectional text
8. **Conventional Commits**: Follow `<type>(<scope>): <subject>` format
9. **Code Review**: Use checklist before submitting PR
10. **Documentation**: TSDoc comments, clear README, API documentation

---

**Last Updated**: 2025-11-03
**Maintained By**: Solution Architect + Backend Lead + Frontend Lead

**Questions?** See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for setup instructions or [SOLUTION_ARCHITECTURE.md](./SOLUTION_ARCHITECTURE.md) for architecture decisions.
