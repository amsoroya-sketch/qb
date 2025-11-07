import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrismaService = {
    userEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    userLessonProgress: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    userExercise: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
    },
    userProgress: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackEvent', () => {
    it('should create and return a user event', async () => {
      const mockEvent = {
        id: 'event-1',
        userId: 'user-1',
        eventType: 'lesson_started',
        metadata: { lessonId: 'lesson-123' },
        timestamp: new Date(),
      };

      mockPrismaService.userEvent.create.mockResolvedValue(mockEvent);

      const result = await service.trackEvent('user-1', 'lesson_started', {
        lessonId: 'lesson-123',
      });

      expect(result).toEqual(mockEvent);
      expect(mockPrismaService.userEvent.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          eventType: 'lesson_started',
          metadata: { lessonId: 'lesson-123' },
        },
      });
    });

    it('should create event with null metadata if not provided', async () => {
      const mockEvent = {
        id: 'event-2',
        userId: 'user-1',
        eventType: 'login',
        metadata: null,
        timestamp: new Date(),
      };

      mockPrismaService.userEvent.create.mockResolvedValue(mockEvent);

      const result = await service.trackEvent('user-1', 'login');

      expect(result).toEqual(mockEvent);
      expect(mockPrismaService.userEvent.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          eventType: 'login',
          metadata: null,
        },
      });
    });
  });

  describe('getUserAnalytics', () => {
    it('should return user analytics for the specified period', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          userId: 'user-1',
          eventType: 'lesson_started',
          metadata: {},
          timestamp: new Date('2025-11-01'),
        },
        {
          id: 'event-2',
          userId: 'user-1',
          eventType: 'lesson_completed',
          metadata: {},
          timestamp: new Date('2025-11-01'),
        },
        {
          id: 'event-3',
          userId: 'user-1',
          eventType: 'exercise_completed',
          metadata: {},
          timestamp: new Date('2025-11-02'),
        },
      ];

      const mockLessonProgress = [
        {
          userId: 'user-1',
          startedAt: new Date('2025-11-01'),
          timeSpent: 600, // 10 minutes
        },
      ];

      const mockExercises = [
        {
          userId: 'user-1',
          completedAt: new Date('2025-11-01'),
          xpEarned: 10,
        },
        {
          userId: 'user-1',
          completedAt: new Date('2025-11-02'),
          xpEarned: 15,
        },
      ];

      mockPrismaService.userEvent.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.userLessonProgress.findMany.mockResolvedValue(mockLessonProgress);
      mockPrismaService.userExercise.findMany.mockResolvedValue(mockExercises);

      const result = await service.getUserAnalytics('user-1', 30);

      expect(result.totalEvents).toBe(3);
      expect(result.activityByDay).toBeDefined();
      expect(result.eventTypeBreakdown).toBeDefined();
      expect(result.timeSpentPerDay).toBeDefined();
      expect(result.xpGainedOverTime).toBeDefined();
    });

    it('should group events by day correctly', async () => {
      const mockEvents = [
        {
          userId: 'user-1',
          eventType: 'login',
          timestamp: new Date('2025-11-01T00:00:00Z'),
        },
        {
          userId: 'user-1',
          eventType: 'lesson_started',
          timestamp: new Date('2025-11-01T12:00:00Z'),
        },
        {
          userId: 'user-1',
          eventType: 'exercise_completed',
          timestamp: new Date('2025-11-02T00:00:00Z'),
        },
      ];

      mockPrismaService.userEvent.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
      mockPrismaService.userExercise.findMany.mockResolvedValue([]);

      const result = await service.getUserAnalytics('user-1', 30);

      expect(result.activityByDay).toContainEqual({ date: '2025-11-01', count: 2 });
      expect(result.activityByDay).toContainEqual({ date: '2025-11-02', count: 1 });
    });

    it('should count events by type correctly', async () => {
      const mockEvents = [
        { eventType: 'lesson_started', timestamp: new Date() },
        { eventType: 'lesson_started', timestamp: new Date() },
        { eventType: 'exercise_completed', timestamp: new Date() },
      ];

      mockPrismaService.userEvent.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
      mockPrismaService.userExercise.findMany.mockResolvedValue([]);

      const result = await service.getUserAnalytics('user-1', 30);

      expect(result.eventTypeBreakdown).toContainEqual({
        eventType: 'lesson_started',
        count: 2,
      });
      expect(result.eventTypeBreakdown).toContainEqual({
        eventType: 'exercise_completed',
        count: 1,
      });
    });

    it('should calculate time spent per day in minutes', async () => {
      const mockLessonProgress = [
        {
          startedAt: new Date('2025-11-01'),
          timeSpent: 600, // 10 minutes
        },
        {
          startedAt: new Date('2025-11-01'),
          timeSpent: 900, // 15 minutes
        },
        {
          startedAt: new Date('2025-11-02'),
          timeSpent: 1200, // 20 minutes
        },
      ];

      mockPrismaService.userEvent.findMany.mockResolvedValue([]);
      mockPrismaService.userLessonProgress.findMany.mockResolvedValue(mockLessonProgress);
      mockPrismaService.userExercise.findMany.mockResolvedValue([]);

      const result = await service.getUserAnalytics('user-1', 30);

      expect(result.timeSpentPerDay).toContainEqual({ date: '2025-11-01', timeSpent: 25 }); // 1500s / 60 = 25 min
      expect(result.timeSpentPerDay).toContainEqual({ date: '2025-11-02', timeSpent: 20 });
    });

    it('should calculate XP gained over time', async () => {
      const mockExercises = [
        {
          completedAt: new Date('2025-11-01'),
          xpEarned: 10,
        },
        {
          completedAt: new Date('2025-11-01'),
          xpEarned: 15,
        },
        {
          completedAt: new Date('2025-11-02'),
          xpEarned: 20,
        },
      ];

      mockPrismaService.userEvent.findMany.mockResolvedValue([]);
      mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
      mockPrismaService.userExercise.findMany.mockResolvedValue(mockExercises);

      const result = await service.getUserAnalytics('user-1', 30);

      expect(result.xpGainedOverTime).toContainEqual({ date: '2025-11-01', xp: 25 });
      expect(result.xpGainedOverTime).toContainEqual({ date: '2025-11-02', xp: 20 });
    });
  });

  describe('getAdminAnalytics', () => {
    it('should return comprehensive admin analytics', async () => {
      const mockPopularLessons = [
        {
          id: 'lesson-1',
          title: 'Lesson 1',
          titleArabic: 'درس ١',
          _count: { userProgress: 100 },
        },
      ];

      const mockLevelDistribution = [
        { currentLevel: 1, _count: { currentLevel: 50 } },
        { currentLevel: 2, _count: { currentLevel: 30 } },
      ];

      mockPrismaService.user.count
        .mockResolvedValueOnce(200) // totalUsers
        .mockResolvedValueOnce(150) // activeUsers
        .mockResolvedValueOnce(20); // userGrowth
      mockPrismaService.userLessonProgress.count.mockResolvedValue(500);
      mockPrismaService.userExercise.count
        .mockResolvedValueOnce(850) // totalExercisesCompleted (first call - with where: isCorrect)
        .mockResolvedValueOnce(1000) // allExercises (second call - no where)
        .mockResolvedValueOnce(850); // correctExercises (third call - with where: isCorrect)
      mockPrismaService.lesson.findMany.mockResolvedValue(mockPopularLessons);
      mockPrismaService.userProgress.groupBy.mockResolvedValue(mockLevelDistribution);

      const result = await service.getAdminAnalytics();

      expect(result.overview.totalUsers).toBe(200);
      expect(result.overview.activeUsers).toBe(150);
      expect(result.overview.userGrowthLast30Days).toBe(20);
      expect(result.overview.totalLessonsCompleted).toBe(500);
      expect(result.overview.totalExercisesCompleted).toBe(850);
      expect(result.overview.averageAccuracy).toBe(85); // 850/1000 * 100 = 85%
      expect(result.popularLessons).toHaveLength(1);
      expect(result.levelDistribution).toHaveLength(2);
    });

    it('should handle zero exercises gracefully', async () => {
      mockPrismaService.user.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(10);
      mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
      mockPrismaService.userExercise.count
        .mockResolvedValueOnce(0) // allExercises
        .mockResolvedValueOnce(0) // correctExercises
        .mockResolvedValueOnce(0); // totalExercisesCompleted
      mockPrismaService.lesson.findMany.mockResolvedValue([]);
      mockPrismaService.userProgress.groupBy.mockResolvedValue([]);

      const result = await service.getAdminAnalytics();

      expect(result.overview.averageAccuracy).toBe(0);
    });

    it('should format popular lessons correctly', async () => {
      const mockPopularLessons = [
        {
          id: 'lesson-1',
          title: 'Introduction to Nouns',
          titleArabic: 'مقدمة في الأسماء',
          _count: { userProgress: 150 },
        },
        {
          id: 'lesson-2',
          title: 'Verb Basics',
          titleArabic: 'أساسيات الأفعال',
          _count: { userProgress: 120 },
        },
      ];

      mockPrismaService.user.count.mockResolvedValue(100);
      mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
      mockPrismaService.userExercise.count.mockResolvedValue(0);
      mockPrismaService.lesson.findMany.mockResolvedValue(mockPopularLessons);
      mockPrismaService.userProgress.groupBy.mockResolvedValue([]);

      const result = await service.getAdminAnalytics();

      expect(result.popularLessons).toHaveLength(2);
      expect(result.popularLessons[0]).toEqual({
        id: 'lesson-1',
        title: 'Introduction to Nouns',
        titleArabic: 'مقدمة في الأسماء',
        enrollments: 150,
      });
    });
  });

  describe('getLeaderboard', () => {
    it('should return top users by XP with rankings', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          name: 'Top User',
          role: 'STUDENT',
          progress: {
            currentLevel: 5,
            currentXP: 1000,
            currentStreak: 10,
            lessonsCompleted: 20,
          },
        },
        {
          id: 'user-2',
          name: 'Second User',
          role: 'STUDENT',
          progress: {
            currentLevel: 3,
            currentXP: 500,
            currentStreak: 5,
            lessonsCompleted: 10,
          },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getLeaderboard(50);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        rank: 1,
        userId: 'user-1',
        name: 'Top User',
        level: 5,
        xp: 1000,
        streak: 10,
        lessonsCompleted: 20,
      });
      expect(result[1]).toEqual({
        rank: 2,
        userId: 'user-2',
        name: 'Second User',
        level: 3,
        xp: 500,
        streak: 5,
        lessonsCompleted: 10,
      });
    });

    it('should filter users without progress', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          name: 'User 1',
          role: 'STUDENT',
          progress: {
            currentLevel: 2,
            currentXP: 200,
            currentStreak: 3,
            lessonsCompleted: 5,
          },
        },
        {
          id: 'user-2',
          name: 'User 2',
          role: 'STUDENT',
          progress: null, // No progress
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getLeaderboard(50);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user-1');
    });

    it('should respect the limit parameter', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.getLeaderboard(10);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });

    it('should only include STUDENT role users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.getLeaderboard(50);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'STUDENT' },
        }),
      );
    });

    it('should order users by XP descending', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.getLeaderboard(50);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            progress: {
              currentXP: 'desc',
            },
          },
        }),
      );
    });
  });
});
