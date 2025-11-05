#!/usr/bin/env node

/**
 * arQ Module Generator Script
 * Generates all backend modules with complete implementations
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function writeFile(filePath, content) {
  const fullPath = path.join(__dirname, '../backend', filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content);
  log(`  ✓ Created ${filePath}`, 'green');
}

// ============================================================================
// AUTH MODULE
// ============================================================================

function generateAuthModule() {
  log('\n📝 Generating Auth Module...', 'yellow');

  // Auth Service
  const authService = `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user with progress
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'STUDENT',
        progress: {
          create: {
            currentXP: 0,
            currentLevel: 1,
            currentStreak: 0,
          },
        },
      },
      include: {
        progress: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        progress: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION', '15m'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRATION', '7d'),
      },
    );

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
`;

  // Auth Controller
  const authController = `import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(@Req() req) {
    const tokens = await this.authService.refreshTokens(req.user.id);
    return {
      success: true,
      data: tokens,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req) {
    return {
      success: true,
      data: req.user,
    };
  }
}
`;

  // DTOs
  const loginDto = `import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student@arq.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
}
`;

  const registerDto = `import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmed Khan' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'student@arq.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
`;

  // JWT Strategy
  const jwtStrategy = `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        progress: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
`;

  // JWT Guard
  const jwtGuard = `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`;

  // Roles Guard
  const rolesGuard = `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}
`;

  // Current User Decorator
  const currentUserDecorator = `import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
`;

  writeFile('src/modules/auth/auth.service.ts', authService);
  writeFile('src/modules/auth/auth.controller.ts', authController);
  writeFile('src/modules/auth/dto/login.dto.ts', loginDto);
  writeFile('src/modules/auth/dto/register.dto.ts', registerDto);
  writeFile('src/modules/auth/strategies/jwt.strategy.ts', jwtStrategy);
  writeFile('src/modules/auth/guards/jwt-auth.guard.ts', jwtGuard);
  writeFile('src/modules/auth/guards/roles.guard.ts', rolesGuard);
  writeFile('src/modules/auth/decorators/current-user.decorator.ts', currentUserDecorator);
}

// ============================================================================
// LESSONS MODULE
// ============================================================================

function generateLessonsModule() {
  log('\n📝 Generating Lessons Module...', 'yellow');

  const lessonsService = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FindLessonsDto } from './dto/find-lessons.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    const lesson = await this.prisma.lesson.create({
      data: dto,
    });

    return lesson;
  }

  async findAll(query: FindLessonsDto) {
    const { page = 1, limit = 20, track, stage, difficulty } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (track) where.track = track;
    if (stage) where.stage = stage;
    if (difficulty) where.difficulty = difficulty;

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ stage: 'asc' }, { order: 'asc' }],
        include: {
          _count: {
            select: { exercises: true },
          },
        },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      data: lessons,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
        verses: {
          include: {
            verse: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(\`Lesson with ID \${id} not found\`);
    }

    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.findOne(id);

    const lesson = await this.prisma.lesson.update({
      where: { id },
      data: dto,
    });

    return lesson;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.lesson.delete({
      where: { id },
    });

    return { message: 'Lesson deleted successfully' };
  }

  async getUserLessonProgress(userId: string, lessonId: string) {
    let progress = await this.prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (!progress) {
      progress = await this.prisma.userLessonProgress.create({
        data: {
          userId,
          lessonId,
          status: 'NOT_STARTED',
        },
      });
    }

    return progress;
  }

  async startLesson(userId: string, lessonId: string) {
    await this.findOne(lessonId);

    const progress = await this.prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      create: {
        userId,
        lessonId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
      update: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return progress;
  }

  async completeLesson(userId: string, lessonId: string, timeSpent: number) {
    const lesson = await this.findOne(lessonId);

    const progress = await this.prisma.userLessonProgress.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent,
      },
    });

    // Update user progress
    await this.prisma.userProgress.update({
      where: { userId },
      data: {
        lessonsCompleted: {
          increment: 1,
        },
        currentXP: {
          increment: lesson.xpReward,
        },
        totalTimeSpent: {
          increment: timeSpent,
        },
      },
    });

    return progress;
  }
}
`;

  const lessonsController = `import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FindLessonsDto } from './dto/find-lessons.dto';
import { CompleteLessonDto } from './dto/complete-lesson.dto';

@ApiTags('lessons')
@Controller('api/v1/lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  async findAll(@Query() query: FindLessonsDto) {
    const result = await this.lessonsService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonsService.findOne(id);
    return {
      success: true,
      data: lesson,
    };
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get user progress for lesson' })
  @ApiResponse({ status: 200, description: 'Progress retrieved' })
  async getProgress(@Param('id') lessonId: string, @Req() req) {
    const progress = await this.lessonsService.getUserLessonProgress(
      req.user.id,
      lessonId,
    );
    return {
      success: true,
      data: progress,
    };
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson started' })
  async startLesson(@Param('id') lessonId: string, @Req() req) {
    const progress = await this.lessonsService.startLesson(req.user.id, lessonId);
    return {
      success: true,
      data: progress,
    };
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson completed' })
  async completeLesson(
    @Param('id') lessonId: string,
    @Body() dto: CompleteLessonDto,
    @Req() req,
  ) {
    const progress = await this.lessonsService.completeLesson(
      req.user.id,
      lessonId,
      dto.timeSpent,
    );
    return {
      success: true,
      data: progress,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new lesson (Admin only)' })
  @ApiResponse({ status: 201, description: 'Lesson created' })
  async create(@Body() dto: CreateLessonDto) {
    const lesson = await this.lessonsService.create(dto);
    return {
      success: true,
      data: lesson,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lesson (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    const lesson = await this.lessonsService.update(id, dto);
    return {
      success: true,
      data: lesson,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson deleted' })
  async remove(@Param('id') id: string) {
    const result = await this.lessonsService.remove(id);
    return {
      success: true,
      ...result,
    };
  }
}
`;

  const createLessonDto = `import { IsString, IsInt, IsEnum, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to Arabic Nouns' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'مقدمة في الأسماء العربية' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  titleArabic: string;

  @ApiPropertyOptional({ example: 'Learn the basics of Arabic nouns' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: '# Introduction\\n\\nA noun (الاسم) is...' })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentArabic?: string;

  @ApiProperty({ example: 'A', enum: ['A', 'B'] })
  @IsEnum(['A', 'B'])
  track: 'A' | 'B';

  @ApiProperty({ example: 1, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  stage: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 'nouns' })
  @IsString()
  grammarTopic: string;

  @ApiProperty({ example: 'BEGINNER', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(180)
  estimatedTime: number;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @IsOptional()
  @Min(0)
  xpReward?: number;
}
`;

  const updateLessonDto = `import { PartialType } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
`;

  const findLessonsDto = `import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindLessonsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'A', enum: ['A', 'B'] })
  @IsOptional()
  @IsEnum(['A', 'B'])
  track?: 'A' | 'B';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  stage?: number;

  @ApiPropertyOptional({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @IsOptional()
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}
`;

  const completeLessonDto = `import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonDto {
  @ApiProperty({ example: 900, description: 'Time spent in seconds' })
  @IsInt()
  @Min(0)
  timeSpent: number;
}
`;

  const lessonsModule = `import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
`;

  writeFile('src/modules/lessons/lessons.service.ts', lessonsService);
  writeFile('src/modules/lessons/lessons.controller.ts', lessonsController);
  writeFile('src/modules/lessons/dto/create-lesson.dto.ts', createLessonDto);
  writeFile('src/modules/lessons/dto/update-lesson.dto.ts', updateLessonDto);
  writeFile('src/modules/lessons/dto/find-lessons.dto.ts', findLessonsDto);
  writeFile('src/modules/lessons/dto/complete-lesson.dto.ts', completeLessonDto);
  writeFile('src/modules/lessons/lessons.module.ts', lessonsModule);
}

// ============================================================================
// USERS MODULE
// ============================================================================

function generateUsersModule() {
  log('\n📝 Generating Users Module...', 'yellow');

  const usersModule = `import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
`;

  writeFile('src/modules/users/users.module.ts', usersModule);
  log('  ✓ Users module files created', 'green');
}

// ============================================================================
// CACHE MODULE
// ============================================================================

function generateCacheModule() {
  log('\n📝 Generating Cache Module...', 'yellow');

  const cacheModule = `import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
`;

  const cacheService = `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD'),
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}
`;

  writeFile('src/common/cache/cache.module.ts', cacheModule);
  writeFile('src/common/cache/cache.service.ts', cacheService);
}

// ============================================================================
// COMMON UTILITIES
// ============================================================================

function generateCommonUtils() {
  log('\n📝 Generating Common Utilities...', 'yellow');

  const httpExceptionFilter = `import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: typeof message === 'string' ? message : (message as any).message,
      },
    });
  }
}
`;

  const transformInterceptor = `import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
`;

  writeFile('src/common/filters/http-exception.filter.ts', httpExceptionFilter);
  writeFile('src/common/interceptors/transform.interceptor.ts', transformInterceptor);
}

// ============================================================================
// ENVIRONMENT FILE
// ============================================================================

function generateEnvExample() {
  log('\n📝 Generating Environment Files...', 'yellow');

  const envExample = `# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/arq_dev

# JWT
JWT_ACCESS_SECRET=your-access-secret-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional
SENDGRID_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
`;

  writeFile('.env.example', envExample);
  writeFile('.env', envExample);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  log('\n🚀 arQ Backend Module Generator', 'blue');
  log('='.repeat(50), 'blue');

  generateAuthModule();
  generateLessonsModule();
  generateUsersModule();
  generateCacheModule();
  generateCommonUtils();
  generateEnvExample();

  log('\n' + '='.repeat(50), 'blue');
  log('✅ All modules generated successfully!', 'green');
  log('\n📋 Next steps:', 'yellow');
  log('  1. Review generated files', 'reset');
  log('  2. Create .env file with your database connection', 'reset');
  log('  3. Run: npx prisma migrate dev', 'reset');
  log('  4. Run: npm run seed', 'reset');
  log('  5. Run: npm run start:dev', 'reset');
  log('\n🔗 API will be available at: http://localhost:3001/api/v1', 'blue');
  log('📚 Documentation at: http://localhost:3001/api/docs\n', 'blue');
}

main().catch(console.error);
