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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LessonsService = class LessonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const lesson = await this.prisma.lesson.create({
            data: dto,
        });
        return lesson;
    }
    async findAll(query) {
        const { page = 1, limit = 20, track, stage, difficulty } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (track)
            where.track = track;
        if (stage)
            where.stage = stage;
        if (difficulty)
            where.difficulty = difficulty;
        const [lessons, total] = await Promise.all([
            this.prisma.lesson.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ stage: 'asc' }, { order: 'asc' }],
                include: {
                    _count: {
                        select: { exercises: true },
                    },
                },
            }),
            this.prisma.lesson.count({ where }),
        ]);
        return {
            data: lessons,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
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
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async update(id, dto) {
        await this.findOne(id);
        const lesson = await this.prisma.lesson.update({
            where: { id },
            data: dto,
        });
        return lesson;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.lesson.delete({
            where: { id },
        });
        return { message: 'Lesson deleted successfully' };
    }
    async getUserLessonProgress(userId, lessonId) {
        let progress = await this.prisma.userLessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
        });
        if (!progress) {
            progress = await this.prisma.userLessonProgress.create({
                data: {
                    userId,
                    lessonId,
                    status: 'NOT_STARTED',
                },
            });
        }
        return progress;
    }
    async startLesson(userId, lessonId) {
        await this.findOne(lessonId);
        const progress = await this.prisma.userLessonProgress.upsert({
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
                startedAt: new Date(),
            },
            update: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
            },
        });
        return progress;
    }
    async completeLesson(userId, lessonId, timeSpent) {
        const lesson = await this.findOne(lessonId);
        const progress = await this.prisma.userLessonProgress.update({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                timeSpent,
            },
        });
        await this.prisma.userProgress.update({
            where: { userId },
            data: {
                lessonsCompleted: {
                    increment: 1,
                },
                currentXP: {
                    increment: lesson.xpReward,
                },
                totalTimeSpent: {
                    increment: timeSpent,
                },
            },
        });
        return progress;
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map