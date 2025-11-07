import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseGeneratorService } from '../exercises/exercise-generator.service';
import { CacheService } from '../../common/cache/cache.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { QuizType, Track } from '@prisma/client';
import {
  CreateQuizDto,
  UpdateQuizDto,
  GenerateQuizDto,
  SubmitQuizAnswerDto,
  CreateQuizQuestionDto,
  ExerciseTypeEnum,
  QuizTypeEnum,
  TrackEnum,
} from './dto/quiz.dto';

describe('QuizService', () => {
  let service: QuizService;

  const mockPrismaService = {
    quiz: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    quizQuestion: {
      create: jest.fn(),
    },
    quizAttempt: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    lesson: {
      findUnique: jest.fn(),
    },
    quranVerse: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    userProgress: {
      update: jest.fn(),
    },
  };

  const mockExerciseGeneratorService = {
    generateVerbAspectExercise: jest.fn(),
    generateNounCaseExercise: jest.fn(),
    generateRootExtractionExercise: jest.fn(),
    generateMorphemeIdentificationExercise: jest.fn(),
    generateSentenceTypeExercise: jest.fn(),
    generateSyntacticRoleExercise: jest.fn(),
    generateAgreementCheckingExercise: jest.fn(),
  };

  const mockCacheService = {
    getJson: jest.fn(),
    setJson: jest.fn(),
    delPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ExerciseGeneratorService,
          useValue: mockExerciseGeneratorService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== Admin Methods ====================

  describe('create', () => {
    it('should create a new quiz without questions', async () => {
      const createDto: CreateQuizDto = {
        title: 'Test Quiz',
        titleArabic: 'اختبار',
        description: 'Test Description',
        type: QuizTypeEnum.PRACTICE,
        minPassScore: 80,
        timeLimit: 600,
        xpReward: 50,
        isPublished: true,
        stage: 1,
        track: TrackEnum.A,
      };

      const mockQuiz = {
        id: 'quiz-1',
        ...createDto,
        type: QuizType.PRACTICE,
        track: Track.A,
        lessonId: null,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.quiz.create.mockResolvedValue(mockQuiz);

      const result = await service.create(createDto);

      expect(mockPrismaService.quiz.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          titleArabic: createDto.titleArabic,
          description: createDto.description,
          type: QuizType.PRACTICE,
          minPassScore: createDto.minPassScore,
          timeLimit: createDto.timeLimit,
          xpReward: createDto.xpReward,
          isPublished: createDto.isPublished,
          stage: createDto.stage,
          track: Track.A,
        },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });

      expect(result.id).toBe('quiz-1');
      expect(result.title).toBe('Test Quiz');
      expect(result.totalQuestions).toBe(0);
    });

    it('should create quiz with lessonId after verifying lesson exists', async () => {
      const createDto: CreateQuizDto = {
        title: 'Lesson Quiz',
        type: QuizTypeEnum.TOPIC,
        lessonId: 'lesson-1',
        minPassScore: 80,
        xpReward: 50,
      };

      const mockLesson = {
        id: 'lesson-1',
        title: 'Test Lesson',
      };

      const mockQuiz = {
        id: 'quiz-1',
        ...createDto,
        type: QuizType.TOPIC,
        track: null,
        stage: null,
        titleArabic: null,
        description: null,
        timeLimit: null,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
      };

      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.quiz.create.mockResolvedValue(mockQuiz);

      const result = await service.create(createDto);

      expect(mockPrismaService.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: 'lesson-1' },
      });
      expect(result.lessonId).toBe('lesson-1');
    });

    it('should throw NotFoundException if lesson does not exist', async () => {
      const createDto: CreateQuizDto = {
        title: 'Lesson Quiz',
        type: QuizTypeEnum.TOPIC,
        lessonId: 'nonexistent-lesson',
      };

      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Lesson nonexistent-lesson not found',
      );
    });

    it('should create quiz with questions', async () => {
      const questionDto: CreateQuizQuestionDto = {
        question: 'What is the verb aspect?',
        type: ExerciseTypeEnum.MULTIPLE_CHOICE,
        correctAnswer: 'PERF',
        options: [{ value: 'PERF', label: 'Perfect' }],
        order: 1,
        points: 1,
      };

      const createDto: CreateQuizDto = {
        title: 'Quiz with Questions',
        type: QuizTypeEnum.PRACTICE,
        questions: [questionDto],
      };

      const mockQuiz = {
        id: 'quiz-1',
        title: createDto.title,
        type: QuizType.PRACTICE,
        minPassScore: 80,
        xpReward: 50,
        isPublished: false,
        lessonId: null,
        stage: null,
        track: null,
        titleArabic: null,
        description: null,
        timeLimit: null,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQuestion = {
        id: 'question-1',
        quizId: 'quiz-1',
        ...questionDto,
        questionArabic: null,
        explanation: null,
        grammarFocus: null,
        verseReference: null,
        wordPosition: null,
      };

      const mockQuizWithQuestions = {
        ...mockQuiz,
        questions: [mockQuestion],
      };

      mockPrismaService.quiz.create.mockResolvedValue(mockQuiz);
      mockPrismaService.quizQuestion.create.mockResolvedValue(mockQuestion);
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuizWithQuestions);

      const result = await service.create(createDto);

      expect(mockPrismaService.quizQuestion.create).toHaveBeenCalled();
      expect(mockPrismaService.quiz.findUnique).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });
      expect(result.questions).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update quiz successfully', async () => {
      const updateDto: UpdateQuizDto = {
        title: 'Updated Quiz',
        isPublished: true,
      };

      const existingQuiz = {
        id: 'quiz-1',
        title: 'Old Quiz',
        type: QuizType.PRACTICE,
        isPublished: false,
      };

      const updatedQuiz = {
        id: 'quiz-1',
        title: 'Updated Quiz',
        type: QuizType.PRACTICE,
        isPublished: true,
        minPassScore: 80,
        xpReward: 50,
        lessonId: null,
        stage: null,
        track: null,
        titleArabic: null,
        description: null,
        timeLimit: null,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(existingQuiz);
      mockPrismaService.quiz.update.mockResolvedValue(updatedQuiz);

      const result = await service.update('quiz-1', updateDto);

      expect(mockPrismaService.quiz.findUnique).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
      });
      expect(mockPrismaService.quiz.update).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
        data: expect.objectContaining({
          title: 'Updated Quiz',
          isPublished: true,
        }),
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });
      expect(result.title).toBe('Updated Quiz');
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      const updateDto: UpdateQuizDto = {
        title: 'Updated Quiz',
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent-quiz', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update('nonexistent-quiz', updateDto)).rejects.toThrow(
        'Quiz nonexistent-quiz not found',
      );
    });

    it('should update lessonId to null when provided', async () => {
      const updateDto: any = {
        lessonId: null, // Using any to bypass TypeScript check since service expects null
      };

      const existingQuiz = {
        id: 'quiz-1',
        title: 'Quiz',
        lessonId: 'lesson-1',
      };

      const updatedQuiz = {
        ...existingQuiz,
        lessonId: null,
        type: QuizType.PRACTICE,
        minPassScore: 80,
        xpReward: 50,
        isPublished: false,
        stage: null,
        track: null,
        titleArabic: null,
        description: null,
        timeLimit: null,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(existingQuiz);
      mockPrismaService.quiz.update.mockResolvedValue(updatedQuiz);

      const result = await service.update('quiz-1', updateDto);

      expect(result.lessonId).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should hard delete quiz with no attempts', async () => {
      const quiz = {
        id: 'quiz-1',
        title: 'Quiz to Delete',
        attempts: [],
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(quiz);
      mockPrismaService.quiz.delete.mockResolvedValue(quiz);

      await service.delete('quiz-1');

      expect(mockPrismaService.quiz.delete).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
      });
    });

    it('should soft delete (unpublish) quiz with attempts', async () => {
      const quiz = {
        id: 'quiz-1',
        title: 'Quiz with Attempts',
        isPublished: true,
        attempts: [{ id: 'attempt-1' }],
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(quiz);
      mockPrismaService.quiz.update.mockResolvedValue({ ...quiz, isPublished: false });

      await service.delete('quiz-1');

      expect(mockPrismaService.quiz.update).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
        data: { isPublished: false },
      });
      expect(mockPrismaService.quiz.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.delete('nonexistent-quiz')).rejects.toThrow(NotFoundException);
      await expect(service.delete('nonexistent-quiz')).rejects.toThrow(
        'Quiz nonexistent-quiz not found',
      );
    });
  });

  describe('addQuestion', () => {
    it('should add question to quiz', async () => {
      const questionDto: CreateQuizQuestionDto = {
        question: 'New Question',
        type: ExerciseTypeEnum.TRUE_FALSE,
        correctAnswer: 'true',
        order: 1,
      };

      const mockQuiz = {
        id: 'quiz-1',
        title: 'Test Quiz',
      };

      const mockQuestion = {
        id: 'question-1',
        quizId: 'quiz-1',
        ...questionDto,
        questionArabic: null,
        options: null,
        explanation: null,
        grammarFocus: null,
        verseReference: null,
        wordPosition: null,
        points: 1,
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizQuestion.create.mockResolvedValue(mockQuestion);

      const result = await service.addQuestion('quiz-1', questionDto);

      expect(mockPrismaService.quizQuestion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          quizId: 'quiz-1',
          question: questionDto.question,
          type: questionDto.type,
          correctAnswer: questionDto.correctAnswer,
          order: questionDto.order,
          points: 1,
        }),
      });
      expect(result.id).toBe('question-1');
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      const questionDto: CreateQuizQuestionDto = {
        question: 'Question',
        type: ExerciseTypeEnum.FILL_IN_BLANK,
        correctAnswer: 'answer',
        order: 1,
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.addQuestion('nonexistent-quiz', questionDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('generateQuizFromGrammar', () => {
    it('should generate quiz from grammar focus', async () => {
      const generateDto: GenerateQuizDto = {
        grammarFocus: 'aspect',
        questionCount: 5,
        title: 'Aspect Quiz',
      };

      const mockQuiz = {
        id: 'quiz-1',
        title: 'Aspect Quiz',
        titleArabic: 'اختبار aspect',
        description: 'Auto-generated practice quiz focusing on aspect',
        type: QuizType.PRACTICE,
        minPassScore: 80,
        timeLimit: 600,
        xpReward: 50,
        isPublished: true,
        lessonId: null,
        stage: null,
        track: null,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockVerses = [
        {
          surahNumber: 1,
          verseNumber: 1,
          words: [{ posType: 'V', position: 1, aspect: 'PERF' }],
        },
      ];

      const mockExercise = {
        question: 'What is the aspect?',
        questionArabic: 'ما هو الزمن؟',
        type: ExerciseTypeEnum.MULTIPLE_CHOICE,
        options: [{ value: 'PERF', label: 'Perfect' }],
        correctAnswer: 'PERF',
        explanation: 'This verb is perfect',
        metadata: {
          grammarFocus: 'aspect',
          verseSource: '1:1',
          wordPosition: 1,
        },
      };

      const mockQuizWithQuestions = {
        ...mockQuiz,
        questions: [
          {
            id: 'question-1',
            quizId: 'quiz-1',
            question: mockExercise.question,
            order: 1,
            points: 1,
          },
        ],
      };

      mockPrismaService.quiz.create.mockResolvedValue(mockQuiz);
      mockPrismaService.quranVerse.count.mockResolvedValue(100);
      mockPrismaService.quranVerse.findMany.mockResolvedValue([mockVerses[0]]);
      mockExerciseGeneratorService.generateVerbAspectExercise.mockResolvedValue(mockExercise);
      mockPrismaService.quizQuestion.create.mockResolvedValue({
        id: 'question-1',
        quizId: 'quiz-1',
        ...mockExercise,
        order: 1,
        points: 1,
      });
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuizWithQuestions);

      const result = await service.generateQuizFromGrammar(generateDto);

      expect(mockPrismaService.quiz.create).toHaveBeenCalled();
      expect(mockExerciseGeneratorService.generateVerbAspectExercise).toHaveBeenCalled();
      expect(result.questions.length).toBeGreaterThan(0);
    });

    it('should throw BadRequestException if no questions generated', async () => {
      const generateDto: GenerateQuizDto = {
        grammarFocus: 'unknown',
        questionCount: 5,
      };

      const mockQuiz = {
        id: 'quiz-1',
        title: 'Unknown Practice Quiz',
      };

      mockPrismaService.quiz.create.mockResolvedValue(mockQuiz);
      mockPrismaService.quranVerse.count.mockResolvedValue(100);
      mockPrismaService.quranVerse.findMany.mockResolvedValue([]);
      mockPrismaService.quiz.delete.mockResolvedValue(mockQuiz);

      await expect(service.generateQuizFromGrammar(generateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.quiz.delete).toHaveBeenCalledWith({ where: { id: 'quiz-1' } });
    });
  });

  // ==================== User Methods ====================

  describe('findAll', () => {
    it('should return all published quizzes', async () => {
      const mockQuizzes = [
        {
          id: 'quiz-1',
          title: 'Quiz 1',
          type: QuizType.PRACTICE,
          isPublished: true,
          minPassScore: 80,
          xpReward: 50,
          stage: 1,
          track: Track.A,
          lessonId: null,
          titleArabic: null,
          description: null,
          timeLimit: null,
          questions: [{ id: 'q1', points: 1 }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.quiz.findMany.mockResolvedValue(mockQuizzes);

      const result = await service.findAll();

      expect(mockPrismaService.quiz.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        include: expect.any(Object),
        orderBy: [{ type: 'asc' }, { stage: 'asc' }, { createdAt: 'desc' }],
      });
      expect(result).toHaveLength(1);
      expect(result[0].totalQuestions).toBe(1);
    });

    it('should return quizzes with user progress when userId provided', async () => {
      const userId = 'user-1';
      const mockQuizzes = [
        {
          id: 'quiz-1',
          title: 'Quiz 1',
          type: QuizType.PRACTICE,
          isPublished: true,
          minPassScore: 80,
          xpReward: 50,
          questions: [{ id: 'q1', points: 1 }],
          attempts: [{ score: 90 }, { score: 85 }],
          stage: null,
          track: null,
          lessonId: null,
          titleArabic: null,
          description: null,
          timeLimit: null,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.quiz.findMany.mockResolvedValue(mockQuizzes);

      const result = await service.findAll(userId);

      expect(result[0].bestScore).toBe(90);
      expect(result[0].attemptCount).toBe(2);
    });

    it('should filter quizzes by type', async () => {
      const filters = { type: QuizTypeEnum.DIAGNOSTIC };

      mockPrismaService.quiz.findMany.mockResolvedValue([]);

      await service.findAll(undefined, filters);

      expect(mockPrismaService.quiz.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: QuizType.DIAGNOSTIC,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return quiz details', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        title: 'Test Quiz',
        type: QuizType.PRACTICE,
        isPublished: true,
        minPassScore: 80,
        xpReward: 50,
        questions: [
          {
            id: 'q1',
            question: 'Question 1',
            type: ExerciseTypeEnum.MULTIPLE_CHOICE,
            correctAnswer: 'A',
            order: 1,
            points: 1,
            questionArabic: null,
            options: null,
            explanation: null,
            grammarFocus: null,
            verseReference: null,
            wordPosition: null,
          },
        ],
        lessonId: null,
        stage: null,
        track: null,
        titleArabic: null,
        description: null,
        timeLimit: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      const result = await service.findOne('quiz-1');

      expect(result.id).toBe('quiz-1');
      expect(result.questions).toHaveLength(1);
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-quiz')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if quiz is not published and no userId', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        title: 'Unpublished Quiz',
        isPublished: false,
        questions: [],
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      await expect(service.findOne('quiz-1')).rejects.toThrow(ForbiddenException);
      await expect(service.findOne('quiz-1')).rejects.toThrow('Quiz is not published');
    });
  });

  describe('startQuiz', () => {
    it('should start quiz and create attempt', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        title: 'Test Quiz',
        type: QuizType.PRACTICE,
        isPublished: true,
        timeLimit: 600,
        questions: [
          {
            id: 'q1',
            question: 'Question 1',
            type: ExerciseTypeEnum.MULTIPLE_CHOICE,
            correctAnswer: 'A',
            order: 1,
            points: 1,
            questionArabic: null,
            options: [{ value: 'A', label: 'Option A' }],
            explanation: null,
            grammarFocus: null,
            verseReference: null,
            wordPosition: null,
          },
        ],
      };

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        score: 0,
        answers: {},
        timeSpent: 0,
        xpEarned: 0,
        passed: false,
        completedAt: new Date(),
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizAttempt.findFirst.mockResolvedValue(null);
      mockPrismaService.quizAttempt.create.mockResolvedValue(mockAttempt);

      const result = await service.startQuiz('quiz-1', 'user-1');

      expect(result.quizId).toBe('quiz-1');
      expect(result.attemptId).toBe('attempt-1');
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].correctAnswer).toBeUndefined(); // Should not include answer
      expect(result.totalPoints).toBe(1);
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.startQuiz('nonexistent-quiz', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if quiz is not published', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        isPublished: false,
        questions: [{ id: 'q1' }],
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      await expect(service.startQuiz('quiz-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if quiz has no questions', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        isPublished: true,
        questions: [],
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      await expect(service.startQuiz('quiz-1', 'user-1')).rejects.toThrow(BadRequestException);
      await expect(service.startQuiz('quiz-1', 'user-1')).rejects.toThrow(
        'Quiz has no questions',
      );
    });

    it('should throw BadRequestException if user has in-progress attempt', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        isPublished: true,
        questions: [{ id: 'q1' }],
      };

      const mockExistingAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        score: 0,
        completedAt: new Date(),
      };

      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizAttempt.findFirst.mockResolvedValue(mockExistingAttempt);

      await expect(service.startQuiz('quiz-1', 'user-1')).rejects.toThrow(BadRequestException);
      await expect(service.startQuiz('quiz-1', 'user-1')).rejects.toThrow(
        'You have an in-progress quiz attempt',
      );
    });
  });

  describe('submitAnswer', () => {
    it('should submit correct answer and return result', async () => {
      const submitDto: SubmitQuizAnswerDto = {
        attemptId: 'attempt-1',
        questionId: 'q1',
        userAnswer: 'PERF',
      };

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        answers: {},
        completedAt: new Date(),
        quiz: {
          id: 'quiz-1',
          questions: [
            {
              id: 'q1',
              correctAnswer: 'PERF',
              points: 1,
              explanation: 'Correct!',
            },
          ],
        },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.quizAttempt.update.mockResolvedValue({
        ...mockAttempt,
        answers: { q1: { userAnswer: 'PERF', isCorrect: true, pointsEarned: 1 } },
      });

      const result = await service.submitAnswer('attempt-1', 'user-1', submitDto);

      expect(result.isCorrect).toBe(true);
      expect(result.pointsEarned).toBe(1);
      expect(result.correctAnswer).toBe('PERF');
    });

    it('should submit incorrect answer and return result', async () => {
      const submitDto: SubmitQuizAnswerDto = {
        attemptId: 'attempt-1',
        questionId: 'q1',
        userAnswer: 'IMPF',
      };

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        answers: {},
        completedAt: new Date(),
        quiz: {
          id: 'quiz-1',
          questions: [
            {
              id: 'q1',
              correctAnswer: 'PERF',
              points: 1,
              explanation: 'Incorrect',
            },
          ],
        },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.quizAttempt.update.mockResolvedValue(mockAttempt);

      const result = await service.submitAnswer('attempt-1', 'user-1', submitDto);

      expect(result.isCorrect).toBe(false);
      expect(result.pointsEarned).toBe(0);
    });

    it('should throw NotFoundException if attempt does not exist', async () => {
      const submitDto: SubmitQuizAnswerDto = {
        attemptId: 'nonexistent-attempt',
        questionId: 'q1',
        userAnswer: 'A',
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(null);

      await expect(service.submitAnswer('nonexistent-attempt', 'user-1', submitDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if attempt belongs to different user', async () => {
      const submitDto: SubmitQuizAnswerDto = {
        attemptId: 'attempt-1',
        questionId: 'q1',
        userAnswer: 'A',
      };

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'other-user',
        quizId: 'quiz-1',
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.submitAnswer('attempt-1', 'user-1', submitDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if attempt has expired', async () => {
      const submitDto: SubmitQuizAnswerDto = {
        attemptId: 'attempt-1',
        questionId: 'q1',
        userAnswer: 'A',
      };

      const oldDate = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        completedAt: oldDate,
        quiz: { questions: [] },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.submitAnswer('attempt-1', 'user-1', submitDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.submitAnswer('attempt-1', 'user-1', submitDto)).rejects.toThrow(
        'Quiz attempt has expired',
      );
    });

    it('should throw NotFoundException if question not in quiz', async () => {
      const submitDto: SubmitQuizAnswerDto = {
        attemptId: 'attempt-1',
        questionId: 'nonexistent-question',
        userAnswer: 'A',
      };

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        completedAt: new Date(),
        quiz: {
          id: 'quiz-1',
          questions: [{ id: 'q1' }],
        },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.submitAnswer('attempt-1', 'user-1', submitDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('completeQuiz', () => {
    it('should complete quiz and calculate final score', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        answers: {
          q1: { userAnswer: 'PERF', isCorrect: true, pointsEarned: 1 },
          q2: { userAnswer: 'IMPF', isCorrect: false, pointsEarned: 0 },
        },
        completedAt: new Date(Date.now() - 300000), // 5 minutes ago
        quiz: {
          id: 'quiz-1',
          minPassScore: 50,
          xpReward: 100,
          questions: [
            {
              id: 'q1',
              question: 'Q1',
              correctAnswer: 'PERF',
              points: 1,
              order: 1,
              explanation: 'Good',
            },
            {
              id: 'q2',
              question: 'Q2',
              correctAnswer: 'PERF',
              points: 1,
              order: 2,
              explanation: 'Try again',
            },
          ],
        },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.quizAttempt.update.mockResolvedValue(mockAttempt);
      mockPrismaService.userProgress.update.mockResolvedValue({});
      mockCacheService.delPattern.mockResolvedValue(undefined);

      const result = await service.completeQuiz('attempt-1', 'user-1');

      expect(result.score).toBe(50); // 1 correct out of 2
      expect(result.passed).toBe(true);
      expect(result.xpEarned).toBe(100);
      expect(result.correctAnswers).toBe(1);
      expect(result.totalQuestions).toBe(2);
      expect(mockPrismaService.userProgress.update).toHaveBeenCalled();
      expect(mockCacheService.delPattern).toHaveBeenCalled();
    });

    it('should not award XP if quiz not passed', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        answers: {
          q1: { userAnswer: 'WRONG', isCorrect: false, pointsEarned: 0 },
        },
        completedAt: new Date(Date.now() - 300000),
        quiz: {
          id: 'quiz-1',
          minPassScore: 80,
          xpReward: 100,
          questions: [
            {
              id: 'q1',
              question: 'Q1',
              correctAnswer: 'CORRECT',
              points: 1,
              order: 1,
              explanation: null,
            },
          ],
        },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.quizAttempt.update.mockResolvedValue(mockAttempt);

      const result = await service.completeQuiz('attempt-1', 'user-1');

      expect(result.passed).toBe(false);
      expect(result.xpEarned).toBe(0);
      expect(mockPrismaService.userProgress.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if not all questions answered', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        quizId: 'quiz-1',
        answers: {
          q1: { userAnswer: 'A', isCorrect: true, pointsEarned: 1 },
        },
        completedAt: new Date(),
        quiz: {
          id: 'quiz-1',
          questions: [
            { id: 'q1', points: 1 },
            { id: 'q2', points: 1 },
          ],
        },
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.completeQuiz('attempt-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.completeQuiz('attempt-1', 'user-1')).rejects.toThrow(
        'You must answer all questions',
      );
    });

    it('should throw NotFoundException if attempt does not exist', async () => {
      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(null);

      await expect(service.completeQuiz('nonexistent-attempt', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if attempt belongs to different user', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'other-user',
      };

      mockPrismaService.quizAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.completeQuiz('attempt-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getAttempts', () => {
    it('should return user quiz attempts', async () => {
      const mockAttempts = [
        {
          id: 'attempt-1',
          userId: 'user-1',
          quizId: 'quiz-1',
          score: 90,
          passed: true,
          xpEarned: 100,
          timeSpent: 300,
          completedAt: new Date(Date.now() - 86400000), // 1 day ago
          quiz: {
            id: 'quiz-1',
            title: 'Test Quiz',
          },
        },
      ];

      mockPrismaService.quizAttempt.findMany.mockResolvedValue(mockAttempts);

      const result = await service.getAttempts('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].score).toBe(90);
      expect(result[0].quizTitle).toBe('Test Quiz');
    });

    it('should filter attempts by quizId', async () => {
      mockPrismaService.quizAttempt.findMany.mockResolvedValue([]);

      await service.getAttempts('user-1', 'quiz-1');

      expect(mockPrismaService.quizAttempt.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-1',
            quizId: 'quiz-1',
          }),
        }),
      );
    });

    it('should exclude in-progress attempts', async () => {
      const mockAttempts = [
        {
          id: 'attempt-1',
          userId: 'user-1',
          quizId: 'quiz-1',
          score: 0,
          completedAt: new Date(), // Just now (in-progress)
          quiz: { id: 'quiz-1', title: 'Quiz' },
        },
        {
          id: 'attempt-2',
          userId: 'user-1',
          quizId: 'quiz-1',
          score: 80,
          completedAt: new Date(Date.now() - 86400000), // 1 day ago (completed)
          quiz: { id: 'quiz-1', title: 'Quiz' },
        },
      ];

      mockPrismaService.quizAttempt.findMany.mockResolvedValue(mockAttempts);

      const result = await service.getAttempts('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('attempt-2');
    });
  });

  describe('getLeaderboard', () => {
    it('should return cached leaderboard if available', async () => {
      const cachedLeaderboard = [
        {
          userId: 'user-1',
          userName: 'User 1',
          score: 95,
          timeSpent: 300,
          completedAt: new Date(),
          rank: 1,
        },
      ];

      mockCacheService.getJson.mockResolvedValue(cachedLeaderboard);

      const result = await service.getLeaderboard('quiz-1');

      expect(result).toEqual(cachedLeaderboard);
      expect(mockPrismaService.quiz.findUnique).not.toHaveBeenCalled();
    });

    it('should compute and cache leaderboard if not cached', async () => {
      const mockQuiz = {
        id: 'quiz-1',
        title: 'Test Quiz',
      };

      const mockAttempts = [
        {
          userId: 'user-1',
          score: 95,
          timeSpent: 300,
          completedAt: new Date(),
          user: { id: 'user-1', name: 'User 1' },
        },
        {
          userId: 'user-2',
          score: 90,
          timeSpent: 350,
          completedAt: new Date(),
          user: { id: 'user-2', name: 'User 2' },
        },
        {
          userId: 'user-1',
          score: 85,
          timeSpent: 280,
          completedAt: new Date(),
          user: { id: 'user-1', name: 'User 1' },
        },
      ];

      mockCacheService.getJson.mockResolvedValue(null);
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizAttempt.findMany.mockResolvedValue(mockAttempts);
      mockCacheService.setJson.mockResolvedValue(undefined);

      const result = await service.getLeaderboard('quiz-1', 10);

      expect(result).toHaveLength(2); // 2 unique users
      expect(result[0].userId).toBe('user-1'); // Best score 95
      expect(result[0].rank).toBe(1);
      expect(result[1].userId).toBe('user-2');
      expect(result[1].rank).toBe(2);
      expect(mockCacheService.setJson).toHaveBeenCalledWith(
        'leaderboard:quiz-1:10',
        expect.any(Array),
        300,
      );
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      mockCacheService.getJson.mockResolvedValue(null);
      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.getLeaderboard('nonexistent-quiz')).rejects.toThrow(NotFoundException);
    });

    it('should respect limit parameter', async () => {
      const mockQuiz = { id: 'quiz-1' };
      const mockAttempts = Array.from({ length: 15 }, (_, i) => ({
        userId: `user-${i}`,
        score: 100 - i,
        timeSpent: 300,
        completedAt: new Date(),
        user: { id: `user-${i}`, name: `User ${i}` },
      }));

      mockCacheService.getJson.mockResolvedValue(null);
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizAttempt.findMany.mockResolvedValue(mockAttempts);
      mockCacheService.setJson.mockResolvedValue(undefined);

      const result = await service.getLeaderboard('quiz-1', 5);

      expect(result).toHaveLength(5);
    });

    it('should rank by score then time (faster wins ties)', async () => {
      const mockQuiz = { id: 'quiz-1' };
      const mockAttempts = [
        {
          userId: 'user-1',
          score: 90,
          timeSpent: 400,
          completedAt: new Date(),
          user: { id: 'user-1', name: 'User 1' },
        },
        {
          userId: 'user-2',
          score: 90,
          timeSpent: 300,
          completedAt: new Date(),
          user: { id: 'user-2', name: 'User 2' },
        },
      ];

      mockCacheService.getJson.mockResolvedValue(null);
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizAttempt.findMany.mockResolvedValue(mockAttempts);
      mockCacheService.setJson.mockResolvedValue(undefined);

      const result = await service.getLeaderboard('quiz-1');

      expect(result[0].userId).toBe('user-2'); // Same score, but faster
      expect(result[1].userId).toBe('user-1');
    });
  });
});
