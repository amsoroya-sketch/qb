"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const progress_service_1 = require("./progress.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
describe('ProgressService', () => {
    let service;
    const mockPrismaService = {
        userProgress: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        userLessonProgress: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userExercise: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userAchievement: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        achievement: {
            findMany: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                progress_service_1.ProgressService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(progress_service_1.ProgressService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getUserProgress', () => {
        it('should return user progress with calculated fields', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 150,
                currentLevel: 2,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 3,
                exercisesCompleted: 15,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            const result = await service.getUserProgress('user-1');
            expect(result.currentXP).toBe(150);
            expect(result.currentLevel).toBe(2);
            expect(result.averageAccuracy).toBe(85.5);
            expect(result.xpForNextLevel).toBeDefined();
            expect(result.xpNeededForNextLevel).toBeDefined();
            expect(result.levelProgressPercentage).toBeDefined();
        });
        it('should throw NotFoundException if user progress not found', async () => {
            mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
            await expect(service.getUserProgress('user-1')).rejects.toThrow(common_1.NotFoundException);
            await expect(service.getUserProgress('user-1')).rejects.toThrow('User progress not found');
        });
        it('should calculate level progress correctly', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 100,
                currentLevel: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: null,
                lessonsCompleted: 0,
                exercisesCompleted: 0,
                totalTimeSpent: 0,
                averageAccuracy: new client_1.Prisma.Decimal(0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            const result = await service.getUserProgress('user-1');
            expect(result.xpForNextLevel).toBe(200);
            expect(result.levelProgressPercentage).toBe(50);
        });
    });
    describe('addXP', () => {
        it('should add XP without leveling up', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 50,
                currentLevel: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: null,
                lessonsCompleted: 0,
                exercisesCompleted: 0,
                totalTimeSpent: 0,
                averageAccuracy: new client_1.Prisma.Decimal(0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updatedProgress = { ...mockProgress, currentXP: 75 };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userProgress.update.mockResolvedValue(updatedProgress);
            const result = await service.addXP('user-1', 25);
            expect(result.leveledUp).toBe(false);
            expect(result.xpAdded).toBe(25);
            expect(result.previousLevel).toBe(1);
            expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                data: {
                    currentXP: 75,
                    currentLevel: 1,
                },
            });
        });
        it('should add XP and trigger level up', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 150,
                currentLevel: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: null,
                lessonsCompleted: 0,
                exercisesCompleted: 0,
                totalTimeSpent: 0,
                averageAccuracy: new client_1.Prisma.Decimal(0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updatedProgress = { ...mockProgress, currentXP: 250, currentLevel: 2 };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userProgress.update.mockResolvedValue(updatedProgress);
            const result = await service.addXP('user-1', 100);
            expect(result.leveledUp).toBe(true);
            expect(result.previousLevel).toBe(1);
            expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                data: {
                    currentXP: 250,
                    currentLevel: 2,
                },
            });
        });
    });
    describe('updateStreak', () => {
        it('should initialize streak on first activity', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 0,
                currentLevel: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: null,
                lessonsCompleted: 0,
                exercisesCompleted: 0,
                totalTimeSpent: 0,
                averageAccuracy: new client_1.Prisma.Decimal(0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updatedProgress = { ...mockProgress, currentStreak: 1, longestStreak: 1 };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userProgress.update.mockResolvedValue(updatedProgress);
            const result = await service.updateStreak('user-1');
            expect(result.currentStreak).toBe(1);
            expect(result.longestStreak).toBe(1);
        });
        it('should maintain streak on same day', async () => {
            const now = new Date();
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 0,
                currentLevel: 1,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: now,
                lessonsCompleted: 0,
                exercisesCompleted: 0,
                totalTimeSpent: 0,
                averageAccuracy: new client_1.Prisma.Decimal(0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            const result = await service.updateStreak('user-1');
            expect(result.currentStreak).toBe(5);
            expect(mockPrismaService.userProgress.update).not.toHaveBeenCalled();
        });
        it('should reset streak after missing days', async () => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 0,
                currentLevel: 1,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: threeDaysAgo,
                lessonsCompleted: 0,
                exercisesCompleted: 0,
                totalTimeSpent: 0,
                averageAccuracy: new client_1.Prisma.Decimal(0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updatedProgress = { ...mockProgress, currentStreak: 1 };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userProgress.update.mockResolvedValue(updatedProgress);
            const result = await service.updateStreak('user-1');
            expect(result.currentStreak).toBe(1);
            expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    currentStreak: 1,
                }),
            }));
        });
        it('should throw NotFoundException if user progress not found', async () => {
            mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
            await expect(service.updateStreak('user-1')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getLessonProgress', () => {
        it('should return user lesson progress', async () => {
            const mockLessonProgress = [
                {
                    id: 'progress-1',
                    userId: 'user-1',
                    lessonId: 'lesson-1',
                    status: 'COMPLETED',
                    lesson: {
                        id: 'lesson-1',
                        title: 'Lesson 1',
                        titleArabic: 'درس ١',
                        track: 'A',
                        stage: 1,
                        difficulty: 'BEGINNER',
                        xpReward: 50,
                    },
                },
            ];
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue(mockLessonProgress);
            const result = await service.getLessonProgress('user-1');
            expect(result).toEqual(mockLessonProgress);
            expect(mockPrismaService.userLessonProgress.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { userId: 'user-1' },
            }));
        });
    });
    describe('getAchievementProgress', () => {
        it('should return unlocked and locked achievements', async () => {
            const mockUserAchievements = [
                {
                    userId: 'user-1',
                    achievementId: 'achievement-1',
                    unlockedAt: new Date(),
                    achievement: {
                        id: 'achievement-1',
                        title: 'First Steps',
                        description: 'Complete first lesson',
                        xpReward: 50,
                    },
                },
            ];
            const mockAllAchievements = [
                {
                    id: 'achievement-1',
                    title: 'First Steps',
                    description: 'Complete first lesson',
                    xpReward: 50,
                },
                {
                    id: 'achievement-2',
                    title: 'Word Master',
                    description: 'Complete 100 exercises',
                    xpReward: 200,
                },
            ];
            mockPrismaService.userAchievement.findMany.mockResolvedValue(mockUserAchievements);
            mockPrismaService.achievement.findMany.mockResolvedValue(mockAllAchievements);
            const result = await service.getAchievementProgress('user-1');
            expect(result.unlocked).toHaveLength(1);
            expect(result.locked).toHaveLength(1);
            expect(result.totalUnlocked).toBe(1);
            expect(result.totalAchievements).toBe(2);
            expect(result.completionPercentage).toBe(50);
        });
    });
    describe('getDashboardStats', () => {
        it('should return comprehensive dashboard statistics', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 150,
                currentLevel: 2,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 3,
                exercisesCompleted: 15,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(3);
            mockPrismaService.userExercise.count
                .mockResolvedValueOnce(17)
                .mockResolvedValueOnce(20)
                .mockResolvedValueOnce(17);
            mockPrismaService.userAchievement.count.mockResolvedValue(2);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            const result = await service.getDashboardStats('user-1');
            expect(result.currentLevel).toBe(2);
            expect(result.currentXP).toBe(150);
            expect(result.currentStreak).toBe(5);
            expect(result.longestStreak).toBe(10);
            expect(result.lessonsCompleted).toBe(3);
            expect(result.exercisesCompleted).toBe(17);
            expect(result.achievementsUnlocked).toBe(2);
            expect(result.accuracy).toBeDefined();
            expect(result.totalTimeSpent).toBe(3600);
        });
    });
    describe('getAnalytics', () => {
        const mockProgress = {
            id: 'progress-1',
            userId: 'user-1',
            currentXP: 300,
            currentLevel: 2,
            currentStreak: 5,
            longestStreak: 10,
            lastActiveDate: new Date(),
            lessonsCompleted: 5,
            exercisesCompleted: 25,
            totalTimeSpent: 3600,
            averageAccuracy: new client_1.Prisma.Decimal(85.5),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        it('should return XP history for past 30 days', async () => {
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([
                {
                    xpEarned: 10,
                    completedAt: new Date(),
                },
            ]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
            const result = await service.getAnalytics('user-1');
            expect(result.xpHistory).toBeDefined();
            expect(Array.isArray(result.xpHistory)).toBe(true);
            expect(result.xpHistory.length).toBe(31);
            expect(result.xpHistory[0]).toHaveProperty('date');
            expect(result.xpHistory[0]).toHaveProperty('xp');
            expect(result.xpHistory[0]).toHaveProperty('level');
        });
        it('should calculate level milestones correctly', async () => {
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
            const result = await service.getAnalytics('user-1');
            expect(result.levelMilestones).toBeDefined();
            expect(Array.isArray(result.levelMilestones)).toBe(true);
            expect(result.levelMilestones.length).toBeGreaterThan(0);
            expect(result.levelMilestones[0]).toHaveProperty('level');
            expect(result.levelMilestones[0]).toHaveProperty('xpRequired');
            expect(result.levelMilestones[0]).toHaveProperty('achievedDate');
        });
        it('should calculate weekly stats comparison', async () => {
            const now = new Date();
            const fiveDaysAgo = new Date(now);
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ xpEarned: 50 }, { xpEarned: 50 }])
                .mockResolvedValueOnce([{ xpEarned: 25 }]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.count
                .mockResolvedValueOnce(3)
                .mockResolvedValueOnce(1);
            const result = await service.getAnalytics('user-1');
            expect(result.weeklyStats).toBeDefined();
            expect(result.weeklyStats.currentWeek).toHaveProperty('xpGained');
            expect(result.weeklyStats.currentWeek).toHaveProperty('lessonsCompleted');
            expect(result.weeklyStats.lastWeek).toHaveProperty('xpGained');
            expect(result.weeklyStats.lastWeek).toHaveProperty('lessonsCompleted');
            expect(result.weeklyStats).toHaveProperty('change');
            expect(typeof result.weeklyStats.change).toBe('number');
        });
        it('should return empty history if no activity', async () => {
            mockPrismaService.userProgress.findUnique.mockResolvedValue({
                ...mockProgress,
                currentXP: 0,
                currentLevel: 1,
            });
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
            const result = await service.getAnalytics('user-1');
            expect(result.xpHistory.length).toBe(31);
            expect(result.xpHistory.every((h) => h.xp === 0)).toBe(true);
        });
    });
    describe('getTopicMastery', () => {
        it('should calculate accuracy per topic correctly', async () => {
            const mockUserExercises = [
                {
                    userId: 'user-1',
                    exerciseId: 'ex-1',
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: {
                        lesson: {
                            grammarTopic: 'Past Tense Verbs',
                        },
                    },
                },
                {
                    userId: 'user-1',
                    exerciseId: 'ex-2',
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: {
                        lesson: {
                            grammarTopic: 'Past Tense Verbs',
                        },
                    },
                },
                {
                    userId: 'user-1',
                    exerciseId: 'ex-3',
                    isCorrect: false,
                    completedAt: new Date(),
                    exercise: {
                        lesson: {
                            grammarTopic: 'Past Tense Verbs',
                        },
                    },
                },
                {
                    userId: 'user-1',
                    exerciseId: 'ex-4',
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: {
                        lesson: {
                            grammarTopic: 'Noun Cases',
                        },
                    },
                },
            ];
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockUserExercises);
            const result = await service.getTopicMastery('user-1');
            expect(result.topics).toBeDefined();
            expect(Array.isArray(result.topics)).toBe(true);
            expect(result.topics.length).toBe(2);
            const pastTenseTopic = result.topics.find((t) => t.topic === 'Past Tense Verbs');
            expect(pastTenseTopic).toBeDefined();
            expect(pastTenseTopic.totalExercises).toBe(3);
            expect(pastTenseTopic.correctAnswers).toBe(2);
            expect(pastTenseTopic.accuracy).toBeCloseTo(66.7, 1);
            expect(pastTenseTopic.level).toBe('intermediate');
            const nounCasesTopic = result.topics.find((t) => t.topic === 'Noun Cases');
            expect(nounCasesTopic).toBeDefined();
            expect(nounCasesTopic.totalExercises).toBe(1);
            expect(nounCasesTopic.correctAnswers).toBe(1);
            expect(nounCasesTopic.accuracy).toBe(100);
            expect(nounCasesTopic.level).toBe('advanced');
        });
        it('should identify strongest and weakest topics', async () => {
            const mockUserExercises = [
                {
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Topic A' } },
                },
                {
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Topic A' } },
                },
                {
                    isCorrect: false,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Topic B' } },
                },
                {
                    isCorrect: false,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Topic B' } },
                },
            ];
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockUserExercises);
            const result = await service.getTopicMastery('user-1');
            expect(result.strongestTopic).toBe('Topic A');
            expect(result.weakestTopic).toBe('Topic B');
            expect(result.overallMastery).toBeGreaterThan(0);
        });
        it('should determine mastery levels correctly', async () => {
            const mockUserExercises = [
                ...Array(17)
                    .fill(null)
                    .map(() => ({
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Advanced Topic' } },
                })),
                ...Array(3)
                    .fill(null)
                    .map(() => ({
                    isCorrect: false,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Advanced Topic' } },
                })),
                ...Array(7)
                    .fill(null)
                    .map(() => ({
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Intermediate Topic' } },
                })),
                ...Array(3)
                    .fill(null)
                    .map(() => ({
                    isCorrect: false,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Intermediate Topic' } },
                })),
                ...Array(5)
                    .fill(null)
                    .map(() => ({
                    isCorrect: true,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Beginner Topic' } },
                })),
                ...Array(5)
                    .fill(null)
                    .map(() => ({
                    isCorrect: false,
                    completedAt: new Date(),
                    exercise: { lesson: { grammarTopic: 'Beginner Topic' } },
                })),
            ];
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockUserExercises);
            const result = await service.getTopicMastery('user-1');
            const advancedTopic = result.topics.find((t) => t.topic === 'Advanced Topic');
            const intermediateTopic = result.topics.find((t) => t.topic === 'Intermediate Topic');
            const beginnerTopic = result.topics.find((t) => t.topic === 'Beginner Topic');
            expect(advancedTopic?.level).toBe('advanced');
            expect(intermediateTopic?.level).toBe('intermediate');
            expect(beginnerTopic?.level).toBe('beginner');
        });
        it('should return empty array if no exercises completed', async () => {
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            const result = await service.getTopicMastery('user-1');
            expect(result.topics).toEqual([]);
            expect(result.overallMastery).toBe(0);
            expect(result.strongestTopic).toBeNull();
            expect(result.weakestTopic).toBeNull();
        });
    });
    describe('getActivityCalendar', () => {
        it('should return daily activity for specified days', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 300,
                currentLevel: 2,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 5,
                exercisesCompleted: 25,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([
                {
                    completedAt: new Date(),
                    xpEarned: 10,
                    timeSpent: 120,
                    isCorrect: true,
                },
            ]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            const result = await service.getActivityCalendar('user-1', 30);
            expect(result.calendar).toBeDefined();
            expect(Array.isArray(result.calendar)).toBe(true);
            expect(result.calendar.length).toBe(30);
            expect(result.calendar[0]).toHaveProperty('date');
            expect(result.calendar[0]).toHaveProperty('exercisesCompleted');
            expect(result.calendar[0]).toHaveProperty('lessonsCompleted');
            expect(result.calendar[0]).toHaveProperty('xpEarned');
            expect(result.calendar[0]).toHaveProperty('timeSpent');
            expect(result.calendar[0]).toHaveProperty('activityLevel');
        });
        it('should calculate activity levels correctly', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 300,
                currentLevel: 2,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 5,
                exercisesCompleted: 25,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const twoDaysAgo = new Date(today);
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([
                { completedAt: today, xpEarned: 200, timeSpent: 120, isCorrect: true },
                { completedAt: yesterday, xpEarned: 100, timeSpent: 60, isCorrect: true },
                { completedAt: twoDaysAgo, xpEarned: 30, timeSpent: 30, isCorrect: true },
            ]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            const result = await service.getActivityCalendar('user-1', 7);
            const todayActivity = result.calendar.find((d) => d.date === today.toISOString().split('T')[0]);
            const yesterdayActivity = result.calendar.find((d) => d.date === yesterday.toISOString().split('T')[0]);
            const twoDaysAgoActivity = result.calendar.find((d) => d.date === twoDaysAgo.toISOString().split('T')[0]);
            expect(todayActivity?.activityLevel).toBe('high');
            expect(yesterdayActivity?.activityLevel).toBe('medium');
            expect(twoDaysAgoActivity?.activityLevel).toBe('low');
        });
        it('should calculate streaks correctly', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 300,
                currentLevel: 2,
                currentStreak: 3,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 5,
                exercisesCompleted: 25,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([
                { completedAt: new Date(), xpEarned: 50, timeSpent: 60, isCorrect: true },
            ]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            const result = await service.getActivityCalendar('user-1', 30);
            expect(result.stats).toBeDefined();
            expect(result.stats.currentStreak).toBe(3);
            expect(result.stats.longestStreak).toBeGreaterThanOrEqual(0);
            expect(result.stats.totalActiveDays).toBeGreaterThanOrEqual(0);
            expect(result.stats.averagePerDay).toBeGreaterThanOrEqual(0);
        });
        it('should default to 365 days if invalid parameter', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 300,
                currentLevel: 2,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 5,
                exercisesCompleted: 25,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            const result = await service.getActivityCalendar('user-1', 999);
            expect(result.calendar.length).toBe(365);
        });
        it('should convert time to minutes correctly', async () => {
            const mockProgress = {
                id: 'progress-1',
                userId: 'user-1',
                currentXP: 300,
                currentLevel: 2,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: new Date(),
                lessonsCompleted: 5,
                exercisesCompleted: 25,
                totalTimeSpent: 3600,
                averageAccuracy: new client_1.Prisma.Decimal(85.5),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue([
                { completedAt: new Date(), xpEarned: 50, timeSpent: 120, isCorrect: true },
            ]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            const result = await service.getActivityCalendar('user-1', 7);
            const todayActivity = result.calendar.find((d) => d.date === new Date().toISOString().split('T')[0]);
            expect(todayActivity?.timeSpent).toBe(2);
        });
    });
});
//# sourceMappingURL=progress.service.spec.js.map