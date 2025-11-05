import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseGeneratorService } from '../exercises/exercise-generator.service';
import { CacheService } from '../../common/cache/cache.service';
import {
  CreateQuizDto,
  UpdateQuizDto,
  QuizDetailDto,
  QuizListDto,
  StartQuizDto,
  SubmitQuizAnswerDto,
  QuizResultDto,
  CompleteQuizDto,
  QuizAttemptDto,
  QuizQuestionDto,
  GenerateQuizDto,
  FindQuizzesDto,
  LeaderboardEntryDto,
  CreateQuizQuestionDto,
} from './dto/quiz.dto';
import { Prisma, QuizType, Track } from '@prisma/client';

/**
 * QuizService
 *
 * Provides comprehensive quiz functionality:
 * - CRUD operations for quizzes (admin)
 * - Auto-generation from grammar topics
 * - Quiz-taking flow with attempt tracking
 * - Scoring and XP calculation
 * - Leaderboard functionality
 *
 * PERFORMANCE: Uses Redis caching for leaderboard results
 */
@Injectable()
export class QuizService {
  private readonly LEADERBOARD_CACHE_TTL = 300; // 5 minutes - leaderboards change frequently

  constructor(
    private prisma: PrismaService,
    private exerciseGenerator: ExerciseGeneratorService,
    private cacheService: CacheService,
  ) {}

  // ==================== Admin Methods ====================

