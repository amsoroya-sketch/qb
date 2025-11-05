#!/usr/bin/env node

/**
 * arQ Backend - Remaining Modules Generator
 * Generates: Exercises, Progress, Verses, Analytics, Achievements modules
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'backend', 'src', 'modules');

// ============================================
// EXERCISES MODULE
// ============================================

const exercisesModule = {
  'exercises.module.ts': `import { Module } from '@nestjs/common';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
`,

  'exercises.service.ts': `import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FindExercisesDto, SubmitExerciseDto, ExerciseAttemptDto } from './dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindExercisesDto) {
    const { page = 1, limit = 50, lessonId, type, difficulty } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (lessonId) where.lessonId = lessonId;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const [exercises, total] = await Promise.all([
      this.prisma.exercise.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              titleArabic: true,
              track: true,
              stage: true,
            },
          },
        },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return {
      data: exercises,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            titleArabic: true,
            track: true,
            stage: true,
            difficulty: true,
          },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(\`Exercise with ID \${id} not found\`);
    }

    return exercise;
  }

  async findByLesson(lessonId: string) {
    const exercises = await this.prisma.exercise.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });

    return exercises;
  }

  async submit(userId: string, exerciseId: string, dto: SubmitExerciseDto) {
    const exercise = await this.findOne(exerciseId);

    // Check if correct
    const isCorrect = this.checkAnswer(exercise, dto.userAnswer);

    // Calculate XP earned
    const xpEarned = isCorrect ? exercise.xpReward : 0;

    // Calculate time bonus (if completed quickly)
    const timeBonus = dto.timeSpent < 30 && isCorrect ? Math.floor(exercise.xpReward * 0.2) : 0;
    const totalXP = xpEarned + timeBonus;

    // Create user exercise record
    const userExercise = await this.prisma.userExercise.create({
      data: {
        userId,
        exerciseId,
        userAnswer: dto.userAnswer,
        isCorrect,
        attempts: 1,
        timeSpent: dto.timeSpent,
        xpEarned: totalXP,
      },
    });

    // Update user progress
    if (isCorrect) {
      await this.prisma.userProgress.update({
        where: { userId },
        data: {
          exercisesCompleted: { increment: 1 },
          currentXP: { increment: totalXP },
          totalTimeSpent: { increment: dto.timeSpent },
        },
      });
    }

    return {
      ...userExercise,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      isCorrect,
      xpEarned: totalXP,
      timeBonus,
    };
  }

  async getUserExercises(userId: string, exerciseId: string) {
    const attempts = await this.prisma.userExercise.findMany({
      where: {
        userId,
        exerciseId,
      },
      orderBy: { attemptedAt: 'desc' },
    });

    return attempts;
  }

  async getExerciseStats(exerciseId: string) {
    const attempts = await this.prisma.userExercise.findMany({
      where: { exerciseId },
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const avgTimeSpent =
      totalAttempts > 0
        ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts
        : 0;

    return {
      totalAttempts,
      correctAttempts,
      accuracy: Math.round(accuracy * 10) / 10,
      avgTimeSpent: Math.round(avgTimeSpent),
    };
  }

  private checkAnswer(exercise: any, userAnswer: string): boolean {
    const correct = exercise.correctAnswer.trim().toLowerCase();
    const user = userAnswer.trim().toLowerCase();

    // For multiple choice, exact match
    if (exercise.type === 'MULTIPLE_CHOICE') {
      return correct === user;
    }

    // For true/false, exact match
    if (exercise.type === 'TRUE_FALSE') {
      return correct === user;
    }

    // For fill in blank, flexible matching
    if (exercise.type === 'FILL_IN_BLANK') {
      // Remove diacritics for Arabic comparison
      const normalizedCorrect = this.normalizArabic(correct);
      const normalizedUser = this.normalizArabic(user);
      return normalizedCorrect === normalizedUser;
    }

    // For word analysis, check JSON fields
    if (exercise.type === 'WORD_ANALYSIS') {
      try {
        const correctObj = JSON.parse(exercise.correctAnswer);
        const userObj = JSON.parse(userAnswer);

        // Check all required fields match
        return (
          correctObj.pos === userObj.pos &&
          correctObj.gender === userObj.gender &&
          correctObj.number === userObj.number &&
          correctObj.definiteness === userObj.definiteness &&
          correctObj.case === userObj.case
        );
      } catch (e) {
        return false;
      }
    }

    return correct === user;
  }

  private normalizArabic(text: string): string {
    // Remove common Arabic diacritics
    return text
      .replace(/[\u064B-\u0652]/g, '') // Remove tashkeel
      .replace(/[أإآ]/g, 'ا') // Normalize alef
      .replace(/ة/g, 'ه') // Normalize taa marboota
      .trim();
  }
}
`,

  'exercises.controller.ts': `import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FindExercisesDto, SubmitExerciseDto } from './dto';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exercises with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated exercises' })
  async findAll(@Query() query: FindExercisesDto) {
    return this.exercisesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single exercise by ID' })
  @ApiResponse({ status: 200, description: 'Returns exercise details' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all exercises for a lesson' })
  @ApiResponse({ status: 200, description: 'Returns exercises for lesson' })
  async findByLesson(@Param('lessonId') lessonId: string) {
    return this.exercisesService.findByLesson(lessonId);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit exercise answer' })
  @ApiResponse({ status: 200, description: 'Exercise submitted and graded' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async submit(
    @Param('id') exerciseId: string,
    @Body() dto: SubmitExerciseDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.exercisesService.submit(userId, exerciseId, dto);
  }

  @Get(':id/attempts')
  @ApiOperation({ summary: 'Get user attempts for an exercise' })
  @ApiResponse({ status: 200, description: 'Returns user exercise attempts' })
  async getUserAttempts(
    @Param('id') exerciseId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.exercisesService.getUserExercises(userId, exerciseId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get exercise statistics' })
  @ApiResponse({ status: 200, description: 'Returns exercise statistics' })
  async getStats(@Param('id') exerciseId: string) {
    return this.exercisesService.getExerciseStats(exerciseId);
  }
}
`,

  'dto/index.ts': `export * from './find-exercises.dto';
export * from './submit-exercise.dto';
export * from './exercise-attempt.dto';
`,

  'dto/find-exercises.dto.ts': `import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindExercisesDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 50, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'WORD_ANALYSIS', 'DRAG_DROP', 'MATCHING'] })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @IsOptional()
  @IsString()
  difficulty?: string;
}
`,

  'dto/submit-exercise.dto.ts': `import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitExerciseDto {
  @ApiProperty({ example: 'الكتاب' })
  @IsString()
  userAnswer: string;

  @ApiProperty({ example: 45, description: 'Time spent in seconds' })
  @IsInt()
  @Min(1)
  timeSpent: number;
}
`,

  'dto/exercise-attempt.dto.ts': `export class ExerciseAttemptDto {
  id: string;
  exerciseId: string;
  userId: string;
  userAnswer: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  xpEarned: number;
  attemptedAt: Date;
}
`,
};

// ============================================
// PROGRESS MODULE
// ============================================

const progressModule = {
  'progress.module.ts': `import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
`,

  'progress.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStreakDto, UserProgressResponseDto } from './dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string): Promise<UserProgressResponseDto> {
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new NotFoundException('User progress not found');
    }

    // Calculate level progress
    const xpForNextLevel = this.calculateXPForLevel(progress.currentLevel + 1);
    const xpForCurrentLevel = this.calculateXPForLevel(progress.currentLevel);
    const xpInCurrentLevel = progress.currentXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const levelProgressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    return {
      ...progress,
      xpForNextLevel,
      xpNeededForNextLevel,
      levelProgressPercentage: Math.round(levelProgressPercentage * 10) / 10,
    };
  }

  async addXP(userId: string, xpToAdd: number) {
    const currentProgress = await this.getUserProgress(userId);
    const newXP = currentProgress.currentXP + xpToAdd;

    // Check if level up
    const newLevel = this.calculateLevelFromXP(newXP);
    const leveledUp = newLevel > currentProgress.currentLevel;

    const updatedProgress = await this.prisma.userProgress.update({
      where: { userId },
      data: {
        currentXP: newXP,
        currentLevel: newLevel,
      },
    });

    return {
      ...updatedProgress,
      leveledUp,
      previousLevel: currentProgress.currentLevel,
      xpAdded: xpToAdd,
    };
  }

  async updateStreak(userId: string) {
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new NotFoundException('User progress not found');
    }

    const now = new Date();
    const lastActive = progress.lastActiveDate;
    const daysDiff = this.getDaysDifference(lastActive, now);

    let newStreak = progress.currentStreak;
    let longestStreak = progress.longestStreak;

    if (daysDiff === 0) {
      // Same day, don't change streak
      return progress;
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreak += 1;
      longestStreak = Math.max(longestStreak, newStreak);
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    return this.prisma.userProgress.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: now,
      },
    });
  }

  async getLessonProgress(userId: string) {
    const lessonProgress = await this.prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            titleArabic: true,
            track: true,
            stage: true,
            difficulty: true,
            xpReward: true,
          },
        },
      },
      orderBy: [
        { lesson: { track: 'asc' } },
        { lesson: { stage: 'asc' } },
        { lesson: { order: 'asc' } },
      ],
    });

    return lessonProgress;
  }

  async getAchievementProgress(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const allAchievements = await this.prisma.achievement.findMany({
      orderBy: { xpReward: 'asc' },
    });

    const unlocked = userAchievements.map((ua) => ua.achievement);
    const locked = allAchievements.filter(
      (a) => !unlocked.find((u) => u.id === a.id),
    );

    return {
      unlocked,
      locked,
      totalUnlocked: unlocked.length,
      totalAchievements: allAchievements.length,
      completionPercentage: (unlocked.length / allAchievements.length) * 100,
    };
  }

  async getDashboardStats(userId: string) {
    const [progress, lessonProgress, exerciseAttempts, achievements] = await Promise.all([
      this.getUserProgress(userId),
      this.prisma.userLessonProgress.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.userExercise.count({ where: { userId, isCorrect: true } }),
      this.prisma.userAchievement.count({ where: { userId } }),
    ]);

    // Get recent activity
    const recentLessons = await this.prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: { title: true, titleArabic: true, track: true },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
    });

    // Calculate accuracy
    const totalExercises = await this.prisma.userExercise.count({ where: { userId } });
    const correctExercises = await this.prisma.userExercise.count({
      where: { userId, isCorrect: true },
    });
    const accuracy = totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;

    return {
      currentLevel: progress.currentLevel,
      currentXP: progress.currentXP,
      xpForNextLevel: progress.xpForNextLevel,
      levelProgress: progress.levelProgressPercentage,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lessonsCompleted: lessonProgress,
      exercisesCompleted: correctExercises,
      achievementsUnlocked: achievements,
      accuracy: Math.round(accuracy * 10) / 10,
      totalTimeSpent: progress.totalTimeSpent,
      recentActivity: recentLessons,
    };
  }

  // Helper methods
  private calculateXPForLevel(level: number): number {
    // XP curve: level * 100 * 1.5^(level-1)
    // Level 1: 0 XP
    // Level 2: 100 XP
    // Level 3: 250 XP
    // Level 4: 475 XP
    // Level 5: 812 XP
    if (level === 1) return 0;
    return Math.floor(100 * level * Math.pow(1.5, level - 2));
  }

  private calculateLevelFromXP(xp: number): number {
    let level = 1;
    while (this.calculateXPForLevel(level + 1) <= xp) {
      level++;
    }
    return level;
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs((date1.getTime() - date2.getTime()) / oneDay),
    );
    return diffDays;
  }
}
`,

  'progress.controller.ts': `import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user progress' })
  @ApiResponse({ status: 200, description: 'Returns user progress' })
  async getMyProgress(@CurrentUser('sub') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get('me/dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard stats' })
  async getDashboard(@CurrentUser('sub') userId: string) {
    return this.progressService.getDashboardStats(userId);
  }

  @Get('me/lessons')
  @ApiOperation({ summary: 'Get lesson progress for current user' })
  @ApiResponse({ status: 200, description: 'Returns lesson progress' })
  async getMyLessonProgress(@CurrentUser('sub') userId: string) {
    return this.progressService.getLessonProgress(userId);
  }

  @Get('me/achievements')
  @ApiOperation({ summary: 'Get achievement progress for current user' })
  @ApiResponse({ status: 200, description: 'Returns achievements' })
  async getMyAchievements(@CurrentUser('sub') userId: string) {
    return this.progressService.getAchievementProgress(userId);
  }

  @Post('me/streak')
  @ApiOperation({ summary: 'Update user streak (called on daily login)' })
  @ApiResponse({ status: 200, description: 'Streak updated' })
  async updateMyStreak(@CurrentUser('sub') userId: string) {
    return this.progressService.updateStreak(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get progress for specific user (admin)' })
  @ApiResponse({ status: 200, description: 'Returns user progress' })
  async getUserProgress(@Param('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }
}
`,

  'dto/index.ts': `export * from './user-progress-response.dto';
export * from './update-streak.dto';
`,

  'dto/user-progress-response.dto.ts': `export class UserProgressResponseDto {
  id: string;
  userId: string;
  currentXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  lessonsCompleted: number;
  exercisesCompleted: number;
  totalTimeSpent: number;
  averageAccuracy: number;
  xpForNextLevel: number;
  xpNeededForNextLevel: number;
  levelProgressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}
`,

  'dto/update-streak.dto.ts': `export class UpdateStreakDto {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
}
`,
};

// ============================================
// VERSES MODULE
// ============================================

const versesModule = {
  'verses.module.ts': `import { Module } from '@nestjs/common';
import { VersesController } from './verses.controller';
import { VersesService } from './verses.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VersesController],
  providers: [VersesService],
  exports: [VersesService],
})
export class VersesModule {}
`,

  'verses.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FindVersesDto, SearchVersesDto } from './dto';

@Injectable()
export class VersesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindVersesDto) {
    const { page = 1, limit = 20, surahNumber } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (surahNumber) where.surahNumber = surahNumber;

    const [verses, total] = await Promise.all([
      this.prisma.quranVerse.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
        include: {
          words: {
            orderBy: { wordPosition: 'asc' },
          },
        },
      }),
      this.prisma.quranVerse.count({ where }),
    ]);

    return {
      data: verses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(surahNumber: number, verseNumber: number) {
    const verse = await this.prisma.quranVerse.findUnique({
      where: {
        surahNumber_verseNumber: {
          surahNumber,
          verseNumber,
        },
      },
      include: {
        words: {
          orderBy: { wordPosition: 'asc' },
        },
      },
    });

    if (!verse) {
      throw new NotFoundException(\`Verse \${surahNumber}:\${verseNumber} not found\`);
    }

    return verse;
  }

  async getWordAnalysis(wordId: string) {
    const word = await this.prisma.verseWord.findUnique({
      where: { id: wordId },
      include: {
        verse: {
          select: {
            surahNumber: true,
            verseNumber: true,
            textArabic: true,
          },
        },
      },
    });

    if (!word) {
      throw new NotFoundException(\`Word with ID \${wordId} not found\`);
    }

    return {
      ...word,
      grammaticalAnalysis: {
        partOfSpeech: word.posType,
        gender: word.gender,
        number: word.number,
        definiteness: word.definiteness,
        case: word.irabCase,
        caseSign: word.caseSign,
        structure: word.structureType,
      },
    };
  }

  async search(dto: SearchVersesDto) {
    const { query, searchType = 'text', page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (searchType === 'text') {
      // Search in Arabic text or translation
      where = {
        OR: [
          { textArabic: { contains: query, mode: 'insensitive' } },
          { translation: { contains: query, mode: 'insensitive' } },
          { transliteration: { contains: query, mode: 'insensitive' } },
        ],
      };
    } else if (searchType === 'root') {
      // Search by Arabic root
      where = {
        words: {
          some: {
            root: { equals: query },
          },
        },
      };
    }

    const [verses, total] = await Promise.all([
      this.prisma.quranVerse.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
        include: {
          words: {
            where: searchType === 'root' ? { root: query } : undefined,
            orderBy: { wordPosition: 'asc' },
          },
        },
      }),
      this.prisma.quranVerse.count({ where }),
    ]);

    return {
      data: verses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        query,
        searchType,
      },
    };
  }

  async getVersesByGrammar(posType?: string, irabCase?: string) {
    const where: any = {};

    if (posType || irabCase) {
      where.words = {
        some: {
          ...(posType && { posType }),
          ...(irabCase && { irabCase }),
        },
      };
    }

    const verses = await this.prisma.quranVerse.findMany({
      where,
      take: 50,
      include: {
        words: {
          where: {
            ...(posType && { posType }),
            ...(irabCase && { irabCase }),
          },
          orderBy: { wordPosition: 'asc' },
        },
      },
      orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
    });

    return verses;
  }

  async createBookmark(userId: string, surahNumber: number, verseNumber: number) {
    const verse = await this.findOne(surahNumber, verseNumber);

    const bookmark = await this.prisma.verseBookmark.create({
      data: {
        userId,
        verseId: verse.id,
      },
    });

    return bookmark;
  }

  async removeBookmark(userId: string, surahNumber: number, verseNumber: number) {
    const verse = await this.findOne(surahNumber, verseNumber);

    await this.prisma.verseBookmark.deleteMany({
      where: {
        userId,
        verseId: verse.id,
      },
    });

    return { message: 'Bookmark removed successfully' };
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.prisma.verseBookmark.findMany({
      where: { userId },
      include: {
        verse: {
          include: {
            words: {
              orderBy: { wordPosition: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookmarks.map((b) => b.verse);
  }
}
`,

  'verses.controller.ts': `import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VersesService } from './verses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FindVersesDto, SearchVersesDto } from './dto';

@ApiTags('verses')
@Controller('verses')
export class VersesController {
  constructor(private readonly versesService: VersesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all verses with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated verses' })
  async findAll(@Query() query: FindVersesDto) {
    return this.versesService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search verses by text or root' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(@Query() dto: SearchVersesDto) {
    return this.versesService.search(dto);
  }

  @Get('grammar')
  @ApiOperation({ summary: 'Find verses by grammatical properties' })
  @ApiResponse({ status: 200, description: 'Returns verses matching criteria' })
  async findByGrammar(
    @Query('posType') posType?: string,
    @Query('irabCase') irabCase?: string,
  ) {
    return this.versesService.getVersesByGrammar(posType, irabCase);
  }

  @Get(':surahNumber/:verseNumber')
  @ApiOperation({ summary: 'Get single verse with word analysis' })
  @ApiResponse({ status: 200, description: 'Returns verse details' })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  async findOne(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
  ) {
    return this.versesService.findOne(surahNumber, verseNumber);
  }

  @Get('words/:wordId')
  @ApiOperation({ summary: 'Get detailed word analysis' })
  @ApiResponse({ status: 200, description: 'Returns word grammatical analysis' })
  @ApiResponse({ status: 404, description: 'Word not found' })
  async getWordAnalysis(@Param('wordId') wordId: string) {
    return this.versesService.getWordAnalysis(wordId);
  }

  @Post(':surahNumber/:verseNumber/bookmark')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bookmark a verse' })
  @ApiResponse({ status: 201, description: 'Verse bookmarked' })
  async createBookmark(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
    @CurrentUser('sub') userId: string,
  ) {
    return this.versesService.createBookmark(userId, surahNumber, verseNumber);
  }

  @Delete(':surahNumber/:verseNumber/bookmark')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove verse bookmark' })
  @ApiResponse({ status: 200, description: 'Bookmark removed' })
  async removeBookmark(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
    @CurrentUser('sub') userId: string,
  ) {
    return this.versesService.removeBookmark(userId, surahNumber, verseNumber);
  }

  @Get('bookmarks/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user bookmarked verses' })
  @ApiResponse({ status: 200, description: 'Returns bookmarked verses' })
  async getMyBookmarks(@CurrentUser('sub') userId: string) {
    return this.versesService.getUserBookmarks(userId);
  }
}
`,

  'dto/index.ts': `export * from './find-verses.dto';
export * from './search-verses.dto';
`,

  'dto/find-verses.dto.ts': `import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindVersesDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filter by surah number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  surahNumber?: number;
}
`,

  'dto/search-verses.dto.ts': `import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVersesDto {
  @ApiProperty({ example: 'الرحمن' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ enum: ['text', 'root'], default: 'text' })
  @IsOptional()
  @IsEnum(['text', 'root'])
  searchType?: 'text' | 'root';

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
`,
};

// ============================================
// ACHIEVEMENTS MODULE
// ============================================

const achievementsModule = {
  'achievements.module.ts': `import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
`,

  'achievements.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const achievements = await this.prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { xpReward: 'asc' }],
    });

    return achievements;
  }

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException(\`Achievement with ID \${id} not found\`);
    }

    return achievement;
  }

  async getUserAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return userAchievements;
  }

  async checkAndUnlockAchievements(userId: string) {
    // Get user progress
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      return [];
    }

    // Get all achievements not yet unlocked
    const unlockedIds = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });

    const unlockedIdSet = new Set(unlockedIds.map((ua) => ua.achievementId));

    const allAchievements = await this.prisma.achievement.findMany();
    const lockedAchievements = allAchievements.filter(
      (a) => !unlockedIdSet.has(a.id),
    );

    // Check each locked achievement
    const newlyUnlocked = [];

    for (const achievement of lockedAchievements) {
      const requirement = JSON.parse(achievement.requirement);

      if (this.checkRequirement(progress, requirement)) {
        // Unlock achievement
        const userAchievement = await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        // Award XP
        await this.prisma.userProgress.update({
          where: { userId },
          data: {
            currentXP: { increment: achievement.xpReward },
          },
        });

        newlyUnlocked.push({
          ...userAchievement,
          achievement,
        });
      }
    }

    return newlyUnlocked;
  }

  private checkRequirement(progress: any, requirement: any): boolean {
    switch (requirement.type) {
      case 'lessons_completed':
        return progress.lessonsCompleted >= requirement.count;

      case 'exercises_completed':
        return progress.exercisesCompleted >= requirement.count;

      case 'streak':
        return progress.currentStreak >= requirement.count;

      case 'level':
        return progress.currentLevel >= requirement.level;

      case 'xp':
        return progress.currentXP >= requirement.xp;

      case 'time_spent':
        const hoursSpent = progress.totalTimeSpent / 3600;
        return hoursSpent >= requirement.hours;

      case 'accuracy':
        return progress.averageAccuracy >= requirement.value;

      default:
        return false;
    }
  }

  async getAchievementStats() {
    const totalAchievements = await this.prisma.achievement.count();
    const totalUnlocked = await this.prisma.userAchievement.count();

    const topAchievers = await this.prisma.user.findMany({
      include: {
        _count: {
          select: { achievements: true },
        },
        achievements: {
          include: { achievement: true },
        },
      },
      orderBy: {
        achievements: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const rarest = await this.prisma.achievement.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: {
        users: {
          _count: 'asc',
        },
      },
      take: 10,
    });

    return {
      totalAchievements,
      totalUnlocked,
      topAchievers: topAchievers.map((user) => ({
        userId: user.id,
        name: user.name,
        achievementsCount: user._count.achievements,
      })),
      rarestAchievements: rarest.map((a) => ({
        ...a,
        unlockedBy: a._count.users,
      })),
    };
  }
}
`,

  'achievements.controller.ts': `import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiResponse({ status: 200, description: 'Returns all achievements' })
  async findAll() {
    return this.achievementsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get achievement statistics' })
  @ApiResponse({ status: 200, description: 'Returns achievement stats' })
  async getStats() {
    return this.achievementsService.getAchievementStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single achievement' })
  @ApiResponse({ status: 200, description: 'Returns achievement details' })
  @ApiResponse({ status: 404, description: 'Achievement not found' })
  async findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Get('me/unlocked')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user unlocked achievements' })
  @ApiResponse({ status: 200, description: 'Returns user achievements' })
  async getMyAchievements(@CurrentUser('sub') userId: string) {
    return this.achievementsService.getUserAchievements(userId);
  }

  @Post('me/check')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check and unlock new achievements' })
  @ApiResponse({ status: 200, description: 'Returns newly unlocked achievements' })
  async checkAchievements(@CurrentUser('sub') userId: string) {
    return this.achievementsService.checkAndUnlockAchievements(userId);
  }
}
`,
};

// ============================================
// ANALYTICS MODULE
// ============================================

const analyticsModule = {
  'analytics.module.ts': `import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
`,

  'analytics.service.ts': `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(
    userId: string,
    eventType: string,
    eventData?: any,
  ) {
    const event = await this.prisma.userEvent.create({
      data: {
        userId,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
      },
    });

    return event;
  }

  async getUserAnalytics(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Get user events
    const events = await this.prisma.userEvent.findMany({
      where: {
        userId,
        createdAt: {
          gte: since,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Activity by day
    const activityByDay = this.groupByDay(events);

    // Event type breakdown
    const eventTypeCount = this.countByEventType(events);

    // Learning time per day
    const timePerDay = await this.getTimeSpentPerDay(userId, since);

    // XP gained over time
    const xpOverTime = await this.getXPOverTime(userId, since);

    return {
      totalEvents: events.length,
      activityByDay,
      eventTypeBreakdown: eventTypeCount,
      timeSpentPerDay: timePerDay,
      xpGainedOverTime: xpOverTime,
    };
  }

  async getAdminAnalytics() {
    // Total users
    const totalUsers = await this.prisma.user.count();

    // Active users (logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await this.prisma.user.count({
      where: {
        progress: {
          lastActiveDate: {
            gte: thirtyDaysAgo,
          },
        },
      },
    });

    // Total lessons completed
    const totalLessonsCompleted = await this.prisma.userLessonProgress.count({
      where: { status: 'COMPLETED' },
    });

    // Total exercises completed
    const totalExercisesCompleted = await this.prisma.userExercise.count({
      where: { isCorrect: true },
    });

    // Average accuracy
    const allExercises = await this.prisma.userExercise.count();
    const correctExercises = await this.prisma.userExercise.count({
      where: { isCorrect: true },
    });
    const avgAccuracy =
      allExercises > 0 ? (correctExercises / allExercises) * 100 : 0;

    // User growth (last 30 days)
    const userGrowth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Most popular lessons
    const popularLessons = await this.prisma.lesson.findMany({
      include: {
        _count: {
          select: { userProgress: true },
        },
      },
      orderBy: {
        userProgress: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // User level distribution
    const levelDistribution = await this.getUserLevelDistribution();

    return {
      overview: {
        totalUsers,
        activeUsers,
        userGrowthLast30Days: userGrowth,
        totalLessonsCompleted,
        totalExercisesCompleted,
        averageAccuracy: Math.round(avgAccuracy * 10) / 10,
      },
      popularLessons: popularLessons.map((l) => ({
        id: l.id,
        title: l.title,
        titleArabic: l.titleArabic,
        enrollments: l._count.userProgress,
      })),
      levelDistribution,
    };
  }

  async getLeaderboard(limit: number = 50) {
    const users = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        progress: true,
      },
      orderBy: {
        progress: {
          currentXP: 'desc',
        },
      },
      take: limit,
    });

    return users
      .filter((u) => u.progress)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        name: user.name,
        level: user.progress.currentLevel,
        xp: user.progress.currentXP,
        streak: user.progress.currentStreak,
        lessonsCompleted: user.progress.lessonsCompleted,
      }));
  }

  // Helper methods
  private groupByDay(events: any[]) {
    const grouped: Record<string, number> = {};

    events.forEach((event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private countByEventType(events: any[]) {
    const counts: Record<string, number> = {};

    events.forEach((event) => {
      counts[event.eventType] = (counts[event.eventType] || 0) + 1;
    });

    return Object.entries(counts).map(([eventType, count]) => ({
      eventType,
      count,
    }));
  }

  private async getTimeSpentPerDay(userId: string, since: Date) {
    const lessonProgress = await this.prisma.userLessonProgress.findMany({
      where: {
        userId,
        startedAt: {
          gte: since,
        },
      },
    });

    const grouped: Record<string, number> = {};

    lessonProgress.forEach((lp) => {
      const date = lp.startedAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + lp.timeSpent;
    });

    return Object.entries(grouped).map(([date, timeSpent]) => ({
      date,
      timeSpent: Math.round(timeSpent / 60), // Convert to minutes
    }));
  }

  private async getXPOverTime(userId: string, since: Date) {
    // This is a simplified version - in production, you'd track XP changes in events
    const exercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        attemptedAt: {
          gte: since,
        },
      },
      orderBy: { attemptedAt: 'asc' },
    });

    const grouped: Record<string, number> = {};

    exercises.forEach((ex) => {
      const date = ex.attemptedAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + ex.xpEarned;
    });

    return Object.entries(grouped).map(([date, xp]) => ({
      date,
      xp,
    }));
  }

  private async getUserLevelDistribution() {
    const users = await this.prisma.userProgress.groupBy({
      by: ['currentLevel'],
      _count: {
        currentLevel: true,
      },
      orderBy: {
        currentLevel: 'asc',
      },
    });

    return users.map((u) => ({
      level: u.currentLevel,
      count: u._count.currentLevel,
    }));
  }
}
`,

  'analytics.controller.ts': `import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track user event' })
  @ApiResponse({ status: 201, description: 'Event tracked' })
  async trackEvent(
    @CurrentUser('sub') userId: string,
    @Body() body: { eventType: string; eventData?: any },
  ) {
    return this.analyticsService.trackEvent(
      userId,
      body.eventType,
      body.eventData,
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user analytics' })
  @ApiResponse({ status: 200, description: 'Returns user analytics' })
  async getMyAnalytics(
    @CurrentUser('sub') userId: string,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return this.analyticsService.getUserAnalytics(userId, days || 30);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiResponse({ status: 200, description: 'Returns top users' })
  async getLeaderboard(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.analyticsService.getLeaderboard(limit || 50);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get admin analytics dashboard' })
  @ApiResponse({ status: 200, description: 'Returns platform analytics' })
  async getAdminAnalytics() {
    return this.analyticsService.getAdminAnalytics();
  }
}
`,
};

// ============================================
// FILE WRITING LOGIC
// ============================================

console.log('🚀 Generating remaining backend modules...\n');

const modules = {
  exercises: exercisesModule,
  progress: progressModule,
  verses: versesModule,
  achievements: achievementsModule,
  analytics: analyticsModule,
};

let filesCreated = 0;

Object.entries(modules).forEach(([moduleName, files]) => {
  const moduleDir = path.join(BASE_DIR, moduleName);

  // Create module directory and subdirectories
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }

  const dtoDir = path.join(moduleDir, 'dto');
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir, { recursive: true });
  }

  console.log(`📁 ${moduleName.toUpperCase()} Module`);

  Object.entries(files).forEach(([fileName, content]) => {
    const filePath = path.join(
      fileName.startsWith('dto/') ? dtoDir : moduleDir,
      fileName.replace('dto/', ''),
    );

    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Created: ${fileName}`);
    filesCreated++;
  });

  console.log('');
});

console.log(`✅ Successfully created ${filesCreated} files across 5 modules!\n`);
console.log('📦 Modules generated:');
console.log('  • Exercises - Submit exercises, calculate XP, track attempts');
console.log('  • Progress - XP system, level up, streak tracking, dashboard');
console.log('  • Verses - Search Quran, word analysis, bookmarks');
console.log('  • Analytics - Event tracking, leaderboard, admin dashboard');
console.log('  • Achievements - Unlock achievements based on progress\n');

console.log('🎯 Next steps:');
console.log('  1. Update backend/src/app.module.ts to import these modules');
console.log('  2. Run: npx prisma generate');
console.log('  3. Run: npm run start:dev');
console.log('  4. Test all endpoints at http://localhost:3001/api/docs\n');
