"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const exercises_service_1 = require("./exercises.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const common_1 = require("@nestjs/common");
describe('ExercisesService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        exercise: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
        },
        userExercise: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userProgress: {
            update: jest.fn(),
        },
    };
    const mockCacheService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        delPattern: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                exercises_service_1.ExercisesService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: cache_service_1.CacheService,
                    useValue: mockCacheService,
                },
            ],
        }).compile();
        service = module.get(exercises_service_1.ExercisesService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
        mockCacheService.get.mockResolvedValue(null);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        it('should return paginated exercises', async () => {
            const mockExercises = [
                {
                    id: 'exercise-1',
                    type: 'MULTIPLE_CHOICE',
                    question: 'Test question',
                    difficulty: 'BEGINNER',
                    lesson: {
                        id: 'lesson-1',
                        title: 'Test Lesson',
                        titleArabic: 'درس تجريبي',
                        track: 'A',
                        stage: 1,
                    },
                },
            ];
            mockPrismaService.exercise.findMany.mockResolvedValue(mockExercises);
            mockPrismaService.exercise.count.mockResolvedValue(1);
            const result = await service.findAll({ page: 1, limit: 50 });
            expect(result.data).toEqual(mockExercises);
            expect(result.meta).toEqual({
                page: 1,
                limit: 50,
                total: 1,
                totalPages: 1,
            });
            expect(mockPrismaService.exercise.findMany).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 50,
                orderBy: { order: 'asc' },
            }));
        });
        it('should filter exercises by lessonId', async () => {
            mockPrismaService.exercise.findMany.mockResolvedValue([]);
            mockPrismaService.exercise.count.mockResolvedValue(0);
            await service.findAll({ page: 1, limit: 50, lessonId: 'lesson-1' });
            expect(mockPrismaService.exercise.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { lessonId: 'lesson-1' },
            }));
        });
        it('should filter exercises by type and difficulty', async () => {
            mockPrismaService.exercise.findMany.mockResolvedValue([]);
            mockPrismaService.exercise.count.mockResolvedValue(0);
            await service.findAll({
                page: 1,
                limit: 50,
                type: 'MULTIPLE_CHOICE',
                difficulty: 'INTERMEDIATE',
            });
            expect(mockPrismaService.exercise.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { type: 'MULTIPLE_CHOICE', difficulty: 'INTERMEDIATE' },
            }));
        });
    });
    describe('findOne', () => {
        it('should return an exercise by id', async () => {
            const mockExercise = {
                id: 'exercise-1',
                type: 'MULTIPLE_CHOICE',
                question: 'Test question',
                correctAnswer: 'A',
                lesson: {
                    id: 'lesson-1',
                    title: 'Test Lesson',
                },
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            const result = await service.findOne('exercise-1');
            expect(result).toEqual(mockExercise);
            expect(mockPrismaService.exercise.findUnique).toHaveBeenCalledWith({
                where: { id: 'exercise-1' },
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
        });
        it('should throw NotFoundException if exercise not found', async () => {
            mockPrismaService.exercise.findUnique.mockResolvedValue(null);
            await expect(service.findOne('nonexistent')).rejects.toThrow(common_1.NotFoundException);
            await expect(service.findOne('nonexistent')).rejects.toThrow('Exercise with ID nonexistent not found');
        });
    });
    describe('findByLesson', () => {
        it('should return exercises for a lesson ordered by order', async () => {
            const mockExercises = [
                {
                    id: 'exercise-1',
                    lessonId: 'lesson-1',
                    order: 1,
                    type: 'MULTIPLE_CHOICE',
                },
                {
                    id: 'exercise-2',
                    lessonId: 'lesson-1',
                    order: 2,
                    type: 'FILL_IN_BLANK',
                },
            ];
            mockPrismaService.exercise.findMany.mockResolvedValue(mockExercises);
            const result = await service.findByLesson('lesson-1');
            expect(result).toEqual(mockExercises);
            expect(mockPrismaService.exercise.findMany).toHaveBeenCalledWith({
                where: { lessonId: 'lesson-1' },
                orderBy: { order: 'asc' },
            });
        });
    });
    describe('submit', () => {
        it('should submit correct answer and award XP', async () => {
            const userId = 'user-1';
            const exerciseId = 'exercise-1';
            const submitDto = {
                userAnswer: 'A',
                timeSpent: 45,
            };
            const mockExercise = {
                id: exerciseId,
                type: 'MULTIPLE_CHOICE',
                correctAnswer: 'A',
                xpReward: 10,
                explanation: 'Test explanation',
            };
            const mockUserExercise = {
                id: 'user-exercise-1',
                userId,
                exerciseId,
                userAnswer: 'A',
                isCorrect: true,
                accuracy: 100,
                attemptNumber: 1,
                timeSpent: 45,
                xpEarned: 10,
                completedAt: new Date(),
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userExercise.create.mockResolvedValue(mockUserExercise);
            mockPrismaService.userProgress.update.mockResolvedValue({});
            const result = await service.submit(userId, exerciseId, submitDto);
            expect(result.isCorrect).toBe(true);
            expect(result.xpEarned).toBe(10);
            expect(result.timeBonus).toBe(0);
            expect(mockPrismaService.userProgress.update).toHaveBeenCalledWith({
                where: { userId },
                data: {
                    exercisesCompleted: { increment: 1 },
                    currentXP: { increment: 10 },
                    totalTimeSpent: { increment: 45 },
                },
            });
        });
        it('should award time bonus for fast completion', async () => {
            const userId = 'user-1';
            const exerciseId = 'exercise-1';
            const submitDto = {
                userAnswer: 'A',
                timeSpent: 25,
            };
            const mockExercise = {
                id: exerciseId,
                type: 'MULTIPLE_CHOICE',
                correctAnswer: 'A',
                xpReward: 10,
            };
            const mockUserExercise = {
                id: 'user-exercise-1',
                userId,
                exerciseId,
                isCorrect: true,
                xpEarned: 12,
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userExercise.create.mockResolvedValue(mockUserExercise);
            mockPrismaService.userProgress.update.mockResolvedValue({});
            const result = await service.submit(userId, exerciseId, submitDto);
            expect(result.timeBonus).toBe(2);
            expect(result.xpEarned).toBe(12);
        });
        it('should not award XP for incorrect answer', async () => {
            const userId = 'user-1';
            const exerciseId = 'exercise-1';
            const submitDto = {
                userAnswer: 'B',
                timeSpent: 45,
            };
            const mockExercise = {
                id: exerciseId,
                type: 'MULTIPLE_CHOICE',
                correctAnswer: 'A',
                xpReward: 10,
            };
            const mockUserExercise = {
                id: 'user-exercise-1',
                userId,
                exerciseId,
                isCorrect: false,
                xpEarned: 0,
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userExercise.create.mockResolvedValue(mockUserExercise);
            const result = await service.submit(userId, exerciseId, submitDto);
            expect(result.isCorrect).toBe(false);
            expect(result.xpEarned).toBe(0);
            expect(mockPrismaService.userProgress.update).not.toHaveBeenCalled();
        });
        it('should handle fill-in-blank with Arabic normalization', async () => {
            const userId = 'user-1';
            const exerciseId = 'exercise-1';
            const submitDto = {
                userAnswer: 'كِتَابٌ',
                timeSpent: 30,
            };
            const mockExercise = {
                id: exerciseId,
                type: 'FILL_IN_BLANK',
                correctAnswer: 'كتاب',
                xpReward: 15,
            };
            const mockUserExercise = {
                id: 'user-exercise-1',
                userId,
                exerciseId,
                isCorrect: true,
                xpEarned: 15,
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userExercise.create.mockResolvedValue(mockUserExercise);
            mockPrismaService.userProgress.update.mockResolvedValue({});
            const result = await service.submit(userId, exerciseId, submitDto);
            expect(result.isCorrect).toBe(true);
        });
        it('should handle word analysis with JSON comparison', async () => {
            const userId = 'user-1';
            const exerciseId = 'exercise-1';
            const submitDto = {
                userAnswer: JSON.stringify({
                    pos: 'N',
                    gender: 'M',
                    number: 'S',
                    definiteness: 'DEF',
                    case: 'NOM',
                }),
                timeSpent: 60,
            };
            const mockExercise = {
                id: exerciseId,
                type: 'WORD_ANALYSIS',
                correctAnswer: JSON.stringify({
                    pos: 'N',
                    gender: 'M',
                    number: 'S',
                    definiteness: 'DEF',
                    case: 'NOM',
                }),
                xpReward: 20,
            };
            const mockUserExercise = {
                id: 'user-exercise-1',
                userId,
                exerciseId,
                isCorrect: true,
                xpEarned: 20,
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            mockPrismaService.userExercise.count.mockResolvedValue(0);
            mockPrismaService.userExercise.create.mockResolvedValue(mockUserExercise);
            mockPrismaService.userProgress.update.mockResolvedValue({});
            const result = await service.submit(userId, exerciseId, submitDto);
            expect(result.isCorrect).toBe(true);
        });
        it('should increment attempt number for repeat attempts', async () => {
            const userId = 'user-1';
            const exerciseId = 'exercise-1';
            const submitDto = {
                userAnswer: 'A',
                timeSpent: 30,
            };
            const mockExercise = {
                id: exerciseId,
                type: 'MULTIPLE_CHOICE',
                correctAnswer: 'A',
                xpReward: 10,
            };
            mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);
            mockPrismaService.userExercise.count.mockResolvedValue(2);
            mockPrismaService.userExercise.create.mockResolvedValue({
                attemptNumber: 3,
            });
            mockPrismaService.userProgress.update.mockResolvedValue({});
            await service.submit(userId, exerciseId, submitDto);
            expect(mockPrismaService.userExercise.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    attemptNumber: 3,
                }),
            }));
        });
    });
    describe('getUserExercises', () => {
        it('should return user attempts for an exercise', async () => {
            const mockAttempts = [
                {
                    id: 'attempt-1',
                    userId: 'user-1',
                    exerciseId: 'exercise-1',
                    isCorrect: true,
                    completedAt: new Date(),
                },
                {
                    id: 'attempt-2',
                    userId: 'user-1',
                    exerciseId: 'exercise-1',
                    isCorrect: false,
                    completedAt: new Date(),
                },
            ];
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockAttempts);
            const result = await service.getUserExercises('user-1', 'exercise-1');
            expect(result).toEqual(mockAttempts);
            expect(mockPrismaService.userExercise.findMany).toHaveBeenCalledWith({
                where: {
                    userId: 'user-1',
                    exerciseId: 'exercise-1',
                },
                orderBy: { completedAt: 'desc' },
            });
        });
    });
    describe('getExerciseStats', () => {
        it('should calculate exercise statistics', async () => {
            const mockAttempts = [
                { isCorrect: true, timeSpent: 30 },
                { isCorrect: true, timeSpent: 40 },
                { isCorrect: false, timeSpent: 50 },
                { isCorrect: false, timeSpent: 60 },
            ];
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockAttempts);
            const result = await service.getExerciseStats('exercise-1');
            expect(result.totalAttempts).toBe(4);
            expect(result.correctAttempts).toBe(2);
            expect(result.accuracy).toBe(50);
            expect(result.avgTimeSpent).toBe(45);
        });
        it('should handle exercise with no attempts', async () => {
            mockPrismaService.userExercise.findMany.mockResolvedValue([]);
            const result = await service.getExerciseStats('exercise-1');
            expect(result.totalAttempts).toBe(0);
            expect(result.correctAttempts).toBe(0);
            expect(result.accuracy).toBe(0);
            expect(result.avgTimeSpent).toBe(0);
        });
        it('should round accuracy and average time correctly', async () => {
            const mockAttempts = [
                { isCorrect: true, timeSpent: 33 },
                { isCorrect: false, timeSpent: 44 },
                { isCorrect: false, timeSpent: 55 },
            ];
            mockPrismaService.userExercise.findMany.mockResolvedValue(mockAttempts);
            const result = await service.getExerciseStats('exercise-1');
            expect(result.accuracy).toBe(33.3);
            expect(result.avgTimeSpent).toBe(44);
        });
    });
});
//# sourceMappingURL=exercises.service.spec.js.map