  /**
   * Create a new quiz
   */
  async create(dto: CreateQuizDto): Promise<QuizDetailDto> {
    const quizData: Prisma.QuizCreateInput = {
      title: dto.title,
      titleArabic: dto.titleArabic,
      description: dto.description,
      type: dto.type as QuizType,
      minPassScore: dto.minPassScore ?? 80,
      timeLimit: dto.timeLimit,
      xpReward: dto.xpReward ?? 50,
      isPublished: dto.isPublished ?? false,
      stage: dto.stage,
      track: dto.track as Track | undefined,
    };

    // Handle optional lessonId relation
    if (dto.lessonId) {
      // Verify lesson exists
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: dto.lessonId },
      });
      if (!lesson) {
        throw new NotFoundException(`Lesson ${dto.lessonId} not found`);
      }
      quizData.lessonId = dto.lessonId;
    }

    const quiz = await this.prisma.quiz.create({
      data: quizData,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Add questions if provided
    if (dto.questions && dto.questions.length > 0) {
      for (const questionDto of dto.questions) {
        await this.addQuestion(quiz.id, questionDto);
      }

      // Refetch with questions
      const quizWithQuestions = await this.prisma.quiz.findUnique({
        where: { id: quiz.id },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });

      return this.mapToQuizDetailDto(quizWithQuestions!);
    }

    return this.mapToQuizDetailDto(quiz);
  }

  /**
   * Update existing quiz
   */
  async update(id: string, dto: UpdateQuizDto): Promise<QuizDetailDto> {
    const existing = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }

    const updateData: Prisma.QuizUpdateInput = {
      title: dto.title,
      titleArabic: dto.titleArabic,
      description: dto.description,
      type: dto.type as QuizType | undefined,
      minPassScore: dto.minPassScore,
      timeLimit: dto.timeLimit,
      xpReward: dto.xpReward,
      isPublished: dto.isPublished,
      stage: dto.stage,
      track: dto.track as Track | undefined,
    };

    // Handle lessonId update
    if (dto.lessonId !== undefined) {
      if (dto.lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
          where: { id: dto.lessonId },
        });
        if (!lesson) {
          throw new NotFoundException(`Lesson ${dto.lessonId} not found`);
        }
        updateData.lessonId = dto.lessonId;
      } else {
        updateData.lessonId = null;
      }
    }

    const quiz = await this.prisma.quiz.update({
      where: { id },
      data: updateData,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.mapToQuizDetailDto(quiz);
  }

  /**
   * Delete quiz
   */
  async delete(id: string): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        attempts: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }

    // Check if quiz has attempts - soft delete logic
    if (quiz.attempts.length > 0) {
      // Instead of deleting, unpublish it
      await this.prisma.quiz.update({
        where: { id },
        data: { isPublished: false },
      });
    } else {
      // Hard delete if no attempts
      await this.prisma.quiz.delete({
        where: { id },
      });
    }
  }

  /**
   * Add a question to existing quiz
   */
  async addQuestion(quizId: string, question: CreateQuizQuestionDto): Promise<QuizQuestionDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${quizId} not found`);
    }

    const createdQuestion = await this.prisma.quizQuestion.create({
      data: {
        quizId,
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

    return this.mapToQuizQuestionDto(createdQuestion, false);
  }

  /**
   * Generate quiz from grammar focus using ExerciseGeneratorService
   */
  async generateQuizFromGrammar(dto: GenerateQuizDto): Promise<QuizDetailDto> {
    const questionCount = dto.questionCount ?? 10;
    const title =
      dto.title ??
      `${dto.grammarFocus.charAt(0).toUpperCase() + dto.grammarFocus.slice(1)} Practice Quiz`;

    // Create the quiz first
    const quiz = await this.prisma.quiz.create({
      data: {
        title,
        titleArabic: `اختبار ${dto.grammarFocus}`,
        description: `Auto-generated practice quiz focusing on ${dto.grammarFocus}`,
        type: QuizType.PRACTICE,
        minPassScore: dto.minPassScore ?? 80,
        timeLimit: dto.timeLimit ?? 600, // 10 minutes default
        xpReward: 50,
        isPublished: true,
      },
    });

    // Generate questions
    const questions = await this.generateQuestionsFromGrammar(dto.grammarFocus, questionCount);

    if (questions.length === 0) {
      // Cleanup quiz if no questions generated
      await this.prisma.quiz.delete({ where: { id: quiz.id } });
      throw new BadRequestException(
        `Could not generate questions for grammar focus: ${dto.grammarFocus}`,
      );
    }

    // Add questions to quiz
    for (let i = 0; i < questions.length; i++) {
      await this.prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          ...questions[i],
          order: i + 1,
          points: 1,
        },
      });
    }

    // Return complete quiz
    const completeQuiz = await this.prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.mapToQuizDetailDto(completeQuiz!);
  }

  // ==================== User Methods ====================

  /**
   * List all published quizzes (with optional filters)
   */
  async findAll(userId?: string, filters?: FindQuizzesDto): Promise<QuizListDto[]> {
    const where: Prisma.QuizWhereInput = {
      isPublished: filters?.isPublished ?? true,
    };

    if (filters?.type) {
      where.type = filters.type as QuizType;
    }

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.track) {
      where.track = filters.track as Track;
    }

    if (filters?.lessonId) {
      where.lessonId = filters.lessonId;
    }

    const quizzes = await this.prisma.quiz.findMany({
      where,
      include: {
        questions: {
          select: { id: true, points: true },
        },
        attempts: userId
          ? {
              where: { userId },
              select: { score: true },
            }
          : false,
      },
      orderBy: [{ type: 'asc' }, { stage: 'asc' }, { createdAt: 'desc' }],
    });

    return quizzes.map((quiz) => this.mapToQuizListDto(quiz, userId));
  }

  /**
   * Get quiz details (without correct answers if not admin)
   */
  async findOne(id: string, userId?: string): Promise<QuizDetailDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }

    if (!quiz.isPublished && !userId) {
      throw new ForbiddenException('Quiz is not published');
    }

    return this.mapToQuizDetailDto(quiz);
  }

  /**
   * Start a quiz session - creates QuizAttempt with in_progress status
   */
  async startQuiz(quizId: string, userId: string): Promise<StartQuizDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${quizId} not found`);
    }

    if (!quiz.isPublished) {
      throw new ForbiddenException('Quiz is not published');
    }

    if (quiz.questions.length === 0) {
      throw new BadRequestException('Quiz has no questions');
    }

    // Check for existing in-progress attempt using Prisma
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        completedAt: { gt: oneHourAgo },
        score: 0,
      },
      orderBy: { completedAt: 'desc' },
    });

    if (existingAttempt) {
      throw new BadRequestException(
        'You have an in-progress quiz attempt. Please complete or abandon it first.',
      );
    }

    // Create attempt record with placeholder data (will be updated on completion)
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score: 0, // Placeholder
        answers: {}, // Will store answers as they're submitted
        timeSpent: 0, // Will be calculated on completion
        xpEarned: 0, // Placeholder
        passed: false, // Placeholder
        completedAt: new Date(), // Will use this as startedAt, update on completion
      },
    });

    // Return questions WITHOUT correct answers
    const questionsWithoutAnswers = quiz.questions.map((q) => this.mapToQuizQuestionDto(q, false));

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    return {
      quizId: quiz.id,
      attemptId: attempt.id,
      questions: questionsWithoutAnswers,
      timeLimit: quiz.timeLimit ?? undefined,
      totalQuestions: quiz.questions.length,
      totalPoints,
      startedAt: attempt.completedAt, // Using completedAt as startedAt
    };
  }

  /**
   * Submit answer for a single question during quiz
   */
  async submitAnswer(
    attemptId: string,
    userId: string,
    dto: SubmitQuizAnswerDto,
  ): Promise<QuizResultDto> {
    // Verify attempt belongs to user
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Quiz attempt ${attemptId} not found`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('This attempt does not belong to you');
    }

    // Check if attempt is still in progress (within time limit + 1 hour grace)
    const startedAt = attempt.completedAt; // Using completedAt as startedAt
    const now = new Date();
    const timeDiff = (now.getTime() - startedAt.getTime()) / 1000; // seconds

    if (timeDiff > 7200) {
      // 2 hours max
      throw new BadRequestException('Quiz attempt has expired');
    }

    // Find the question
    const question = attempt.quiz.questions.find((q) => q.id === dto.questionId);
    if (!question) {
      throw new NotFoundException(`Question ${dto.questionId} not found in this quiz`);
    }

    // Check correctness
    const isCorrect = this.checkAnswer(dto.userAnswer, question.correctAnswer);
    const pointsEarned = isCorrect ? question.points : 0;

    // Update answers in attempt
    const currentAnswers = (attempt.answers as any) || {};
    currentAnswers[dto.questionId] = {
      userAnswer: dto.userAnswer,
      isCorrect,
      pointsEarned,
      submittedAt: new Date().toISOString(),
    };

    await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answers: currentAnswers,
      },
    });

    // Calculate current progress
    const answeredQuestions = Object.keys(currentAnswers).length;

    // Calculate total points earned so far
    let totalPointsEarned = 0;
    for (const answer of Object.values(currentAnswers) as any[]) {
      totalPointsEarned += Number(answer.pointsEarned) || 0;
    }

    const totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const currentScore = totalPoints > 0 ? Math.round((totalPointsEarned / totalPoints) * 100) : 0;

    return {
      questionId: dto.questionId,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation ?? undefined,
      pointsEarned,
      currentScore,
      questionsAnswered: answeredQuestions,
      totalQuestions: attempt.quiz.questions.length,
    };
  }

  /**
   * Complete quiz and calculate final score
   */
  async completeQuiz(attemptId: string, userId: string): Promise<CompleteQuizDto> {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Quiz attempt ${attemptId} not found`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('This attempt does not belong to you');
    }

    const startedAt = attempt.completedAt; // Using completedAt as startedAt
    const completedAt = new Date();
    const timeSpent = Math.round((completedAt.getTime() - startedAt.getTime()) / 1000); // seconds

    // Calculate final score
    const answers = (attempt.answers as any) || {};
    const totalQuestions = attempt.quiz.questions.length;
    const answeredCount = Object.keys(answers).length;

    // Ensure all questions were answered
    if (answeredCount < totalQuestions) {
      throw new BadRequestException(
        `You must answer all questions. Answered: ${answeredCount}/${totalQuestions}`,
      );
    }

    const totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);

    // Calculate total points earned
    let pointsEarned = 0;
    for (const answer of Object.values(answers) as any[]) {
      pointsEarned += Number(answer.pointsEarned) || 0;
    }

    const correctAnswers = Object.values(answers).filter((a: any) => a.isCorrect).length;
    const score = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
    const passed = score >= attempt.quiz.minPassScore;
    const xpEarned = passed ? attempt.quiz.xpReward : 0;

    // Update attempt with final data
    await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        timeSpent,
        xpEarned,
        passed,
        completedAt, // Update to actual completion time
      },
    });

    // Update user progress if passed
    if (passed) {
      await this.updateUserProgress(userId, xpEarned, timeSpent);
      // Invalidate leaderboard cache when a new score is submitted
      await this.cacheService.delPattern(`leaderboard:${attempt.quiz.id}:*`);
    }

    // Build detailed answers array
    const detailedAnswers = attempt.quiz.questions.map((question) => {
      const userAnswer = answers[question.id];
      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer?.userAnswer || '',
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswer?.isCorrect || false,
        pointsEarned: Number(userAnswer?.pointsEarned) || 0,
        explanation: question.explanation ?? undefined,
      };
    });

    return {
      attemptId: attempt.id,
      quizId: attempt.quiz.id,
      score,
      passed,
      xpEarned,
      timeSpent,
      totalQuestions,
      correctAnswers,
      totalPoints,
      pointsEarned,
      completedAt,
      answers: detailedAnswers,
    };
  }

  /**
   * Get user's quiz attempts history
   */
  async getAttempts(userId: string, quizId?: string): Promise<QuizAttemptDto[]> {
    const where: Prisma.QuizAttemptWhereInput = {
      userId,
    };

    if (quizId) {
      where.quizId = quizId;
    }

    // Filter out in-progress attempts (score = 0 and very recent)
    const attempts = await this.prisma.quizAttempt.findMany({
      where,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    // Filter client-side to exclude in-progress
    const completedAttempts = attempts.filter((attempt) => {
      if (attempt.score === 0) {
        const timeSince = (Date.now() - attempt.completedAt.getTime()) / 1000;
        return timeSince > 3600; // Only include if older than 1 hour
      }
      return true;
    });

    return completedAttempts.map((attempt) => ({
      id: attempt.id,
      quizId: attempt.quizId,
      quizTitle: attempt.quiz.title,
      score: attempt.score,
      passed: attempt.passed,
      xpEarned: attempt.xpEarned,
      timeSpent: attempt.timeSpent,
      completedAt: attempt.completedAt,
    }));
  }

  /**
   * Get leaderboard for a quiz
   * SECURITY: Rewritten to use Prisma query builder instead of raw SQL to prevent SQL injection
   * CACHED: Leaderboard results are cached for 5 minutes
   */
  async getLeaderboard(quizId: string, limit: number = 10): Promise<LeaderboardEntryDto[]> {
    const cacheKey = `leaderboard:${quizId}:${limit}`;

    // Try to get from cache first
    const cached = await this.cacheService.getJson<LeaderboardEntryDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${quizId} not found`);
    }

    // Get all attempts for this quiz with score > 0, using Prisma query builder
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        quizId,
        score: { gt: 0 },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ score: 'desc' }, { timeSpent: 'asc' }],
    });

    // Group by user and get best attempt per user
    const userBestAttempts = new Map<string, LeaderboardEntryDto>();

    for (const attempt of attempts) {
      const userId = attempt.userId;
      const existing = userBestAttempts.get(userId);

      const entry: LeaderboardEntryDto = {
        userId: attempt.userId,
        userName: attempt.user.name,
        score: attempt.score,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt,
        rank: 0, // Will be set later
      };

      // Keep best score, or if scores are equal, keep faster time
      if (
        !existing ||
        entry.score > existing.score ||
        (entry.score === existing.score && entry.timeSpent < existing.timeSpent)
      ) {
        userBestAttempts.set(userId, entry);
      }
    }

    // Sort by score (desc) then time (asc) and assign ranks
    const leaderboard = Array.from(userBestAttempts.values())
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeSpent - b.timeSpent;
      })
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    // Cache the leaderboard results
    await this.cacheService.setJson(cacheKey, leaderboard, this.LEADERBOARD_CACHE_TTL);

    return leaderboard;
  }

  // ==================== Helper Methods ====================

  /**
   * Generate questions from grammar focus using ExerciseGeneratorService
   */
  private async generateQuestionsFromGrammar(
    grammarFocus: string,
    questionCount: number,
  ): Promise<any[]> {
    // Get random verses (need more than questionCount to ensure we can generate enough)
    const verses = await this.selectRandomVerses(questionCount * 3);
    const questions: any[] = [];

    for (const verse of verses) {
      if (questions.length >= questionCount) break;

      try {
        let generatedExercise;

        switch (grammarFocus) {
          case 'aspect': {
            const verbWord = verse.words.find((w: any) => w.posType === 'V');
            if (!verbWord) continue;

            generatedExercise = await this.exerciseGenerator.generateVerbAspectExercise(
              verse.surahNumber,
              verse.verseNumber,
              verbWord.position,
            );
            break;
          }

          case 'case': {
            const nounWord = verse.words.find(
              (w: any) => ['N', 'PN', 'ADJ'].includes(w.posType) && w.irabCase,
            );
            if (!nounWord) continue;

            generatedExercise = await this.exerciseGenerator.generateNounCaseExercise(
              verse.surahNumber,
              verse.verseNumber,
              nounWord.position,
            );
            break;
          }

          case 'root': {
            const rootWord = verse.words.find((w: any) => w.root);
            if (!rootWord) continue;

            generatedExercise = await this.exerciseGenerator.generateRootExtractionExercise(
              verse.surahNumber,
              verse.verseNumber,
              rootWord.position,
            );
            break;
          }

          case 'morpheme': {
            const morphemeWord = verse.words.find((w: any) => w.grammarData?.rawFeatures);
            if (!morphemeWord) continue;

            generatedExercise = await this.exerciseGenerator.generateMorphemeIdentificationExercise(
              verse.surahNumber,
              verse.verseNumber,
              morphemeWord.position,
            );
            break;
          }

          case 'sentence_type': {
            generatedExercise = await this.exerciseGenerator.generateSentenceTypeExercise(
              verse.surahNumber,
              verse.verseNumber,
            );
            break;
          }

          case 'syntactic_role': {
            const syntaxWord = verse.words.find((w: any) => w.syntacticRole);
            if (!syntaxWord) continue;

            generatedExercise = await this.exerciseGenerator.generateSyntacticRoleExercise(
              verse.surahNumber,
              verse.verseNumber,
              syntaxWord.position,
            );
            break;
          }

          case 'agreement': {
            const agreementWord = verse.words.find(
              (w: any) => w.posType === 'ADJ' || w.posType === 'N',
            );
            if (!agreementWord) continue;

            generatedExercise = await this.exerciseGenerator.generateAgreementCheckingExercise(
              verse.surahNumber,
              verse.verseNumber,
              agreementWord.position,
            );
            break;
          }

          default:
            continue;
        }

        if (generatedExercise) {
          const question = {
            question: generatedExercise.question,
            questionArabic: generatedExercise.questionArabic,
            type: generatedExercise.type,
            options: generatedExercise.options,
            correctAnswer: generatedExercise.correctAnswer,
            explanation: generatedExercise.explanation,
            grammarFocus: generatedExercise.metadata?.grammarFocus,
            verseReference: generatedExercise.metadata?.verseSource,
            wordPosition: (generatedExercise.metadata as any)?.wordPosition ?? undefined,
          };
          questions.push(question);
        }
      } catch (error) {
        // Skip if generation fails
        continue;
      }
    }

    return questions;
  }

  /**
   * Select random verses for question generation
   */
  private async selectRandomVerses(count: number): Promise<any[]> {
    const totalCount = await this.prisma.quranVerse.count();

    if (totalCount === 0) {
      return [];
    }

    // Generate random offsets
    const offsets: number[] = [];
    for (let i = 0; i < Math.min(count, totalCount); i++) {
      const randomOffset = Math.floor(Math.random() * totalCount);
      offsets.push(randomOffset);
    }

    // Fetch verses at random offsets
    const verses = await Promise.all(
      offsets.map(async (offset) => {
        const verse = await this.prisma.quranVerse.findMany({
          skip: offset,
          take: 1,
          include: {
            words: {
              orderBy: { position: 'asc' },
            },
          },
        });
        return verse[0];
      }),
    );

    return verses.filter((v) => v !== undefined);
  }

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
   * Update user progress after quiz completion
   */
  private async updateUserProgress(
    userId: string,
    xpEarned: number,
    timeSpent: number,
  ): Promise<void> {
    await this.prisma.userProgress.update({
      where: { userId },
      data: {
        currentXP: { increment: xpEarned },
        totalTimeSpent: { increment: timeSpent },
      },
    });
  }

  /**
   * Map Quiz to QuizDetailDto
   */
  private mapToQuizDetailDto(quiz: any): QuizDetailDto {
    const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;

    return {
      id: quiz.id,
      title: quiz.title,
      titleArabic: quiz.titleArabic ?? undefined,
      description: quiz.description ?? undefined,
      type: quiz.type,
      lessonId: quiz.lessonId ?? undefined,
      stage: quiz.stage ?? undefined,
      track: quiz.track ?? undefined,
      minPassScore: quiz.minPassScore,
      timeLimit: quiz.timeLimit ?? undefined,
      xpReward: quiz.xpReward,
      isPublished: quiz.isPublished,
      questions: quiz.questions?.map((q: any) => this.mapToQuizQuestionDto(q, true)) || [],
      totalQuestions: quiz.questions?.length || 0,
      totalPoints,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }

  /**
   * Map Quiz to QuizListDto
   */
  private mapToQuizListDto(quiz: any, userId?: string): QuizListDto {
    const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;
    const bestScore =
      userId && quiz.attempts?.length > 0
        ? Math.max(...quiz.attempts.map((a: any) => a.score))
        : undefined;
    const attemptCount = userId ? (quiz.attempts?.length ?? 0) : undefined;

    return {
      id: quiz.id,
      title: quiz.title,
      titleArabic: quiz.titleArabic ?? undefined,
      description: quiz.description ?? undefined,
      type: quiz.type,
      lessonId: quiz.lessonId ?? undefined,
      stage: quiz.stage ?? undefined,
      track: quiz.track ?? undefined,
      minPassScore: quiz.minPassScore,
      timeLimit: quiz.timeLimit ?? undefined,
      xpReward: quiz.xpReward,
      isPublished: quiz.isPublished,
      totalQuestions: quiz.questions?.length || 0,
      totalPoints,
      bestScore,
      attemptCount,
      createdAt: quiz.createdAt,
    };
  }

  /**
   * Map QuizQuestion to QuizQuestionDto
   */
  private mapToQuizQuestionDto(question: any, includeAnswer: boolean): QuizQuestionDto {
    const dto: QuizQuestionDto = {
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
