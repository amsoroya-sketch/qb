"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gdpr_service_1 = require("./gdpr.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_log_service_1 = require("../../common/middleware/audit-log.service");
describe('GdprService', () => {
    let service;
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
        userProgress: {
            findUnique: jest.fn(),
        },
        userExercise: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userAchievement: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userLessonProgress: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        bookmark: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userEvent: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    };
    const mockAuditLogService = {
        logDataExport: jest.fn(),
        logAccountDeletion: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                gdpr_service_1.GdprService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: audit_log_service_1.AuditLogService,
                    useValue: mockAuditLogService,
                },
            ],
        }).compile();
        service = module.get(gdpr_service_1.GdprService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('exportUserData', () => {
        it('should export complete user data in GDPR-compliant format', async () => {
            const userId = 'user-1';
            const ipAddress = '192.168.1.1';
            const mockUser = {
                id: userId,
                email: 'user@example.com',
                name: 'Test User',
                role: 'STUDENT',
                createdAt: new Date('2025-01-01'),
                updatedAt: new Date('2025-11-01'),
            };
            const mockProgress = {
                id: 'progress-1',
                userId,
                currentXP: 500,
                currentLevel: 3,
                currentStreak: 5,
                longestStreak: 10,
                lessonsCompleted: 10,
                exercisesCompleted: 50,
                totalTimeSpent: 3600,
                averageAccuracy: 85,
            };
            const mockExercises = [
                {
                    id: 'user-exercise-1',
                    userId,
                    exerciseId: 'exercise-1',
                    userAnswer: 'verb',
                    isCorrect: true,
                    accuracy: 100,
                    timeSpent: 30,
                    xpEarned: 10,
                    attemptNumber: 1,
                    completedAt: new Date('2025-11-01'),
                    exercise: {
                        title: 'Verb Identification',
                        type: 'MULTIPLE_CHOICE',
                        question: 'Identify the verb',
                    },
                },
            ];
            const mockAchievements = [
                {
                    id: 'user-achievement-1',
                    userId,
                    achievementId: 'achievement-1',
                    unlockedAt: new Date('2025-11-01'),
                    achievement: {
                        name: 'First Steps',
                        nameArabic: 'الخطوات الأولى',
                        description: 'Complete first lesson',
                        category: 'learning',
                        xpReward: 25,
                    },
                },
            ];
            const mockLessonProgress = [
                {
                    id: 'lesson-progress-1',
                    userId,
                    lessonId: 'lesson-1',
                    status: 'COMPLETED',
                    timeSpent: 900,
                    startedAt: new Date('2025-10-30'),
                    completedAt: new Date('2025-10-30'),
                    lesson: {
                        title: 'Introduction to Nouns',
                        titleArabic: 'مقدمة في الأسماء',
                        track: 'A',
                        stage: 1,
                        grammarTopic: 'nouns',
                    },
                },
            ];
            const mockBookmarks = [
                {
                    id: 'bookmark-1',
                    userId,
                    verseId: 'verse-1',
                    notes: 'Beautiful verse',
                    createdAt: new Date('2025-10-25'),
                    verse: {
                        surahNumber: 1,
                        verseNumber: 1,
                        textArabic: 'بِسْمِ ٱللَّهِ',
                        translation: 'In the name of Allah',
                    },
                },
            ];
            const mockEvents = [
                {
                    id: 'event-1',
                    userId,
                    eventType: 'lesson_started',
                    timestamp: new Date('2025-11-01'),
                    metadata: { lessonId: 'lesson-1' },
                    accuracy: null,
                    timeSpent: null,
                    xpEarned: null,
                },
            ];
            mockAuditLogService.logDataExport.mockResolvedValue(undefined);
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockExercises);
            mockPrismaService.userAchievement.findMany.mockResolvedValue(mockAchievements);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue(mockLessonProgress);
            mockPrismaService.bookmark.findMany.mockResolvedValue(mockBookmarks);
            mockPrismaService.userEvent.findMany.mockResolvedValue(mockEvents);
            const result = await service.exportUserData(userId, ipAddress);
            expect(mockAuditLogService.logDataExport).toHaveBeenCalledWith(userId, ipAddress);
            expect(result.exportMetadata).toBeDefined();
            expect(result.exportMetadata.userId).toBe(userId);
            expect(result.exportMetadata.formatVersion).toBe('1.0');
            expect(result.exportMetadata.dataTypes).toContain('profile');
            expect(result.exportMetadata.dataTypes).toContain('progress');
            expect(result.exportMetadata.dataTypes).toContain('exercises');
            expect(result.userData.profile).toEqual(mockUser);
            expect(result.userData.progress).toEqual(mockProgress);
            expect(result.userData.exercises).toHaveLength(1);
            expect(result.userData.achievements).toHaveLength(1);
            expect(result.userData.lessonProgress).toHaveLength(1);
            expect(result.userData.bookmarks).toHaveLength(1);
            expect(result.userData.events).toHaveLength(1);
        });
        it('should exclude password from user data export', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'user@example.com',
                name: 'Test User',
                role: 'STUDENT',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockAuditLogService.logDataExport.mockResolvedValue(undefined);
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.bookmark.findMany.mockResolvedValue([]);
            mockPrismaService.userEvent.findMany.mockResolvedValue([]);
            const result = await service.exportUserData('user-1');
            expect(result.userData.profile).not.toHaveProperty('password');
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                select: expect.not.objectContaining({ password: expect.anything() }),
            });
        });
        it('should limit events to last 1000 entries', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'user@example.com',
                name: 'Test User',
                role: 'STUDENT',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockAuditLogService.logDataExport.mockResolvedValue(undefined);
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.bookmark.findMany.mockResolvedValue([]);
            mockPrismaService.userEvent.findMany.mockResolvedValue([]);
            await service.exportUserData('user-1');
            expect(mockPrismaService.userEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({
                take: 1000,
            }));
        });
        it('should throw error if user not found', async () => {
            mockAuditLogService.logDataExport.mockResolvedValue(undefined);
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.bookmark.findMany.mockResolvedValue([]);
            mockPrismaService.userEvent.findMany.mockResolvedValue([]);
            await expect(service.exportUserData('nonexistent')).rejects.toThrow('User not found');
        });
        it('should handle null progress gracefully', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'user@example.com',
                name: 'Test User',
                role: 'STUDENT',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockAuditLogService.logDataExport.mockResolvedValue(undefined);
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            mockPrismaService.userAchievement.findMany.mockResolvedValue([]);
            mockPrismaService.userLessonProgress.findMany.mockResolvedValue([]);
            mockPrismaService.bookmark.findMany.mockResolvedValue([]);
            mockPrismaService.userEvent.findMany.mockResolvedValue([]);
            const result = await service.exportUserData('user-1');
            expect(result.userData.progress).toBeNull();
        });
    });
    describe('deleteUserData', () => {
        it('should delete user and all related data', async () => {
            const userId = 'user-1';
            const ipAddress = '192.168.1.1';
            const mockUser = {
                email: 'user@example.com',
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockAuditLogService.logAccountDeletion.mockResolvedValue(undefined);
            mockPrismaService.user.delete.mockResolvedValue({ id: userId });
            const result = await service.deleteUserData(userId, ipAddress);
            expect(mockAuditLogService.logAccountDeletion).toHaveBeenCalledWith(userId, 'user@example.com', ipAddress);
            expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
                where: { id: userId },
            });
            expect(result.deleted).toBe(true);
            expect(result.deletedAt).toBeDefined();
        });
        it('should throw error if user not found for deletion', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.deleteUserData('nonexistent')).rejects.toThrow('User not found');
            expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
        });
        it('should audit log deletion before actually deleting', async () => {
            const mockUser = { email: 'user@example.com' };
            const callOrder = [];
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockAuditLogService.logAccountDeletion.mockImplementation(() => {
                callOrder.push('audit');
                return Promise.resolve();
            });
            mockPrismaService.user.delete.mockImplementation(() => {
                callOrder.push('delete');
                return Promise.resolve({ id: 'user-1' });
            });
            await service.deleteUserData('user-1', '192.168.1.1');
            expect(callOrder).toEqual(['audit', 'delete']);
        });
    });
    describe('getUserDataSummary', () => {
        it('should return user data summary with counts', async () => {
            const userId = 'user-1';
            const mockUser = {
                id: userId,
                email: 'user@example.com',
                name: 'Test User',
                createdAt: new Date('2025-01-01'),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.userExercise.count.mockResolvedValue(50);
            mockPrismaService.userAchievement.count.mockResolvedValue(5);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(10);
            mockPrismaService.bookmark.count.mockResolvedValue(3);
            mockPrismaService.userEvent.count.mockResolvedValue(200);
            const result = await service.getUserDataSummary(userId);
            expect(result.user).toEqual(mockUser);
            expect(result.dataCounts.exercises).toBe(50);
            expect(result.dataCounts.achievements).toBe(5);
            expect(result.dataCounts.lessonProgress).toBe(10);
            expect(result.dataCounts.bookmarks).toBe(3);
            expect(result.dataCounts.events).toBe(200);
        });
        it('should throw error if user not found for summary', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userAchievement.count.mockResolvedValue(0);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
            mockPrismaService.bookmark.count.mockResolvedValue(0);
            mockPrismaService.userEvent.count.mockResolvedValue(0);
            await expect(service.getUserDataSummary('nonexistent')).rejects.toThrow('User not found');
        });
        it('should handle user with no data correctly', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'newuser@example.com',
                name: 'New User',
                createdAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userAchievement.count.mockResolvedValue(0);
            mockPrismaService.userLessonProgress.count.mockResolvedValue(0);
            mockPrismaService.bookmark.count.mockResolvedValue(0);
            mockPrismaService.userEvent.count.mockResolvedValue(0);
            const result = await service.getUserDataSummary('user-1');
            expect(result.dataCounts.exercises).toBe(0);
            expect(result.dataCounts.achievements).toBe(0);
            expect(result.dataCounts.lessonProgress).toBe(0);
            expect(result.dataCounts.bookmarks).toBe(0);
            expect(result.dataCounts.events).toBe(0);
        });
    });
});
//# sourceMappingURL=gdpr.service.spec.js.map