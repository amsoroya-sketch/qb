import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
      throw new NotFoundException(`Exercise with ID ${id} not found`);
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

    // Get previous attempts to calculate attempt number
    const previousAttempts = await this.prisma.userExercise.count({
      where: {
        userId,
        exerciseId,
      },
    });

    // Calculate accuracy (for this attempt)
    const accuracy = isCorrect ? 100 : 0;

    // Create user exercise record
    const userExercise = await this.prisma.userExercise.create({
      data: {
        userId,
        exerciseId,
        userAnswer: dto.userAnswer,
        isCorrect,
        accuracy,
        attemptNumber: previousAttempts + 1,
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
      orderBy: { completedAt: 'desc' },
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
      totalAttempts > 0 ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts : 0;

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
      .replace(/[ً-ْ]/g, '') // Remove tashkeel
      .replace(/[أإآ]/g, 'ا') // Normalize alef
      .replace(/ة/g, 'ه') // Normalize taa marboota
      .trim();
  }
}
