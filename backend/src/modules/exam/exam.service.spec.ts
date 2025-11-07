import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CreateExamDto,
  UpdateExamDto,
  SubmitExamDto,
  FindExamsDto,
  CreateExamQuestionDto,
  ExamTypeEnum,
  TrackEnum,
  ExerciseTypeEnum,
} from './dto/exam.dto';
import { ExamType, Track } from '@prisma/client';

describe('ExamService', () => {
  let service: ExamService;
  let prisma: PrismaService;

  const mockPrismaService = {
    exam: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    examQuestion: {
      create: jest.fn(),
    },
    examAttempt: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    userProgress: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExamService>(ExamService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== Admin Methods ====================

  describe('create', () => {
    it('should create exam successfully without questions', async () => {
      const createDto: CreateExamDto = {
        title: 'Stage 1 Completion Exam',
        titleArabic: 'اختبار المرحلة الأولى',
        description: 'Test description',
        type: ExamTypeEnum.STAGE_COMPLETION,
        stage: 1,
        track: TrackEnum.A,
        minPassScore: 85,
        timeLimit: 3600,
        xpReward: 150,
        certificateTemplate: '<svg>...</svg>',
        retakeCooldown: 86400,
        isPublished: false,
      };

      const mockExam = {
        id: 'exam-1',
        ...createDto,
        type: 'STAGE_COMPLETION' as ExamType,
        track: 'A' as Track,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.exam.create.mockResolvedValue(mockExam);

      const result = await service.create(createDto);

      expect(mockPrismaService.exam.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          titleArabic: createDto.titleArabic,
          description: createDto.description,
          type: createDto.type,
          stage: createDto.stage,
          track: createDto.track,
          minPassScore: 85,
          timeLimit: createDto.timeLimit,
          xpReward: 150,
          certificateTemplate: createDto.certificateTemplate,
          retakeCooldown: 86400,
          isPublished: false,
        },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('exam-1');
      expect(result.title).toBe(createDto.title);
      expect(result.totalQuestions).toBe(0);
      expect(result.totalPoints).toBe(0);
    });

    it('should create exam with questions', async () => {
      const questionDto: CreateExamQuestionDto = {
        question: 'What is the case?',
        questionArabic: 'ما الإعراب؟',
        type: ExerciseTypeEnum.NOUN_DECLENSION,
        options: [
          { value: 'NOM', label: 'Nominative' },
          { value: 'ACC', label: 'Accusative' },
        ],
        correctAnswer: 'NOM',
        explanation: 'It is nominative',
        grammarFocus: 'case',
        verseReference: '2:1',
        wordPosition: 1,
        order: 1,
        points: 2,
      };

      const createDto: CreateExamDto = {
        title: 'Test Exam',
        type: ExamTypeEnum.STAGE_COMPLETION,
        stage: 1,
        track: TrackEnum.A,
        timeLimit: 3600,
        questions: [questionDto],
      };

      const mockExamWithoutQuestions = {
        id: 'exam-1',
        title: createDto.title,
        type: 'STAGE_COMPLETION' as ExamType,
        stage: 1,
        track: 'A' as Track,
        minPassScore: 85,
        timeLimit: 3600,
        xpReward: 150,
        retakeCooldown: 86400,
        isPublished: false,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQuestion = {
        id: 'question-1',
        examId: 'exam-1',
        ...questionDto,
        type: 'NOUN_DECLENSION',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockExamWithQuestions = {
        ...mockExamWithoutQuestions,
        questions: [mockQuestion],
      };

      mockPrismaService.exam.create.mockResolvedValue(mockExamWithoutQuestions);
      mockPrismaService.exam.findUnique
        .mockResolvedValueOnce(mockExamWithoutQuestions)
        .mockResolvedValueOnce(mockExamWithQuestions);
      mockPrismaService.examQuestion.create.mockResolvedValue(mockQuestion);

      const result = await service.create(createDto);

      expect(mockPrismaService.examQuestion.create).toHaveBeenCalled();
      expect(result.questions.length).toBe(1);
      expect(result.totalQuestions).toBe(1);
      expect(result.totalPoints).toBe(2);
    });

    it('should apply default values when not provided', async () => {
      const createDto: CreateExamDto = {
        title: 'Test Exam',
        type: ExamTypeEnum.STAGE_COMPLETION,
        stage: 1,
        track: TrackEnum.A,
        timeLimit: 3600,
      };

      const mockExam = {
        id: 'exam-1',
        title: createDto.title,
        type: 'STAGE_COMPLETION' as ExamType,
        stage: 1,
        track: 'A' as Track,
        minPassScore: 85,
        timeLimit: 3600,
        xpReward: 150,
        retakeCooldown: 86400,
        isPublished: false,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.exam.create.mockResolvedValue(mockExam);

      const result = await service.create(createDto);

      expect(result.minPassScore).toBe(85);
      expect(result.xpReward).toBe(150);
      expect(result.retakeCooldown).toBe(86400);
      expect(result.isPublished).toBe(false);
    });
  });

  describe('update', () => {
    it('should update exam successfully', async () => {
      const updateDto: UpdateExamDto = {
        title: 'Updated Title',
        minPassScore: 90,
        isPublished: true,
      };

      const existingExam = {
        id: 'exam-1',
        title: 'Old Title',
        type: 'STAGE_COMPLETION' as ExamType,
        stage: 1,
        track: 'A' as Track,
        minPassScore: 85,
        timeLimit: 3600,
        xpReward: 150,
        retakeCooldown: 86400,
        isPublished: false,
      };

      const updatedExam = {
        ...existingExam,
        title: 'Updated Title',
        minPassScore: 90,
        isPublished: true,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(existingExam);
      mockPrismaService.exam.update.mockResolvedValue(updatedExam);

      const result = await service.update('exam-1', updateDto);

      expect(mockPrismaService.exam.findUnique).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
      });
      expect(mockPrismaService.exam.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
      expect(result.minPassScore).toBe(90);
      expect(result.isPublished).toBe(true);
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', {})).rejects.toThrow(NotFoundException);
      await expect(service.update('nonexistent', {})).rejects.toThrow('Exam nonexistent not found');
    });
  });

  describe('delete', () => {
    it('should soft delete exam with attempts by unpublishing', async () => {
      const mockExam = {
        id: 'exam-1',
        title: 'Test Exam',
        attempts: [{ id: 'attempt-1', userId: 'user-1' }],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.exam.update.mockResolvedValue({ ...mockExam, isPublished: false });

      await service.delete('exam-1');

      expect(mockPrismaService.exam.update).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
        data: { isPublished: false },
      });
      expect(mockPrismaService.exam.delete).not.toHaveBeenCalled();
    });

    it('should hard delete exam without attempts', async () => {
      const mockExam = {
        id: 'exam-1',
        title: 'Test Exam',
        attempts: [],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      await service.delete('exam-1');

      expect(mockPrismaService.exam.delete).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
      });
      expect(mockPrismaService.exam.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      await expect(service.delete('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.delete('nonexistent')).rejects.toThrow('Exam nonexistent not found');
    });
  });

  describe('addQuestion', () => {
    it('should add question to exam successfully', async () => {
      const questionDto: CreateExamQuestionDto = {
        question: 'Test question?',
        type: ExerciseTypeEnum.MULTIPLE_CHOICE,
        options: [{ value: 'A', label: 'Option A' }],
        correctAnswer: 'A',
        order: 1,
        points: 2,
      };

      const mockExam = {
        id: 'exam-1',
        title: 'Test Exam',
      };

      const mockQuestion = {
        id: 'question-1',
        examId: 'exam-1',
        ...questionDto,
        type: 'MULTIPLE_CHOICE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.examQuestion.create.mockResolvedValue(mockQuestion);

      const result = await service.addQuestion('exam-1', questionDto);

      expect(mockPrismaService.exam.findUnique).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
      });
      expect(mockPrismaService.examQuestion.create).toHaveBeenCalledWith({
        data: {
          examId: 'exam-1',
          question: questionDto.question,
          questionArabic: undefined,
          type: questionDto.type,
          options: questionDto.options,
          correctAnswer: questionDto.correctAnswer,
          explanation: undefined,
          grammarFocus: undefined,
          verseReference: undefined,
          wordPosition: undefined,
          order: questionDto.order,
          points: 2,
        },
      });
      expect(result.id).toBe('question-1');
      expect(result.correctAnswer).toBeUndefined(); // Should be excluded for security
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      const questionDto: CreateExamQuestionDto = {
        question: 'Test?',
        type: ExerciseTypeEnum.MULTIPLE_CHOICE,
        correctAnswer: 'A',
        order: 1,
      };

      await expect(service.addQuestion('nonexistent', questionDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should apply default points value of 1 when not provided', async () => {
      const questionDto: CreateExamQuestionDto = {
        question: 'Test?',
        type: ExerciseTypeEnum.MULTIPLE_CHOICE,
        correctAnswer: 'A',
        order: 1,
      };

      const mockExam = { id: 'exam-1' };
      const mockQuestion = {
        id: 'question-1',
        examId: 'exam-1',
        ...questionDto,
        type: 'MULTIPLE_CHOICE',
        points: 1,
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.examQuestion.create.mockResolvedValue(mockQuestion);

      const result = await service.addQuestion('exam-1', questionDto);

      expect(result.points).toBe(1);
    });
  });

  // ==================== User Methods ====================

  describe('findAll', () => {
    it('should return all published exams without userId', async () => {
      const mockExams = [
        {
          id: 'exam-1',
          title: 'Exam 1',
          type: 'STAGE_COMPLETION' as ExamType,
          stage: 1,
          track: 'A' as Track,
          minPassScore: 85,
          timeLimit: 3600,
          xpReward: 150,
          retakeCooldown: 86400,
          isPublished: true,
          questions: [{ id: 'q1', points: 2 }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.exam.findMany.mockResolvedValue(mockExams);

      const result = await service.findAll();

      expect(mockPrismaService.exam.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        include: {
          questions: {
            select: { id: true, points: true },
          },
          attempts: false,
        },
        orderBy: [{ stage: 'asc' }, { type: 'asc' }, { createdAt: 'desc' }],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('exam-1');
      expect(result[0].totalQuestions).toBe(1);
      expect(result[0].totalPoints).toBe(2);
    });

    it('should return exams with user-specific data when userId provided', async () => {
      const mockExams = [
        {
          id: 'exam-1',
          title: 'Exam 1',
          type: 'STAGE_COMPLETION' as ExamType,
          stage: 1,
          track: 'A' as Track,
          minPassScore: 85,
          timeLimit: 3600,
          xpReward: 150,
          retakeCooldown: 86400,
          isPublished: true,
          questions: [{ id: 'q1', points: 2 }],
          attempts: [
            { score: 90, completedAt: new Date() },
            { score: 85, completedAt: new Date() },
          ],
          canRetake: false,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.exam.findMany.mockResolvedValue(mockExams);
      mockPrismaService.examAttempt.findFirst.mockResolvedValue({
        id: 'attempt-1',
        completedAt: new Date(),
      });

      const result = await service.findAll('user-1');

      expect(result[0].bestScore).toBe(90);
      expect(result[0].attemptCount).toBe(2);
    });

    it('should filter exams by type', async () => {
      const filters: FindExamsDto = {
        type: ExamTypeEnum.CERTIFICATION,
      };

      mockPrismaService.exam.findMany.mockResolvedValue([]);

      await service.findAll(undefined, filters);

      expect(mockPrismaService.exam.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'CERTIFICATION',
          }),
        }),
      );
    });

    it('should filter exams by stage', async () => {
      const filters: FindExamsDto = {
        stage: 2,
      };

      mockPrismaService.exam.findMany.mockResolvedValue([]);

      await service.findAll(undefined, filters);

      expect(mockPrismaService.exam.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            stage: 2,
          }),
        }),
      );
    });

    it('should filter exams by track', async () => {
      const filters: FindExamsDto = {
        track: TrackEnum.B,
      };

      mockPrismaService.exam.findMany.mockResolvedValue([]);

      await service.findAll(undefined, filters);

      expect(mockPrismaService.exam.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            track: 'B',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return exam details', async () => {
      const mockExam = {
        id: 'exam-1',
        title: 'Exam 1',
        type: 'STAGE_COMPLETION' as ExamType,
        stage: 1,
        track: 'A' as Track,
        minPassScore: 85,
        timeLimit: 3600,
        xpReward: 150,
        retakeCooldown: 86400,
        isPublished: true,
        questions: [
          {
            id: 'q1',
            question: 'Test?',
            type: 'MULTIPLE_CHOICE',
            correctAnswer: 'A',
            order: 1,
            points: 2,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      const result = await service.findOne('exam-1', 'user-1');

      expect(mockPrismaService.exam.findUnique).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });
      expect(result.id).toBe('exam-1');
      expect(result.questions).toHaveLength(1);
      expect(result.totalPoints).toBe(2);
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent')).rejects.toThrow('Exam nonexistent not found');
    });

    it('should throw ForbiddenException if exam not published and no userId', async () => {
      const mockExam = {
        id: 'exam-1',
        isPublished: false,
        questions: [],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      await expect(service.findOne('exam-1')).rejects.toThrow(ForbiddenException);
      await expect(service.findOne('exam-1')).rejects.toThrow('Exam is not published');
    });
  });

  describe('startExam', () => {
    it('should start exam successfully', async () => {
      const mockExam = {
        id: 'exam-1',
        title: 'Test Exam',
        type: 'STAGE_COMPLETION' as ExamType,
        stage: 1,
        track: 'A' as Track,
        minPassScore: 85,
        timeLimit: 3600,
        xpReward: 150,
        retakeCooldown: 86400,
        isPublished: true,
        questions: [
          {
            id: 'q1',
            question: 'What is this?',
            type: 'MULTIPLE_CHOICE',
            options: [{ value: 'A', label: 'Option A' }],
            correctAnswer: 'A',
            order: 1,
            points: 2,
          },
        ],
      };

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        examId: 'exam-1',
        score: 0,
        answers: {},
        timeSpent: 0,
        xpEarned: 0,
        passed: false,
        startedAt: new Date(),
        completedAt: null,
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.examAttempt.findFirst
        .mockResolvedValueOnce(null) // No recent attempt for canRetakeExam
        .mockResolvedValueOnce(null); // No in-progress attempt
      mockPrismaService.examAttempt.create.mockResolvedValue(mockAttempt);

      const result = await service.startExam('exam-1', 'user-1');

      expect(mockPrismaService.examAttempt.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          examId: 'exam-1',
          score: 0,
          answers: {},
          timeSpent: 0,
          xpEarned: 0,
          passed: false,
          startedAt: expect.any(Date),
          completedAt: null,
        },
      });
      expect(result.examId).toBe('exam-1');
      expect(result.attemptId).toBe('attempt-1');
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].correctAnswer).toBeUndefined(); // Should not expose correct answer
      expect(result.totalQuestions).toBe(1);
      expect(result.totalPoints).toBe(2);
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      await expect(service.startExam('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if exam not published', async () => {
      const mockExam = {
        id: 'exam-1',
        isPublished: false,
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow(ForbiddenException);
      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow('Exam is not published');
    });

    it('should throw BadRequestException if exam has no questions', async () => {
      const mockExam = {
        id: 'exam-1',
        isPublished: true,
        questions: [],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow(BadRequestException);
      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow('Exam has no questions');
    });

    it('should throw BadRequestException if cooldown period not passed', async () => {
      const mockExam = {
        id: 'exam-1',
        isPublished: true,
        retakeCooldown: 86400,
        questions: [
          {
            id: 'q1',
            question: 'Test?',
            type: 'MULTIPLE_CHOICE',
            correctAnswer: 'A',
            order: 1,
            points: 2,
          },
        ],
      };

      const recentAttempt = {
        id: 'attempt-1',
        completedAt: new Date(Date.now() - 3600000), // 1 hour ago
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam); // Return exam for all findUnique calls
      mockPrismaService.examAttempt.findFirst.mockResolvedValue(recentAttempt);

      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow(BadRequestException);
      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow(
        /You must wait .+ hours before retaking this exam/,
      );
    });

    it('should throw BadRequestException if in-progress attempt exists', async () => {
      const mockExam = {
        id: 'exam-1',
        isPublished: true,
        retakeCooldown: 86400,
        questions: [
          {
            id: 'q1',
            question: 'Test?',
            type: 'MULTIPLE_CHOICE',
            correctAnswer: 'A',
            order: 1,
            points: 2,
          },
        ],
      };

      const inProgressAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        examId: 'exam-1',
        completedAt: null,
        startedAt: new Date(Date.now() - 1800000), // 30 min ago
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam); // Return exam for all findUnique calls
      // The findFirst is called twice:
      // 1. In canRetakeExam with where clause: { userId, examId, completedAt: { not: null } }
      // 2. In startExam with where clause: { userId, examId, completedAt: null, startedAt: { gte: ... } }
      mockPrismaService.examAttempt.findFirst.mockImplementation((args) => {
        // Check if this is the canRetakeExam call (looking for completed attempts)
        if (args.where.completedAt && args.where.completedAt.not === null) {
          return Promise.resolve(null); // No completed attempts
        }
        // This is the in-progress attempt check
        return Promise.resolve(inProgressAttempt);
      });

      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow(BadRequestException);
      await expect(service.startExam('exam-1', 'user-1')).rejects.toThrow(
        'You have an in-progress exam attempt',
      );
    });
  });

  describe('submitExam', () => {
    it('should submit exam and calculate score correctly', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        examId: 'exam-1',
        score: 0,
        answers: {},
        timeSpent: 0,
        xpEarned: 0,
        passed: false,
        startedAt: new Date(Date.now() - 1800000), // 30 min ago
        completedAt: null,
        exam: {
          id: 'exam-1',
          title: 'Test Exam',
          minPassScore: 85,
          timeLimit: 3600,
          xpReward: 150,
          certificateTemplate: '<svg>...</svg>',
          questions: [
            {
              id: 'q1',
              question: 'Test 1?',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              points: 2,
              order: 1,
            },
            {
              id: 'q2',
              question: 'Test 2?',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'B',
              points: 3,
              order: 2,
            },
          ],
        },
      };

      const submitDto: SubmitExamDto = {
        answers: {
          q1: 'A', // Correct
          q2: 'C', // Incorrect
        },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.examAttempt.update.mockResolvedValue({
        ...mockAttempt,
        score: 40,
        completedAt: new Date(),
      });
      mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
      mockPrismaService.userProgress.create.mockResolvedValue({
        userId: 'user-1',
        currentXP: 0,
        totalTimeSpent: 0,
      });
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Test User',
      });

      const result = await service.submitExam('attempt-1', 'user-1', submitDto);

      expect(result.attemptId).toBe('attempt-1');
      expect(result.score).toBe(40); // 2 out of 5 points = 40%
      expect(result.passed).toBe(false); // 40% < 85%
      expect(result.xpEarned).toBe(0); // No XP for failing
      expect(result.correctAnswers).toBe(1);
      expect(result.totalPoints).toBe(5);
      expect(result.pointsEarned).toBe(2);
      expect(result.answers).toHaveLength(2);
      expect(result.answers[0].isCorrect).toBe(true);
      expect(result.answers[1].isCorrect).toBe(false);
    });

    it('should award XP and generate certificate when passed', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        examId: 'exam-1',
        score: 0,
        startedAt: new Date(Date.now() - 1800000),
        completedAt: null,
        exam: {
          id: 'exam-1',
          title: 'Test Exam',
          minPassScore: 85,
          timeLimit: 3600,
          xpReward: 150,
          certificateTemplate: '<svg>...</svg>',
          questions: [
            {
              id: 'q1',
              question: 'Test?',
              correctAnswer: 'A',
              points: 10,
            },
          ],
        },
      };

      const submitDto: SubmitExamDto = {
        answers: { q1: 'A' },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.examAttempt.update.mockResolvedValue({
        ...mockAttempt,
        score: 100,
        passed: true,
        xpEarned: 150,
      });
      mockPrismaService.userProgress.findUnique.mockResolvedValue({
        userId: 'user-1',
        currentXP: 100,
      });
      mockPrismaService.userProgress.update.mockResolvedValue({
        userId: 'user-1',
        currentXP: 250,
      });
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Test User',
      });

      const result = await service.submitExam('attempt-1', 'user-1', submitDto);

      expect(result.passed).toBe(true);
      expect(result.xpEarned).toBe(150);
      expect(result.certificateUrl).toContain('certificates/attempt-1.pdf');
      expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: {
          currentXP: { increment: 150 },
          totalTimeSpent: { increment: expect.any(Number) },
        },
      });
    });

    it('should throw NotFoundException if attempt does not exist', async () => {
      mockPrismaService.examAttempt.findUnique.mockResolvedValue(null);

      await expect(
        service.submitExam('nonexistent', 'user-1', { answers: {} }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if attempt belongs to different user', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-2',
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.submitExam('attempt-1', 'user-1', { answers: {} })).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.submitExam('attempt-1', 'user-1', { answers: {} })).rejects.toThrow(
        'This attempt does not belong to you',
      );
    });

    it('should throw BadRequestException if attempt already completed', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        completedAt: new Date(),
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(service.submitExam('attempt-1', 'user-1', { answers: {} })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.submitExam('attempt-1', 'user-1', { answers: {} })).rejects.toThrow(
        'This exam attempt has already been completed',
      );
    });

    it('should throw BadRequestException if time limit exceeded', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        startedAt: new Date(Date.now() - 4000000), // Started over an hour ago
        completedAt: null,
        exam: {
          timeLimit: 3600, // 1 hour limit
          questions: [{ id: 'q1' }],
        },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(
        service.submitExam('attempt-1', 'user-1', { answers: { q1: 'A' } }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.submitExam('attempt-1', 'user-1', { answers: { q1: 'A' } }),
      ).rejects.toThrow('Time limit exceeded');
    });

    it('should throw BadRequestException if not all questions answered', async () => {
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        startedAt: new Date(Date.now() - 1800000),
        completedAt: null,
        exam: {
          timeLimit: 3600,
          questions: [{ id: 'q1' }, { id: 'q2' }],
        },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);

      await expect(
        service.submitExam('attempt-1', 'user-1', { answers: { q1: 'A' } }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.submitExam('attempt-1', 'user-1', { answers: { q1: 'A' } }),
      ).rejects.toThrow('You must answer all questions');
    });
  });

  describe('getAttempts', () => {
    it('should return user exam attempts', async () => {
      const mockAttempts = [
        {
          id: 'attempt-1',
          examId: 'exam-1',
          userId: 'user-1',
          score: 90,
          passed: true,
          xpEarned: 150,
          timeSpent: 1800,
          certificateUrl: 'https://example.com/cert.pdf',
          startedAt: new Date(),
          completedAt: new Date(),
          exam: {
            id: 'exam-1',
            title: 'Test Exam',
          },
        },
      ];

      mockPrismaService.examAttempt.findMany.mockResolvedValue(mockAttempts);

      const result = await service.getAttempts('user-1');

      expect(mockPrismaService.examAttempt.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          completedAt: { not: null },
        },
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
      expect(result).toHaveLength(1);
      expect(result[0].examTitle).toBe('Test Exam');
    });

    it('should filter attempts by examId when provided', async () => {
      mockPrismaService.examAttempt.findMany.mockResolvedValue([]);

      await service.getAttempts('user-1', 'exam-1');

      expect(mockPrismaService.examAttempt.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-1',
            examId: 'exam-1',
          }),
        }),
      );
    });
  });

  describe('canRetakeExam', () => {
    it('should allow retake if no previous attempts', async () => {
      const mockExam = {
        id: 'exam-1',
        retakeCooldown: 86400,
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.examAttempt.findFirst.mockResolvedValue(null);

      const result = await service.canRetakeExam('user-1', 'exam-1');

      expect(result.canRetake).toBe(true);
      expect(result.secondsUntilRetake).toBeUndefined();
    });

    it('should allow retake if cooldown period passed', async () => {
      const mockExam = {
        id: 'exam-1',
        retakeCooldown: 86400, // 24 hours
      };

      const oldAttempt = {
        id: 'attempt-1',
        completedAt: new Date(Date.now() - 90000000), // 25 hours ago
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.examAttempt.findFirst.mockResolvedValue(oldAttempt);

      const result = await service.canRetakeExam('user-1', 'exam-1');

      expect(result.canRetake).toBe(true);
      expect(result.lastAttemptDate).toEqual(oldAttempt.completedAt);
    });

    it('should deny retake if cooldown period not passed', async () => {
      const mockExam = {
        id: 'exam-1',
        retakeCooldown: 86400, // 24 hours
      };

      const recentAttempt = {
        id: 'attempt-1',
        completedAt: new Date(Date.now() - 3600000), // 1 hour ago
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
      mockPrismaService.examAttempt.findFirst.mockResolvedValue(recentAttempt);

      const result = await service.canRetakeExam('user-1', 'exam-1');

      expect(result.canRetake).toBe(false);
      expect(result.secondsUntilRetake).toBeGreaterThan(0);
      expect(result.lastAttemptDate).toEqual(recentAttempt.completedAt);
      expect(result.nextAvailableDate).toBeDefined();
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      await expect(service.canRetakeExam('user-1', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('generateCertificate', () => {
    it('should generate certificate URL', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'John Doe',
      });

      const mockExam = {
        id: 'exam-1',
        title: 'Stage 1 Completion',
      };

      const result = await service.generateCertificate('attempt-1', 'user-1', mockExam);

      expect(result).toBeDefined();
      expect(result).toContain('attempt-1');
      expect(result).toContain('John Doe');
      expect(result).toContain('Stage 1 Completion');
    });
  });

  // ==================== Edge Cases & Error Handling ====================

  describe('checkAnswer', () => {
    it('should correctly compare simple string answers', async () => {
      // Test via submitExam since checkAnswer is private
      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        startedAt: new Date(Date.now() - 1800000),
        completedAt: null,
        exam: {
          id: 'exam-1',
          minPassScore: 85,
          timeLimit: 3600,
          xpReward: 150,
          questions: [
            {
              id: 'q1',
              question: 'Test?',
              correctAnswer: 'Answer',
              points: 1,
            },
          ],
        },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.examAttempt.update.mockResolvedValue({});
      mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
      mockPrismaService.userProgress.create.mockResolvedValue({});
      mockPrismaService.user.findUnique.mockResolvedValue({ name: 'Test' });

      // Test case insensitive and whitespace handling
      const result = await service.submitExam('attempt-1', 'user-1', {
        answers: { q1: '  answer  ' },
      });

      expect(result.answers[0].isCorrect).toBe(true);
    });
  });

  describe('updateUserProgress', () => {
    it('should create user progress if not exists', async () => {
      mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
      mockPrismaService.userProgress.create.mockResolvedValue({
        userId: 'user-1',
        currentXP: 150,
        totalTimeSpent: 1800,
      });

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        startedAt: new Date(Date.now() - 1800000),
        completedAt: null,
        exam: {
          minPassScore: 50,
          timeLimit: 3600,
          xpReward: 150,
          questions: [
            {
              id: 'q1',
              correctAnswer: 'A',
              points: 10,
            },
          ],
        },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.examAttempt.update.mockResolvedValue({});
      mockPrismaService.user.findUnique.mockResolvedValue({ name: 'Test' });

      await service.submitExam('attempt-1', 'user-1', { answers: { q1: 'A' } });

      expect(mockPrismaService.userProgress.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          currentXP: 150,
          totalTimeSpent: expect.any(Number),
        },
      });
    });

    it('should update existing user progress', async () => {
      mockPrismaService.userProgress.findUnique.mockResolvedValue({
        userId: 'user-1',
        currentXP: 200,
        totalTimeSpent: 3600,
      });
      mockPrismaService.userProgress.update.mockResolvedValue({
        userId: 'user-1',
        currentXP: 350,
        totalTimeSpent: 5400,
      });

      const mockAttempt = {
        id: 'attempt-1',
        userId: 'user-1',
        startedAt: new Date(Date.now() - 1800000),
        completedAt: null,
        exam: {
          minPassScore: 50,
          timeLimit: 3600,
          xpReward: 150,
          questions: [
            {
              id: 'q1',
              correctAnswer: 'A',
              points: 10,
            },
          ],
        },
      };

      mockPrismaService.examAttempt.findUnique.mockResolvedValue(mockAttempt);
      mockPrismaService.examAttempt.update.mockResolvedValue({});
      mockPrismaService.user.findUnique.mockResolvedValue({ name: 'Test' });

      await service.submitExam('attempt-1', 'user-1', { answers: { q1: 'A' } });

      expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: {
          currentXP: { increment: 150 },
          totalTimeSpent: { increment: expect.any(Number) },
        },
      });
    });
  });
});
