import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateExamDto,
  UpdateExamDto,
  ExamDetailDto,
  ExamListDto,
  StartExamDto,
  SubmitExamDto,
  ExamResultDto,
  ExamAttemptDto,
  ExamQuestionDto,
  FindExamsDto,
  CreateExamQuestionDto,
  CanRetakeExamDto,
} from './dto/exam.dto';
import { Prisma, ExamType, Track } from '@prisma/client';

/**
 * ExamService
 *
 * Provides comprehensive exam functionality:
 * - CRUD operations for exams (admin)
 * - Exam-taking flow with attempt tracking
 * - All-at-once answer submission (unlike Quiz)
 * - Scoring, XP calculation, and certificate generation
 * - Retake cooldown enforcement
 */
@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  // ==================== Admin Methods ====================

  /**
   * Create a new exam
   */
  async create(dto: CreateExamDto): Promise<ExamDetailDto> {
    const examData: Prisma.ExamCreateInput = {
      title: dto.title,
      titleArabic: dto.titleArabic,
      description: dto.description,
      type: dto.type as ExamType,
      stage: dto.stage,
      track: dto.track as Track,
      minPassScore: dto.minPassScore ?? 85,
      timeLimit: dto.timeLimit,
      xpReward: dto.xpReward ?? 150,
      certificateTemplate: dto.certificateTemplate,
      retakeCooldown: dto.retakeCooldown ?? 86400,
      isPublished: dto.isPublished ?? false,
    };

    const exam = await this.prisma.exam.create({
      data: examData,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Add questions if provided
    if (dto.questions && dto.questions.length > 0) {
      for (const questionDto of dto.questions) {
        await this.addQuestion(exam.id, questionDto);
      }

      // Refetch with questions
      const examWithQuestions = await this.prisma.exam.findUnique({
        where: { id: exam.id },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });

      return this.mapToExamDetailDto(examWithQuestions!);
    }

    return this.mapToExamDetailDto(exam);
  }

  /**
   * Update existing exam
   */
  async update(id: string, dto: UpdateExamDto): Promise<ExamDetailDto> {
    const existing = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Exam ${id} not found`);
    }

    const updateData: Prisma.ExamUpdateInput = {
      title: dto.title,
      titleArabic: dto.titleArabic,
      description: dto.description,
      type: dto.type as ExamType | undefined,
      stage: dto.stage,
      track: dto.track as Track | undefined,
      minPassScore: dto.minPassScore,
      timeLimit: dto.timeLimit,
      xpReward: dto.xpReward,
      certificateTemplate: dto.certificateTemplate,
      retakeCooldown: dto.retakeCooldown,
      isPublished: dto.isPublished,
    };

    const exam = await this.prisma.exam.update({
      where: { id },
      data: updateData,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.mapToExamDetailDto(exam);
  }

  /**
   * Delete exam
   */
  async delete(id: string): Promise<void> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        attempts: true,
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam ${id} not found`);
    }

    // Check if exam has attempts - soft delete logic
    if (exam.attempts.length > 0) {
      // Instead of deleting, unpublish it
      await this.prisma.exam.update({
        where: { id },
        data: { isPublished: false },
      });
    } else {
      // Hard delete if no attempts
      await this.prisma.exam.delete({
        where: { id },
      });
    }
  }

  /**
   * Add a question to existing exam
   */
  async addQuestion(examId: string, question: CreateExamQuestionDto): Promise<ExamQuestionDto> {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException(`Exam ${examId} not found`);
    }

    const createdQuestion = await this.prisma.examQuestion.create({
      data: {
        examId,
        question: question.question,
        questionArabic: question.questionArabic,
        type: question.type,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        grammarFocus: question.grammarFocus,
        verseReference: question.verseReference,
        wordPosition: question.wordPosition,
        order: question.order,
        points: question.points ?? 1,
      },
    });

    return this.mapToExamQuestionDto(createdQuestion, false);
  }

  // ==================== User Methods ====================

  /**
   * List all published exams (with optional filters)
   */
  async findAll(userId?: string, filters?: FindExamsDto): Promise<ExamListDto[]> {
    const where: Prisma.ExamWhereInput = {
      isPublished: filters?.isPublished ?? true,
    };

    if (filters?.type) {
      where.type = filters.type as ExamType;
    }

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.track) {
      where.track = filters.track as Track;
    }

    const exams = await this.prisma.exam.findMany({
      where,
      include: {
        questions: {
          select: { id: true, points: true },
        },
        attempts: userId
          ? {
              where: { userId, completedAt: { not: null } },
              select: { score: true, completedAt: true },
            }
          : false,
      },
      orderBy: [{ stage: 'asc' }, { type: 'asc' }, { createdAt: 'desc' }],
    });

    // Check retake eligibility for each exam if userId provided
    const examsWithRetakeInfo = await Promise.all(
      exams.map(async (exam) => {
        let canRetake = true;
        if (userId) {
          const retakeCheck = await this.canRetakeExam(userId, exam.id);
          canRetake = retakeCheck.canRetake;
        }
        return { ...exam, canRetake };
      }),
    );

    return examsWithRetakeInfo.map((exam) => this.mapToExamListDto(exam, userId));
  }

  /**
   * Get exam details (without correct answers if not admin)
   */
  async findOne(id: string, userId?: string): Promise<ExamDetailDto> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam ${id} not found`);
    }

    if (!exam.isPublished && !userId) {
      throw new ForbiddenException('Exam is not published');
    }

    return this.mapToExamDetailDto(exam);
  }

  /**
   * Start an exam session - creates ExamAttempt
   */
  async startExam(examId: string, userId: string): Promise<StartExamDto> {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam ${examId} not found`);
    }

    if (!exam.isPublished) {
      throw new ForbiddenException('Exam is not published');
    }

    if (exam.questions.length === 0) {
      throw new BadRequestException('Exam has no questions');
    }

    // Check if user can retake exam (cooldown period)
    const retakeCheck = await this.canRetakeExam(userId, examId);
    if (!retakeCheck.canRetake) {
      throw new BadRequestException(
        `You must wait ${Math.ceil(retakeCheck.secondsUntilRetake! / 3600)} hours before retaking this exam`,
      );
    }

    // Check for existing incomplete attempt (within last hour)
    const existingAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        userId,
        examId,
        completedAt: null,
        startedAt: {
          gte: new Date(Date.now() - 3600000), // Last hour
        },
      },
    });

    if (existingAttempt) {
      throw new BadRequestException(
        'You have an in-progress exam attempt. Please complete or abandon it first.',
      );
    }

    // Create attempt record
    const attempt = await this.prisma.examAttempt.create({
      data: {
        userId,
        examId,
        score: 0,
        answers: {},
        timeSpent: 0,
        xpEarned: 0,
        passed: false,
        startedAt: new Date(),
        completedAt: null,
      },
    });

    // Return questions WITHOUT correct answers
    const questionsWithoutAnswers = exam.questions.map((q) => this.mapToExamQuestionDto(q, false));

    const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

    return {
      examId: exam.id,
      attemptId: attempt.id,
      questions: questionsWithoutAnswers,
      timeLimit: exam.timeLimit,
      totalQuestions: exam.questions.length,
      totalPoints,
      startedAt: attempt.startedAt,
    };
  }

  /**
   * Submit exam - ALL answers at once (NOT one-by-one like Quiz)
   */
  async submitExam(attemptId: string, userId: string, dto: SubmitExamDto): Promise<ExamResultDto> {
    // Verify attempt belongs to user
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt ${attemptId} not found`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('This attempt does not belong to you');
    }

    if (attempt.completedAt !== null) {
      throw new BadRequestException('This exam attempt has already been completed');
    }

    // Check time limit not exceeded
    const now = new Date();
    const timeSpent = Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000); // seconds

    if (timeSpent > attempt.exam.timeLimit + 300) {
      // 5 min grace period
      throw new BadRequestException('Time limit exceeded');
    }

    // Validate all questions were answered
    const totalQuestions = attempt.exam.questions.length;
    const answeredCount = Object.keys(dto.answers).length;

    if (answeredCount < totalQuestions) {
      throw new BadRequestException(
        `You must answer all questions. Answered: ${answeredCount}/${totalQuestions}`,
      );
    }

    // Score all answers
    const scoredAnswers: Record<string, any> = {};
    let pointsEarned = 0;
    let correctCount = 0;

    for (const question of attempt.exam.questions) {
      const userAnswer = dto.answers[question.id];
      if (!userAnswer) {
        throw new BadRequestException(`Missing answer for question ${question.id}`);
      }

      const isCorrect = this.checkAnswer(userAnswer, question.correctAnswer);
      const points = isCorrect ? question.points : 0;

      scoredAnswers[question.id] = {
        userAnswer,
        isCorrect,
        pointsEarned: points,
      };

      pointsEarned += points;
      if (isCorrect) correctCount++;
    }

    // Calculate final score
    const totalPoints = attempt.exam.questions.reduce((sum, q) => sum + q.points, 0);
    const score = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
    const passed = score >= attempt.exam.minPassScore;
    const xpEarned = passed ? attempt.exam.xpReward : 0;

    // Generate certificate if passed
    let certificateUrl: string | undefined;
    if (passed && attempt.exam.certificateTemplate) {
      certificateUrl = await this.generateCertificate(attemptId, userId, attempt.exam);
    }

    // Update attempt with final data
    await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        answers: scoredAnswers,
        timeSpent,
        xpEarned,
        passed,
        certificateUrl,
        completedAt: now,
      },
    });

    // Update user progress if passed
    if (passed) {
      await this.updateUserProgress(userId, xpEarned, timeSpent);
    }

    // Build detailed answers array
    const detailedAnswers = attempt.exam.questions.map((question) => {
      const answerData = scoredAnswers[question.id];
      return {
        questionId: question.id,
        question: question.question,
        userAnswer: answerData.userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: answerData.isCorrect,
        pointsEarned: answerData.pointsEarned,
        explanation: question.explanation ?? undefined,
      };
    });

    return {
      attemptId: attempt.id,
      examId: attempt.exam.id,
      score,
      passed,
      xpEarned,
      timeSpent,
      totalQuestions,
      correctAnswers: correctCount,
      totalPoints,
      pointsEarned,
      certificateUrl,
      completedAt: now,
      answers: detailedAnswers,
    };
  }

  /**
   * Get user's exam attempts history
   */
  async getAttempts(userId: string, examId?: string): Promise<ExamAttemptDto[]> {
    const where: Prisma.ExamAttemptWhereInput = {
      userId,
      completedAt: { not: null }, // Only completed attempts
    };

    if (examId) {
      where.examId = examId;
    }

    const attempts = await this.prisma.examAttempt.findMany({
      where,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    return attempts.map((attempt) => ({
      id: attempt.id,
      examId: attempt.examId,
      examTitle: attempt.exam.title,
      score: attempt.score,
      passed: attempt.passed,
      xpEarned: attempt.xpEarned,
      timeSpent: attempt.timeSpent,
      certificateUrl: attempt.certificateUrl ?? undefined,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt ?? undefined,
    }));
  }

  /**
   * Check if user can retake exam (respects cooldown period)
   */
  async canRetakeExam(userId: string, examId: string): Promise<CanRetakeExamDto> {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException(`Exam ${examId} not found`);
    }

    // Find latest completed attempt
    const latestAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        userId,
        examId,
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
    });

    // If no attempts, can take exam
    if (!latestAttempt) {
      return {
        canRetake: true,
      };
    }

    // Calculate time since last attempt
    const now = new Date();
    const lastAttemptTime = latestAttempt.completedAt!.getTime();
    const timeSinceLastAttempt = (now.getTime() - lastAttemptTime) / 1000; // seconds

    // Check cooldown period
    if (timeSinceLastAttempt < exam.retakeCooldown) {
      const secondsUntilRetake = exam.retakeCooldown - timeSinceLastAttempt;
      const nextAvailableDate = new Date(lastAttemptTime + exam.retakeCooldown * 1000);

      return {
        canRetake: false,
        secondsUntilRetake: Math.ceil(secondsUntilRetake),
        lastAttemptDate: latestAttempt.completedAt!,
        nextAvailableDate,
      };
    }

    return {
      canRetake: true,
      lastAttemptDate: latestAttempt.completedAt!,
    };
  }

  /**
   * Generate certificate for passed exam
   */
  async generateCertificate(
    attemptId: string,
    userId: string,
    exam: any,
  ): Promise<string | undefined> {
    // In a real implementation, you would:
    // 1. Get user details
    // 2. Populate certificate template with user name, exam title, date, score
    // 3. Generate PDF or SVG
    // 4. Upload to cloud storage (S3, GCS, etc.)
    // 5. Return URL

    // For now, return a placeholder URL
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Placeholder certificate URL
    // In production, this would be: https://cdn.example.com/certificates/{attemptId}.pdf
    return `https://example.com/certificates/${attemptId}.pdf?user=${user?.name}&exam=${exam.title}`;
  }

  // ==================== Helper Methods ====================

  /**
   * Check if user answer is correct
   */
  private checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    // Normalize answers for comparison
    const normalizeAnswer = (answer: string): string => {
      return answer.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    // For array answers (agreement checking)
    if (correctAnswer.includes(',') || Array.isArray(correctAnswer)) {
      const correctArray = Array.isArray(correctAnswer)
        ? correctAnswer
        : correctAnswer.split(',').map((s) => s.trim());
      const userArray = Array.isArray(userAnswer)
        ? userAnswer
        : userAnswer.split(',').map((s) => s.trim());

      return (
        correctArray.length === userArray.length && correctArray.every((c) => userArray.includes(c))
      );
    }

    // Simple string comparison
    return normalizedUser === normalizedCorrect;
  }

  /**
   * Update user progress after exam completion
   */
  private async updateUserProgress(
    userId: string,
    xpEarned: number,
    timeSpent: number,
  ): Promise<void> {
    // Check if user progress exists, create if not
    const existingProgress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!existingProgress) {
      await this.prisma.userProgress.create({
        data: {
          userId,
          currentXP: xpEarned,
          totalTimeSpent: timeSpent,
        },
      });
    } else {
      await this.prisma.userProgress.update({
        where: { userId },
        data: {
          currentXP: { increment: xpEarned },
          totalTimeSpent: { increment: timeSpent },
        },
      });
    }
  }

  /**
   * Map Exam to ExamDetailDto
   */
  private mapToExamDetailDto(exam: any): ExamDetailDto {
    const totalPoints = exam.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;

    return {
      id: exam.id,
      title: exam.title,
      titleArabic: exam.titleArabic ?? undefined,
      description: exam.description ?? undefined,
      type: exam.type,
      stage: exam.stage,
      track: exam.track,
      minPassScore: exam.minPassScore,
      timeLimit: exam.timeLimit,
      xpReward: exam.xpReward,
      certificateTemplate: exam.certificateTemplate ?? undefined,
      retakeCooldown: exam.retakeCooldown,
      isPublished: exam.isPublished,
      questions: exam.questions?.map((q: any) => this.mapToExamQuestionDto(q, true)) || [],
      totalQuestions: exam.questions?.length || 0,
      totalPoints,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }

  /**
   * Map Exam to ExamListDto
   */
  private mapToExamListDto(exam: any, userId?: string): ExamListDto {
    const totalPoints = exam.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;
    const bestScore =
      userId && exam.attempts?.length > 0
        ? Math.max(...exam.attempts.map((a: any) => a.score))
        : undefined;
    const attemptCount = userId ? (exam.attempts?.length ?? 0) : undefined;
    const canRetake = exam.canRetake ?? true;

    return {
      id: exam.id,
      title: exam.title,
      titleArabic: exam.titleArabic ?? undefined,
      description: exam.description ?? undefined,
      type: exam.type,
      stage: exam.stage,
      track: exam.track,
      minPassScore: exam.minPassScore,
      timeLimit: exam.timeLimit,
      xpReward: exam.xpReward,
      retakeCooldown: exam.retakeCooldown,
      isPublished: exam.isPublished,
      totalQuestions: exam.questions?.length || 0,
      totalPoints,
      bestScore,
      attemptCount,
      canRetake,
      createdAt: exam.createdAt,
    };
  }

  /**
   * Map ExamQuestion to ExamQuestionDto
   */
  private mapToExamQuestionDto(question: any, includeAnswer: boolean): ExamQuestionDto {
    const dto: ExamQuestionDto = {
      id: question.id,
      question: question.question,
      questionArabic: question.questionArabic ?? undefined,
      type: question.type,
      options: question.options ?? undefined,
      explanation: question.explanation ?? undefined,
      grammarFocus: question.grammarFocus ?? undefined,
      verseReference: question.verseReference ?? undefined,
      wordPosition: question.wordPosition ?? undefined,
      order: question.order,
      points: question.points,
    };

    // Only include correct answer if explicitly requested (for admin view or after completion)
    if (includeAnswer) {
      dto.correctAnswer = question.correctAnswer;
    }

    return dto;
  }
}
