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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackEvent(userId, eventType, eventData) {
        const event = await this.prisma.userEvent.create({
            data: {
                userId,
                eventType,
                metadata: eventData || null,
            },
        });
        return event;
    }
    async getUserAnalytics(userId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const events = await this.prisma.userEvent.findMany({
            where: {
                userId,
                timestamp: {
                    gte: since,
                },
            },
            orderBy: { timestamp: 'desc' },
        });
        const activityByDay = this.groupByDay(events);
        const eventTypeCount = this.countByEventType(events);
        const timePerDay = await this.getTimeSpentPerDay(userId, since);
        const xpOverTime = await this.getXPOverTime(userId, since);
        return {
            totalEvents: events.length,
            activityByDay,
            eventTypeBreakdown: eventTypeCount,
            timeSpentPerDay: timePerDay,
            xpGainedOverTime: xpOverTime,
        };
    }
    async getAdminAnalytics() {
        const totalUsers = await this.prisma.user.count();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await this.prisma.user.count({
            where: {
                progress: {
                    lastActiveDate: {
                        gte: thirtyDaysAgo,
                    },
                },
            },
        });
        const totalLessonsCompleted = await this.prisma.userLessonProgress.count({
            where: { status: 'COMPLETED' },
        });
        const totalExercisesCompleted = await this.prisma.userExercise.count({
            where: { isCorrect: true },
        });
        const allExercises = await this.prisma.userExercise.count();
        const correctExercises = await this.prisma.userExercise.count({
            where: { isCorrect: true },
        });
        const avgAccuracy = allExercises > 0 ? (correctExercises / allExercises) * 100 : 0;
        const userGrowth = await this.prisma.user.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });
        const popularLessons = await this.prisma.lesson.findMany({
            include: {
                _count: {
                    select: { userProgress: true },
                },
            },
            orderBy: {
                userProgress: {
                    _count: 'desc',
                },
            },
            take: 10,
        });
        const levelDistribution = await this.getUserLevelDistribution();
        return {
            overview: {
                totalUsers,
                activeUsers,
                userGrowthLast30Days: userGrowth,
                totalLessonsCompleted,
                totalExercisesCompleted,
                averageAccuracy: Math.round(avgAccuracy * 10) / 10,
            },
            popularLessons: popularLessons.map((l) => ({
                id: l.id,
                title: l.title,
                titleArabic: l.titleArabic,
                enrollments: l._count.userProgress,
            })),
            levelDistribution,
        };
    }
    async getLeaderboard(limit = 50) {
        const users = await this.prisma.user.findMany({
            where: { role: 'STUDENT' },
            include: {
                progress: true,
            },
            orderBy: {
                progress: {
                    currentXP: 'desc',
                },
            },
            take: limit,
        });
        return users
            .filter((u) => u.progress)
            .map((user, index) => ({
            rank: index + 1,
            userId: user.id,
            name: user.name,
            level: user.progress.currentLevel,
            xp: user.progress.currentXP,
            streak: user.progress.currentStreak,
            lessonsCompleted: user.progress.lessonsCompleted,
        }));
    }
    groupByDay(events) {
        const grouped = {};
        events.forEach((event) => {
            const date = event.timestamp.toISOString().split('T')[0];
            grouped[date] = (grouped[date] || 0) + 1;
        });
        return Object.entries(grouped).map(([date, count]) => ({
            date,
            count,
        }));
    }
    countByEventType(events) {
        const counts = {};
        events.forEach((event) => {
            counts[event.eventType] = (counts[event.eventType] || 0) + 1;
        });
        return Object.entries(counts).map(([eventType, count]) => ({
            eventType,
            count,
        }));
    }
    async getTimeSpentPerDay(userId, since) {
        const lessonProgress = await this.prisma.userLessonProgress.findMany({
            where: {
                userId,
                startedAt: {
                    gte: since,
                },
            },
        });
        const grouped = {};
        lessonProgress.forEach((lp) => {
            if (lp.startedAt) {
                const date = lp.startedAt.toISOString().split('T')[0];
                grouped[date] = (grouped[date] || 0) + lp.timeSpent;
            }
        });
        return Object.entries(grouped).map(([date, timeSpent]) => ({
            date,
            timeSpent: Math.round(timeSpent / 60),
        }));
    }
    async getXPOverTime(userId, since) {
        const exercises = await this.prisma.userExercise.findMany({
            where: {
                userId,
                completedAt: {
                    gte: since,
                },
            },
            orderBy: { completedAt: 'asc' },
        });
        const grouped = {};
        exercises.forEach((ex) => {
            const date = ex.completedAt.toISOString().split('T')[0];
            grouped[date] = (grouped[date] || 0) + ex.xpEarned;
        });
        return Object.entries(grouped).map(([date, xp]) => ({
            date,
            xp,
        }));
    }
    async getUserLevelDistribution() {
        const users = await this.prisma.userProgress.groupBy({
            by: ['currentLevel'],
            _count: {
                currentLevel: true,
            },
            orderBy: {
                currentLevel: 'asc',
            },
        });
        return users.map((u) => ({
            level: u.currentLevel,
            count: u._count.currentLevel,
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map