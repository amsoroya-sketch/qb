import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsService } from './achievements.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AchievementsService', () => {
  let service: AchievementsService;

  const mockPrismaService = {
    achievement: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    userAchievement: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    userProgress: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all achievements ordered by category and xp', async () => {
      const mockAchievements = [
        {
          id: 'achievement-1',
          name: 'First Steps',
          nameArabic: 'الخطوات الأولى',
          description: 'Complete first lesson',
          icon: '🎓',
          category: 'learning',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 25,
        },
        {
          id: 'achievement-2',
          name: 'Word Master',
          nameArabic: 'سيد الكلمات',
          description: 'Complete 100 exercises',
          icon: '📚',
          category: 'practice',
          requirement: { type: 'exercises_completed', count: 100 },
          xpReward: 200,
        },
      ];

      mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);

      const result = await service.findAll();

      expect(result).toEqual(mockAchievements);
      expect(mockPrismaService.achievement.findMany).toHaveBeenCalledWith({
        orderBy: [{ category: 'asc' }, { xpReward: 'asc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return an achievement by id', async () => {
      const mockAchievement = {
        id: 'achievement-1',
        name: 'First Steps',
        description: 'Complete first lesson',
        xpReward: 25,
      };

      mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);

      const result = await service.findOne('achievement-1');

      expect(result).toEqual(mockAchievement);
      expect(mockPrismaService.achievement.findUnique).toHaveBeenCalledWith({
        where: { id: 'achievement-1' },
      });
    });

    it('should throw NotFoundException if achievement not found', async () => {
      mockPrismaService.achievement.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        'Achievement with ID nonexistent not found',
      );
    });
  });

  describe('getUserAchievements', () => {
    it('should return all achievements with progress for locked ones', async () => {
      const mockProgress = {
        id: 'progress-1',
        userId: 'user-1',
        lessonsCompleted: 25,
        exercisesCompleted: 50,
        currentStreak: 5,
        currentLevel: 3,
        currentXP: 500,
        totalTimeSpent: 7200,
        averageAccuracy: new Prisma.Decimal(85),
      };

      const mockUserAchievements = [
        {
          id: 'user-achievement-1',
          userId: 'user-1',
          achievementId: 'achievement-1',
          unlockedAt: new Date('2025-11-01'),
          achievement: {
            id: 'achievement-1',
            name: 'First Steps',
            category: 'lessons',
            requirement: { type: 'lessons_completed', count: 1 },
            xpReward: 25,
          },
        },
      ];

      const mockAllAchievements = [
        {
          id: 'achievement-1',
          name: 'First Steps',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 25,
        },
        {
          id: 'achievement-2',
          name: 'Lesson Master',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 50 },
          xpReward: 200,
        },
        {
          id: 'achievement-3',
          name: 'Streak Warrior',
          category: 'streaks',
          requirement: { type: 'streak', count: 10 },
          xpReward: 100,
        },
      ];

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue(mockUserAchievements);
      mockPrismaService.achievement.findMany.mockResolvedValue(mockAllAchievements);

      const result = await service.getUserAchievements('user-1');

      expect(result).toHaveLength(3);

      // Check unlocked achievement (100% progress)
      expect(result[0].isUnlocked).toBe(true);
      expect(result[0].progress).toBe(100);
      expect(result[0].achievement.id).toBe('achievement-1');

      // Check locked achievement with 50% progress (25/50 lessons)
      expect(result[1].isUnlocked).toBe(false);
      expect(result[1].progress).toBe(50);
      expect(result[1].progressCurrent).toBe(25);
      expect(result[1].progressRequired).toBe(50);

      // Check locked achievement with 50% progress (5/10 streak)
      expect(result[2].isUnlocked).toBe(false);
      expect(result[2].progress).toBe(50);
      expect(result[2].progressCurrent).toBe(5);
      expect(result[2].progressRequired).toBe(10);
    });

    it('should handle locked achievement with 0% progress', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 0,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAllAchievements = [
        {
          id: 'achievement-1',
          name: 'First Steps',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 25,
        },
      ];

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue(mockAllAchievements);

      const result = await service.getUserAchievements('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].isUnlocked).toBe(false);
      expect(result[0].progress).toBe(0);
      expect(result[0].progressCurrent).toBe(0);
      expect(result[0].progressRequired).toBe(1);
    });

    it('should handle locked achievement with 100% progress (edge case - not yet unlocked)', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 50,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 0,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAllAchievements = [
        {
          id: 'achievement-1',
          name: 'Lesson Master',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 50 },
          xpReward: 200,
        },
      ];

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue(mockAllAchievements);

      const result = await service.getUserAchievements('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].isUnlocked).toBe(false);
      expect(result[0].progress).toBe(100);
      expect(result[0].progressCurrent).toBe(50);
      expect(result[0].progressRequired).toBe(50);
    });

    it('should show all unlocked achievements with 100% progress', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 100,
        exercisesCompleted: 100,
        currentStreak: 30,
        currentLevel: 10,
        currentXP: 5000,
        totalTimeSpent: 36000,
        averageAccuracy: new Prisma.Decimal(95),
      };

      const mockUserAchievements = [
        {
          id: 'user-achievement-1',
          userId: 'user-1',
          achievementId: 'achievement-1',
          unlockedAt: new Date('2025-11-01'),
          achievement: {
            id: 'achievement-1',
            name: 'First Steps',
            category: 'lessons',
            requirement: { type: 'lessons_completed', count: 1 },
            xpReward: 25,
          },
        },
        {
          id: 'user-achievement-2',
          userId: 'user-1',
          achievementId: 'achievement-2',
          unlockedAt: new Date('2025-11-02'),
          achievement: {
            id: 'achievement-2',
            name: 'Exercise Master',
            category: 'exercises',
            requirement: { type: 'exercises_completed', count: 50 },
            xpReward: 150,
          },
        },
      ];

      const mockAllAchievements = [
        {
          id: 'achievement-1',
          name: 'First Steps',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 25,
        },
        {
          id: 'achievement-2',
          name: 'Exercise Master',
          category: 'exercises',
          requirement: { type: 'exercises_completed', count: 50 },
          xpReward: 150,
        },
      ];

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue(mockUserAchievements);
      mockPrismaService.achievement.findMany.mockResolvedValue(mockAllAchievements);

      const result = await service.getUserAchievements('user-1');

      expect(result).toHaveLength(2);
      expect(result.every((r) => r.isUnlocked)).toBe(true);
      expect(result.every((r) => r.progress === 100)).toBe(true);
    });
  });

  describe('checkAndUnlockAchievements', () => {
    it('should return empty array if user progress not found', async () => {
      mockPrismaService.userProgress.findUnique.mockResolvedValue(null);

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toEqual([]);
    });

    it('should unlock achievement when lessons_completed requirement is met', async () => {
      const mockProgress = {
        id: 'progress-1',
        userId: 'user-1',
        lessonsCompleted: 1,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 50,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-1',
        name: 'First Steps',
        requirement: JSON.stringify({ type: 'lessons_completed', count: 1 }),
        xpReward: 25,
      };

      const mockUserAchievement = {
        id: 'user-achievement-1',
        userId: 'user-1',
        achievementId: 'achievement-1',
        unlockedAt: new Date(),
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue(mockUserAchievement);
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].achievement).toEqual(mockAchievement);
      expect(mockPrismaService.userAchievement.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          achievementId: 'achievement-1',
        },
      });
      expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: {
          currentXP: { increment: 25 },
        },
      });
    });

    it('should unlock achievement when exercises_completed requirement is met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 100,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 500,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-2',
        name: 'Word Master',
        requirement: { type: 'exercises_completed', count: 100 },
        xpReward: 200,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue({
        userId: 'user-1',
        achievementId: 'achievement-2',
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
    });

    it('should unlock achievement when streak requirement is met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        currentStreak: 7,
        currentLevel: 1,
        currentXP: 100,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-3',
        name: 'Week Warrior',
        requirement: { type: 'streak', count: 7 },
        xpReward: 50,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue({
        userId: 'user-1',
        achievementId: 'achievement-3',
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
    });

    it('should unlock achievement when level requirement is met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 5,
        currentXP: 1000,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-4',
        name: 'Level Up',
        requirement: { type: 'level', level: 5 },
        xpReward: 100,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue({
        userId: 'user-1',
        achievementId: 'achievement-4',
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
    });

    it('should unlock achievement when xp requirement is met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 3,
        currentXP: 1000,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-5',
        name: 'XP Collector',
        requirement: { type: 'xp', xp: 1000 },
        xpReward: 150,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue({
        userId: 'user-1',
        achievementId: 'achievement-5',
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
    });

    it('should unlock achievement when time_spent requirement is met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 100,
        totalTimeSpent: 7200, // 2 hours in seconds
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-6',
        name: 'Time Dedicated',
        requirement: { type: 'time_spent', hours: 2 },
        xpReward: 75,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue({
        userId: 'user-1',
        achievementId: 'achievement-6',
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
    });

    it('should unlock achievement when accuracy requirement is met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 50,
        currentStreak: 0,
        currentLevel: 2,
        currentXP: 300,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(90),
      };

      const mockAchievement = {
        id: 'achievement-7',
        name: 'Accuracy Master',
        requirement: { type: 'accuracy', value: 90 },
        xpReward: 125,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);
      mockPrismaService.userAchievement.create.mockResolvedValue({
        userId: 'user-1',
        achievementId: 'achievement-7',
      });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(1);
    });

    it('should not unlock achievement when requirement is not met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 10,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-1',
        name: 'First Steps',
        requirement: { type: 'lessons_completed', count: 1 },
        xpReward: 25,
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(0);
      expect(mockPrismaService.userAchievement.create).not.toHaveBeenCalled();
    });

    it('should skip already unlocked achievements', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 5,
        exercisesCompleted: 0,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 250,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievement = {
        id: 'achievement-1',
        name: 'First Steps',
        requirement: { type: 'lessons_completed', count: 1 },
        xpReward: 25,
      };

      const mockUnlockedAchievements = [{ achievementId: 'achievement-1' }];

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue(mockUnlockedAchievements);
      mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(0);
      expect(mockPrismaService.userAchievement.create).not.toHaveBeenCalled();
    });

    it('should unlock multiple achievements if requirements are met', async () => {
      const mockProgress = {
        userId: 'user-1',
        lessonsCompleted: 1,
        exercisesCompleted: 10,
        currentStreak: 0,
        currentLevel: 1,
        currentXP: 100,
        totalTimeSpent: 0,
        averageAccuracy: new Prisma.Decimal(0),
      };

      const mockAchievements = [
        {
          id: 'achievement-1',
          name: 'First Steps',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 25,
        },
        {
          id: 'achievement-2',
          name: 'Practice Beginner',
          requirement: { type: 'exercises_completed', count: 10 },
          xpReward: 50,
        },
      ];

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
      mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);
      mockPrismaService.userAchievement.create
        .mockResolvedValueOnce({ userId: 'user-1', achievementId: 'achievement-1' })
        .mockResolvedValueOnce({ userId: 'user-1', achievementId: 'achievement-2' });
      mockPrismaService.userProgress.update.mockResolvedValue({});

      const result = await service.checkAndUnlockAchievements('user-1');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.userAchievement.create).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.userProgress.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAchievementsByCategory', () => {
    it('should return achievements for specified category', async () => {
      const mockAchievements = [
        {
          id: 'achievement-1',
          name: 'First Steps',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 25,
        },
        {
          id: 'achievement-2',
          name: 'Lesson Master',
          category: 'lessons',
          requirement: { type: 'lessons_completed', count: 50 },
          xpReward: 200,
        },
      ];

      mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);

      const result = await service.getAchievementsByCategory('lessons');

      expect(result).toEqual(mockAchievements);
      expect(mockPrismaService.achievement.findMany).toHaveBeenCalledWith({
        where: { category: 'lessons' },
        orderBy: { xpReward: 'asc' },
      });
    });

    it('should return empty array for category with no achievements', async () => {
      mockPrismaService.achievement.findMany.mockResolvedValue([]);

      await expect(service.getAchievementsByCategory('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getAchievementsByCategory('nonexistent')).rejects.toThrow(
        'No achievements found for category: nonexistent',
      );
    });

    it('should throw error for invalid category', async () => {
      mockPrismaService.achievement.findMany.mockResolvedValue([]);

      await expect(service.getAchievementsByCategory('invalid_category')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAchievementCategories', () => {
    it('should return unique categories', async () => {
      const mockAchievements = [
        { category: 'lessons' },
        { category: 'exercises' },
        { category: 'streaks' },
        { category: 'mastery' },
      ];

      mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);

      const result = await service.getAchievementCategories();

      expect(result).toEqual(['lessons', 'exercises', 'streaks', 'mastery']);
      expect(mockPrismaService.achievement.findMany).toHaveBeenCalledWith({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });
    });

    it('should return empty array if no achievements exist', async () => {
      mockPrismaService.achievement.findMany.mockResolvedValue([]);

      const result = await service.getAchievementCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getAchievementStats', () => {
    it('should return achievement statistics with category breakdown', async () => {
      const mockTopAchievers = [
        {
          id: 'user-1',
          name: 'Top User',
          _count: { achievements: 5 },
          achievements: [],
        },
        {
          id: 'user-2',
          name: 'Second User',
          _count: { achievements: 3 },
          achievements: [],
        },
      ];

      const mockRarestAchievements = [
        {
          id: 'achievement-rare-1',
          name: 'Rare Achievement',
          category: 'mastery',
          _count: { userAchievements: 1 },
        },
        {
          id: 'achievement-rare-2',
          name: 'Another Rare',
          category: 'lessons',
          _count: { userAchievements: 2 },
        },
      ];

      const mockAllAchievements = [
        {
          id: 'achievement-1',
          category: 'lessons',
          _count: { userAchievements: 50 },
        },
        {
          id: 'achievement-2',
          category: 'lessons',
          _count: { userAchievements: 30 },
        },
        {
          id: 'achievement-3',
          category: 'exercises',
          _count: { userAchievements: 40 },
        },
        {
          id: 'achievement-4',
          category: 'streaks',
          _count: { userAchievements: 20 },
        },
        {
          id: 'achievement-5',
          category: 'mastery',
          _count: { userAchievements: 10 },
        },
      ];

      mockPrismaService.achievement.count.mockResolvedValue(5);
      mockPrismaService.userAchievement.count.mockResolvedValue(150);
      mockPrismaService.user.findMany.mockResolvedValue(mockTopAchievers);
      mockPrismaService.achievement.findMany
        .mockResolvedValueOnce(mockRarestAchievements)
        .mockResolvedValueOnce(mockAllAchievements)
        .mockResolvedValue([
          { category: 'lessons' },
          { category: 'exercises' },
          { category: 'streaks' },
          { category: 'mastery' },
        ]);

      const result = await service.getAchievementStats();

      expect(result.totalAchievements).toBe(5);
      expect(result.totalUnlocked).toBe(150);
      expect(result.topAchievers).toHaveLength(2);
      expect(result.topAchievers[0]).toEqual({
        userId: 'user-1',
        name: 'Top User',
        achievementsCount: 5,
      });
      expect(result.rarestAchievements).toHaveLength(2);
      expect(result.rarestAchievements[0].unlockedBy).toBe(1);

      // Check category breakdown
      expect(result.categoriesBreakdown).toBeDefined();
      expect(result.categoriesBreakdown.lessons).toEqual({ total: 2, unlocked: 80 });
      expect(result.categoriesBreakdown.exercises).toEqual({ total: 1, unlocked: 40 });
      expect(result.categoriesBreakdown.streaks).toEqual({ total: 1, unlocked: 20 });
      expect(result.categoriesBreakdown.mastery).toEqual({ total: 1, unlocked: 10 });

      // Check rarity breakdown exists
      expect(result.commonUnlocked).toBeDefined();
      expect(result.rareUnlocked).toBeDefined();
      expect(result.epicUnlocked).toBeDefined();
      expect(result.legendaryUnlocked).toBeDefined();
    });
  });
});
