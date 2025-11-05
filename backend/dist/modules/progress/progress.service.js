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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProgressService = class ProgressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserProgress(userId) {
        const progress = await this.prisma.userProgress.findUnique({
            where: { userId },
        });
        if (!progress) {
            throw new common_1.NotFoundException('User progress not found');
        }
        const xpForNextLevel = this.calculateXPForLevel(progress.currentLevel + 1);
        const xpForCurrentLevel = this.calculateXPForLevel(progress.currentLevel);
        const xpInCurrentLevel = progress.currentXP - xpForCurrentLevel;
        const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
        const levelProgressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
        return {
            ...progress,
            averageAccuracy: Number(progress.averageAccuracy),
            xpForNextLevel,
            xpNeededForNextLevel,
            levelProgressPercentage: Math.round(levelProgressPercentage * 10) / 10,
        };
    }
    async addXP(userId, xpToAdd) {
        const currentProgress = await this.getUserProgress(userId);
        const newXP = currentProgress.currentXP + xpToAdd;
        const newLevel = this.calculateLevelFromXP(newXP);
        const leveledUp = newLevel > currentProgress.currentLevel;
        const updatedProgress = await this.prisma.userProgress.update({
            where: { userId },
            data: {
                currentXP: newXP,
                currentLevel: newLevel,
            },
        });
        return {
            ...updatedProgress,
            leveledUp,
            previousLevel: currentProgress.currentLevel,
            xpAdded: xpToAdd,
        };
    }
    async updateStreak(userId) {
        const progress = await this.prisma.userProgress.findUnique({
            where: { userId },
        });
        if (!progress) {
            throw new common_1.NotFoundException('User progress not found');
        }
        const now = new Date();
        const lastActive = progress.lastActiveDate;
        if (!lastActive) {
            return this.prisma.userProgress.update({
                where: { userId },
                data: {
                    currentStreak: 1,
                    longestStreak: Math.max(progress.longestStreak, 1),
                    lastActiveDate: now,
                },
            });
        }
        const daysDiff = this.getDaysDifference(lastActive, now);
        let newStreak = progress.currentStreak;
        let longestStreak = progress.longestStreak;
        if (daysDiff === 0) {
            return progress;
        }
        else if (daysDiff === 1) {
            newStreak += 1;
            longestStreak = Math.max(longestStreak, newStreak);
        }
        else {
            newStreak = 1;
        }
        return this.prisma.userProgress.update({
            where: { userId },
            data: {
                currentStreak: newStreak,
                longestStreak,
                lastActiveDate: now,
            },
        });
    }
    async getLessonProgress(userId) {
        const lessonProgress = await this.prisma.userLessonProgress.findMany({
            where: { userId },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        titleArabic: true,
                        track: true,
                        stage: true,
                        difficulty: true,
                        xpReward: true,
                    },
                },
            },
            orderBy: [
                { lesson: { track: 'asc' } },
                { lesson: { stage: 'asc' } },
                { lesson: { order: 'asc' } },
            ],
        });
        return lessonProgress;
    }
    async getAchievementProgress(userId) {
        const userAchievements = await this.prisma.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
            orderBy: { unlockedAt: 'desc' },
        });
        const allAchievements = await this.prisma.achievement.findMany({
            orderBy: { xpReward: 'asc' },
        });
        const unlocked = userAchievements.map((ua) => ua.achievement);
        const locked = allAchievements.filter((a) => !unlocked.find((u) => u.id === a.id));
        return {
            unlocked,
            locked,
            totalUnlocked: unlocked.length,
            totalAchievements: allAchievements.length,
            completionPercentage: (unlocked.length / allAchievements.length) * 100,
        };
    }
    async getDashboardStats(userId) {
        const [progress, lessonProgress, , achievements] = await Promise.all([
            this.getUserProgress(userId),
            this.prisma.userLessonProgress.count({ where: { userId, status: 'COMPLETED' } }),
            this.prisma.userExercise.count({ where: { userId, isCorrect: true } }),
            this.prisma.userAchievement.count({ where: { userId } }),
        ]);
        const recentLessons = await this.prisma.userLessonProgress.findMany({
            where: { userId },
            include: {
                lesson: {
                    select: { title: true, titleArabic: true, track: true },
                },
            },
            orderBy: { startedAt: 'desc' },
            take: 5,
        });
        const totalExercises = await this.prisma.userExercise.count({ where: { userId } });
        const correctExercises = await this.prisma.userExercise.count({
            where: { userId, isCorrect: true },
        });
        const accuracy = totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;
        return {
            currentLevel: progress.currentLevel,
            currentXP: progress.currentXP,
            xpForNextLevel: progress.xpForNextLevel,
            levelProgress: progress.levelProgressPercentage,
            currentStreak: progress.currentStreak,
            longestStreak: progress.longestStreak,
            lessonsCompleted: lessonProgress,
            exercisesCompleted: correctExercises,
            achievementsUnlocked: achievements,
            accuracy: Math.round(accuracy * 10) / 10,
            totalTimeSpent: progress.totalTimeSpent,
            recentActivity: recentLessons,
        };
    }
    async getAnalytics(userId) {
        const progress = await this.getUserProgress(userId);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const exercises = await this.prisma.userExercise.findMany({
            where: {
                userId,
                completedAt: { gte: thirtyDaysAgo },
            },
            orderBy: { completedAt: 'asc' },
            select: {
                xpEarned: true,
                completedAt: true,
            },
        });
        const lessonCompletions = await this.prisma.userLessonProgress.findMany({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: thirtyDaysAgo },
            },
            orderBy: { completedAt: 'asc' },
            select: {
                completedAt: true,
                lesson: {
                    select: { xpReward: true },
                },
            },
        });
        const cumulativeXP = progress.currentXP;
        const totalXpGained = exercises.reduce((sum, e) => sum + e.xpEarned, 0) +
            lessonCompletions.reduce((sum, lc) => sum + lc.lesson.xpReward, 0);
        const startingXP = cumulativeXP - totalXpGained;
        const xpHistory = [];
        let currentXP = startingXP;
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayExercises = exercises.filter((e) => e.completedAt.toISOString().split('T')[0] === dateStr);
            const dayLessons = lessonCompletions.filter((lc) => lc.completedAt && lc.completedAt.toISOString().split('T')[0] === dateStr);
            const dayXP = dayExercises.reduce((sum, e) => sum + e.xpEarned, 0) +
                dayLessons.reduce((sum, lc) => sum + lc.lesson.xpReward, 0);
            currentXP += dayXP;
            xpHistory.push({
                date: dateStr,
                xp: currentXP,
                level: this.calculateLevelFromXP(currentXP),
            });
        }
        const maxLevel = progress.currentLevel + 5;
        const levelMilestones = [];
        for (let level = 1; level <= maxLevel; level++) {
            const xpRequired = this.calculateXPForLevel(level);
            let achievedDate = null;
            if (level <= progress.currentLevel) {
                const milestone = xpHistory.find((h) => h.level >= level);
                achievedDate = milestone ? new Date(milestone.date).toISOString() : null;
            }
            levelMilestones.push({
                level,
                xpRequired,
                achievedDate,
            });
        }
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const twoWeeksAgo = new Date(now);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const currentWeekExercises = await this.prisma.userExercise.findMany({
            where: {
                userId,
                completedAt: { gte: oneWeekAgo },
            },
            select: { xpEarned: true },
        });
        const currentWeekLessons = await this.prisma.userLessonProgress.count({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: oneWeekAgo },
            },
        });
        const currentWeekXP = currentWeekExercises.reduce((sum, e) => sum + e.xpEarned, 0);
        const lastWeekExercises = await this.prisma.userExercise.findMany({
            where: {
                userId,
                completedAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
            },
            select: { xpEarned: true },
        });
        const lastWeekLessons = await this.prisma.userLessonProgress.count({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
            },
        });
        const lastWeekXP = lastWeekExercises.reduce((sum, e) => sum + e.xpEarned, 0);
        const change = lastWeekXP === 0 ? 100 : ((currentWeekXP - lastWeekXP) / lastWeekXP) * 100;
        return {
            xpHistory,
            levelMilestones,
            weeklyStats: {
                currentWeek: {
                    xpGained: currentWeekXP,
                    lessonsCompleted: currentWeekLessons,
                },
                lastWeek: {
                    xpGained: lastWeekXP,
                    lessonsCompleted: lastWeekLessons,
                },
                change: Math.round(change * 10) / 10,
            },
        };
    }
    async getTopicMastery(userId) {
        const userExercises = await this.prisma.userExercise.findMany({
            where: { userId },
            include: {
                exercise: {
                    include: {
                        lesson: {
                            select: {
                                grammarTopic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { completedAt: 'desc' },
        });
        if (userExercises.length === 0) {
            return {
                topics: [],
                overallMastery: 0,
                strongestTopic: null,
                weakestTopic: null,
            };
        }
        const topicMap = new Map();
        for (const ue of userExercises) {
            const topic = ue.exercise.lesson.grammarTopic;
            if (!topicMap.has(topic)) {
                topicMap.set(topic, {
                    total: 0,
                    correct: 0,
                    lastPracticed: ue.completedAt,
                });
            }
            const topicData = topicMap.get(topic);
            topicData.total += 1;
            if (ue.isCorrect) {
                topicData.correct += 1;
            }
            if (ue.completedAt > topicData.lastPracticed) {
                topicData.lastPracticed = ue.completedAt;
            }
        }
        const topics = [];
        let totalAccuracy = 0;
        for (const [topic, data] of topicMap.entries()) {
            const accuracy = (data.correct / data.total) * 100;
            totalAccuracy += accuracy;
            let level;
            if (accuracy >= 80) {
                level = 'advanced';
            }
            else if (accuracy >= 60) {
                level = 'intermediate';
            }
            else {
                level = 'beginner';
            }
            topics.push({
                topic,
                totalExercises: data.total,
                correctAnswers: data.correct,
                accuracy: Math.round(accuracy * 10) / 10,
                lastPracticed: data.lastPracticed.toISOString(),
                level,
            });
        }
        topics.sort((a, b) => b.accuracy - a.accuracy);
        const overallMastery = totalAccuracy / topics.length;
        const strongestTopic = topics.length > 0 ? topics[0].topic : null;
        const weakestTopic = topics.length > 0 ? topics[topics.length - 1].topic : null;
        return {
            topics,
            overallMastery: Math.round(overallMastery * 10) / 10,
            strongestTopic,
            weakestTopic,
        };
    }
    async getActivityCalendar(userId, days = 365) {
        if (days < 1 || days > 730) {
            days = 365;
        }
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const exercises = await this.prisma.userExercise.findMany({
            where: {
                userId,
                completedAt: { gte: startDate },
            },
            select: {
                completedAt: true,
                xpEarned: true,
                timeSpent: true,
                isCorrect: true,
            },
        });
        const lessonCompletions = await this.prisma.userLessonProgress.findMany({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: startDate },
            },
            select: {
                completedAt: true,
                timeSpent: true,
                lesson: {
                    select: { xpReward: true },
                },
            },
        });
        const activityMap = new Map();
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            activityMap.set(dateStr, {
                exercisesCompleted: 0,
                lessonsCompleted: 0,
                xpEarned: 0,
                timeSpent: 0,
            });
        }
        for (const exercise of exercises) {
            const dateStr = exercise.completedAt.toISOString().split('T')[0];
            if (!activityMap.has(dateStr))
                continue;
            const dayData = activityMap.get(dateStr);
            dayData.exercisesCompleted += 1;
            dayData.xpEarned += exercise.xpEarned;
            dayData.timeSpent += exercise.timeSpent;
        }
        for (const lesson of lessonCompletions) {
            if (!lesson.completedAt)
                continue;
            const dateStr = lesson.completedAt.toISOString().split('T')[0];
            if (!activityMap.has(dateStr))
                continue;
            const dayData = activityMap.get(dateStr);
            dayData.lessonsCompleted += 1;
            dayData.xpEarned += lesson.lesson.xpReward;
            dayData.timeSpent += lesson.timeSpent;
        }
        const calendar = [];
        const dates = Array.from(activityMap.keys()).sort();
        for (const date of dates) {
            const data = activityMap.get(date);
            let activityLevel;
            if (data.xpEarned === 0) {
                activityLevel = 'none';
            }
            else if (data.xpEarned <= 50) {
                activityLevel = 'low';
            }
            else if (data.xpEarned <= 150) {
                activityLevel = 'medium';
            }
            else {
                activityLevel = 'high';
            }
            calendar.push({
                date,
                exercisesCompleted: data.exercisesCompleted,
                lessonsCompleted: data.lessonsCompleted,
                xpEarned: data.xpEarned,
                timeSpent: Math.round(data.timeSpent / 60),
                activityLevel,
            });
        }
        const activeDays = calendar.filter((d) => d.xpEarned > 0);
        const totalActiveDays = activeDays.length;
        const progress = await this.getUserProgress(userId);
        let longestStreak = 0;
        let currentStreak = 0;
        const sortedDates = [...dates].sort().reverse();
        for (let i = 0; i < sortedDates.length; i++) {
            const date = sortedDates[i];
            const data = activityMap.get(date);
            if (data.xpEarned > 0) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            }
            else {
                currentStreak = 0;
            }
        }
        const totalXP = activeDays.reduce((sum, d) => sum + d.xpEarned, 0);
        const averagePerDay = totalActiveDays > 0 ? totalXP / totalActiveDays : 0;
        return {
            calendar,
            stats: {
                totalActiveDays,
                longestStreak,
                currentStreak: progress.currentStreak,
                averagePerDay: Math.round(averagePerDay * 10) / 10,
            },
        };
    }
    calculateXPForLevel(level) {
        if (level === 1)
            return 0;
        return Math.floor(100 * level * Math.pow(1.5, level - 2));
    }
    calculateLevelFromXP(xp) {
        let level = 1;
        while (this.calculateXPForLevel(level + 1) <= xp) {
            level++;
        }
        return level;
    }
    getDaysDifference(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
        return diffDays;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map