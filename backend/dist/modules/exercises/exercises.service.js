"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
let ExercisesService = class ExercisesService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
        this.EXERCISE_CACHE_TTL = 1800;
        this.LIST_CACHE_TTL = 300;
    }
    async findAll(query) {
        const { page = 1, limit = 50, lessonId, type, difficulty } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (lessonId)
            where.lessonId = lessonId;
        if (type)
            where.type = type;
        if (difficulty)
            where.difficulty = difficulty;
        const [exercises, total] = await Promise.all([
            this.prisma.exercise.findMany({
                where,
                skip,
                take: limit,
                orderBy: { order: 'asc' },
                include: {
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                            titleArabic: true,
                            track: true,
                            stage: true,
                        },
                    },
                },
            }),
            this.prisma.exercise.count({ where }),
        ]);
        return {
            data: exercises,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const cacheKey = `exercise:${id}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const exercise = await this.prisma.exercise.findUnique({
            where: { id },
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
        if (!exercise) {
            throw new common_1.NotFoundException(`Exercise with ID ${id} not found`);
        }
        await this.cache.set(cacheKey, JSON.stringify(exercise), this.EXERCISE_CACHE_TTL);
        return exercise;
    }
    async findByLesson(lessonId) {
        const cacheKey = `exercises:lesson:${lessonId}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const exercises = await this.prisma.exercise.findMany({
            where: { lessonId },
            orderBy: { order: 'asc' },
        });
        await this.cache.set(cacheKey, JSON.stringify(exercises), this.LIST_CACHE_TTL);
        return exercises;
    }
    async submit(userId, exerciseId, dto) {
        const exercise = await this.findOne(exerciseId);
        const isCorrect = this.checkAnswer(exercise, dto.userAnswer);
        const xpEarned = isCorrect ? exercise.xpReward : 0;
        const timeBonus = dto.timeSpent < 30 && isCorrect ? Math.floor(exercise.xpReward * 0.2) : 0;
        const totalXP = xpEarned + timeBonus;
        const previousAttempts = await this.prisma.userExercise.count({
            where: {
                userId,
                exerciseId,
            },
        });
        const accuracy = isCorrect ? 100 : 0;
        const userExercise = await this.prisma.userExercise.create({
            data: {
                userId,
                exerciseId,
                userAnswer: dto.userAnswer,
                isCorrect,
                accuracy,
                attemptNumber: previousAttempts + 1,
                timeSpent: dto.timeSpent,
                xpEarned: totalXP,
            },
        });
        if (isCorrect) {
            await this.prisma.userProgress.update({
                where: { userId },
                data: {
                    exercisesCompleted: { increment: 1 },
                    currentXP: { increment: totalXP },
                    totalTimeSpent: { increment: dto.timeSpent },
                },
            });
        }
        return {
            ...userExercise,
            correctAnswer: exercise.correctAnswer,
            explanation: exercise.explanation,
            isCorrect,
            xpEarned: totalXP,
            timeBonus,
        };
    }
    async getUserExercises(userId, exerciseId) {
        const attempts = await this.prisma.userExercise.findMany({
            where: {
                userId,
                exerciseId,
            },
            orderBy: { completedAt: 'desc' },
        });
        return attempts;
    }
    async getExerciseStats(exerciseId) {
        const attempts = await this.prisma.userExercise.findMany({
            where: { exerciseId },
        });
        const totalAttempts = attempts.length;
        const correctAttempts = attempts.filter((a) => a.isCorrect).length;
        const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
        const avgTimeSpent = totalAttempts > 0 ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts : 0;
        return {
            totalAttempts,
            correctAttempts,
            accuracy: Math.round(accuracy * 10) / 10,
            avgTimeSpent: Math.round(avgTimeSpent),
        };
    }
    checkAnswer(exercise, userAnswer) {
        const correct = exercise.correctAnswer.trim().toLowerCase();
        const user = userAnswer.trim().toLowerCase();
        if (exercise.type === 'MULTIPLE_CHOICE') {
            return correct === user;
        }
        if (exercise.type === 'TRUE_FALSE') {
            return correct === user;
        }
        if (exercise.type === 'FILL_IN_BLANK') {
            const normalizedCorrect = this.normalizArabic(correct);
            const normalizedUser = this.normalizArabic(user);
            return normalizedCorrect === normalizedUser;
        }
        if (exercise.type === 'WORD_ANALYSIS') {
            try {
                const correctObj = JSON.parse(exercise.correctAnswer);
                const userObj = JSON.parse(userAnswer);
                return (correctObj.pos === userObj.pos &&
                    correctObj.gender === userObj.gender &&
                    correctObj.number === userObj.number &&
                    correctObj.definiteness === userObj.definiteness &&
                    correctObj.case === userObj.case);
            }
            catch (e) {
                return false;
            }
        }
        return correct === user;
    }
    normalizArabic(text) {
        return text
            .replace(/[ً-ْ]/g, '')
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .trim();
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map