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
exports.GdprService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_log_service_1 = require("../../common/middleware/audit-log.service");
let GdprService = class GdprService {
    constructor(prisma, auditLog) {
        this.prisma = prisma;
        this.auditLog = auditLog;
    }
    async exportUserData(userId, ipAddress) {
        await this.auditLog.logDataExport(userId, ipAddress);
        const [user, progress, exercises, achievements, lessonProgress, bookmarks, events] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.userProgress.findUnique({
                where: { userId },
            }),
            this.prisma.userExercise.findMany({
                where: { userId },
                include: {
                    exercise: {
                        select: {
                            title: true,
                            type: true,
                            question: true,
                        },
                    },
                },
                orderBy: { completedAt: 'desc' },
            }),
            this.prisma.userAchievement.findMany({
                where: { userId },
                include: {
                    achievement: {
                        select: {
                            name: true,
                            nameArabic: true,
                            description: true,
                            category: true,
                            xpReward: true,
                        },
                    },
                },
                orderBy: { unlockedAt: 'desc' },
            }),
            this.prisma.userLessonProgress.findMany({
                where: { userId },
                include: {
                    lesson: {
                        select: {
                            title: true,
                            titleArabic: true,
                            track: true,
                            stage: true,
                            grammarTopic: true,
                        },
                    },
                },
                orderBy: { startedAt: 'desc' },
            }),
            this.prisma.bookmark.findMany({
                where: { userId },
                include: {
                    verse: {
                        select: {
                            surahNumber: true,
                            verseNumber: true,
                            textArabic: true,
                            translation: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.userEvent.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: 1000,
            }),
        ]);
        if (!user) {
            throw new Error('User not found');
        }
        const dataExport = {
            exportMetadata: {
                userId,
                exportedAt: new Date().toISOString(),
                formatVersion: '1.0',
                dataTypes: [
                    'profile',
                    'progress',
                    'exercises',
                    'achievements',
                    'lessonProgress',
                    'bookmarks',
                    'events',
                ],
            },
            userData: {
                profile: user,
                progress: progress || null,
                exercises: exercises.map((ex) => ({
                    exerciseTitle: ex.exercise.title,
                    exerciseType: ex.exercise.type,
                    userAnswer: ex.userAnswer,
                    isCorrect: ex.isCorrect,
                    accuracy: ex.accuracy.toString(),
                    timeSpent: ex.timeSpent,
                    xpEarned: ex.xpEarned,
                    attemptNumber: ex.attemptNumber,
                    completedAt: ex.completedAt.toISOString(),
                })),
                achievements: achievements.map((ach) => ({
                    achievementName: ach.achievement.name,
                    achievementNameArabic: ach.achievement.nameArabic,
                    description: ach.achievement.description,
                    category: ach.achievement.category,
                    xpReward: ach.achievement.xpReward,
                    unlockedAt: ach.unlockedAt.toISOString(),
                })),
                lessonProgress: lessonProgress.map((lp) => ({
                    lessonTitle: lp.lesson.title,
                    lessonTitleArabic: lp.lesson.titleArabic,
                    track: lp.lesson.track,
                    stage: lp.lesson.stage,
                    grammarTopic: lp.lesson.grammarTopic,
                    status: lp.status,
                    timeSpent: lp.timeSpent,
                    startedAt: lp.startedAt?.toISOString() || null,
                    completedAt: lp.completedAt?.toISOString() || null,
                })),
                bookmarks: bookmarks.map((bm) => ({
                    surahNumber: bm.verse.surahNumber,
                    verseNumber: bm.verse.verseNumber,
                    arabicText: bm.verse.textArabic,
                    translation: bm.verse.translation,
                    notes: bm.notes,
                    createdAt: bm.createdAt.toISOString(),
                })),
                events: events.map((ev) => ({
                    eventType: ev.eventType,
                    timestamp: ev.timestamp.toISOString(),
                    metadata: ev.metadata,
                    accuracy: ev.accuracy?.toString() || null,
                    timeSpent: ev.timeSpent,
                    xpEarned: ev.xpEarned,
                })),
            },
        };
        return dataExport;
    }
    async deleteUserData(userId, ipAddress) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        await this.auditLog.logAccountDeletion(userId, user.email, ipAddress);
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return {
            deleted: true,
            deletedAt: new Date().toISOString(),
        };
    }
    async getUserDataSummary(userId) {
        const [user, exerciseCount, achievementCount, lessonProgressCount, bookmarkCount, eventCount] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            }),
            this.prisma.userExercise.count({ where: { userId } }),
            this.prisma.userAchievement.count({ where: { userId } }),
            this.prisma.userLessonProgress.count({ where: { userId } }),
            this.prisma.bookmark.count({ where: { userId } }),
            this.prisma.userEvent.count({ where: { userId } }),
        ]);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            user,
            dataCounts: {
                exercises: exerciseCount,
                achievements: achievementCount,
                lessonProgress: lessonProgressCount,
                bookmarks: bookmarkCount,
                events: eventCount,
            },
        };
    }
};
exports.GdprService = GdprService;
exports.GdprService = GdprService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], GdprService);
//# sourceMappingURL=gdpr.service.js.map