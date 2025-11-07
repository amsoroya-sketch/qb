import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LessonsService', () => {
  let service: LessonsService;

  const mockPrismaService = {
    lesson: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userLessonProgress: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    userProgress: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated lessons', async () => {
      const mockLessons = [
        {
          id: '1',
          title: 'Test Lesson',
          titleArabic: 'درس تجريبي',
          track: 'A',
          stage: 1,
          order: 1,
          grammarTopic: 'nouns',
          difficulty: 'BEGINNER',
          xpReward: 50,
          isPublished: true,
          _count: { exercises: 3 },
        },
      ];

      mockPrismaService.lesson.findMany.mockResolvedValue(mockLessons);
      mockPrismaService.lesson.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockLessons);
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
      expect(mockPrismaService.lesson.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should filter by track', async () => {
      mockPrismaService.lesson.findMany.mockResolvedValue([]);
      mockPrismaService.lesson.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20, track: 'A' });

      expect(mockPrismaService.lesson.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { track: 'A' },
        }),
      );
    });

    it('should filter by stage and difficulty', async () => {
      mockPrismaService.lesson.findMany.mockResolvedValue([]);
      mockPrismaService.lesson.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        limit: 20,
        stage: 2,
        difficulty: 'INTERMEDIATE',
      });

      expect(mockPrismaService.lesson.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { stage: 2, difficulty: 'INTERMEDIATE' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a lesson by id', async () => {
      const mockLesson = {
        id: '1',
        title: 'Test Lesson',
        titleArabic: 'درس تجريبي',
        content: 'Lesson content',
        track: 'A',
        stage: 1,
        order: 1,
        grammarTopic: 'nouns',
        difficulty: 'BEGINNER',
        xpReward: 50,
        isPublished: true,
        exercises: [],
      };

      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

      const result = await service.findOne('1');

      expect(result).toEqual(mockLesson);
      expect(mockPrismaService.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('startLesson', () => {
    it('should create user lesson progress', async () => {
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const mockLesson = { id: lessonId, xpReward: 50 };
      const mockProgress = {
        id: 'progress-1',
        userId,
        lessonId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      };

      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.userLessonProgress.upsert.mockResolvedValue(mockProgress);

      const result = await service.startLesson(userId, lessonId);

      expect(result.status).toBe('IN_PROGRESS');
      expect(mockPrismaService.userLessonProgress.upsert).toHaveBeenCalledWith({
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
          startedAt: expect.any(Date),
        },
        update: {
          status: 'IN_PROGRESS',
          startedAt: expect.any(Date),
        },
      });
    });
  });

  describe('completeLesson', () => {
    it('should complete lesson and award XP', async () => {
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const timeSpent = 900;
      const mockLesson = { id: lessonId, xpReward: 50 };

      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.userLessonProgress.update.mockResolvedValue({
        id: 'progress-1',
        userId,
        lessonId,
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent,
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.completeLesson(userId, lessonId, timeSpent);

      expect(result.status).toBe('COMPLETED');
      expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          lessonsCompleted: { increment: 1 },
          currentXP: { increment: 50 },
          totalTimeSpent: { increment: timeSpent },
        },
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(service.completeLesson('user-1', 'nonexistent', 900)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserLessonProgress', () => {
    it('should return user progress for a lesson', async () => {
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const mockProgress = {
        id: 'progress-1',
        userId,
        lessonId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        completedAt: null,
        timeSpent: 0,
      };

      mockPrismaService.userLessonProgress.findUnique.mockResolvedValue(mockProgress);

      const result = await service.getUserLessonProgress(userId, lessonId);

      expect(result).toEqual(mockProgress);
      expect(mockPrismaService.userLessonProgress.findUnique).toHaveBeenCalledWith({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
      });
    });

    it('should create new progress if no progress found', async () => {
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const mockProgress = {
        id: 'progress-1',
        userId,
        lessonId,
        status: 'NOT_STARTED',
      };

      mockPrismaService.userLessonProgress.findUnique.mockResolvedValue(null);
      mockPrismaService.userLessonProgress.create.mockResolvedValue(mockProgress);

      const result = await service.getUserLessonProgress(userId, lessonId);

      expect(result).toEqual(mockProgress);
    });
  });
});
