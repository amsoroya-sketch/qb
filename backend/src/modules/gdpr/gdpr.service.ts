import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/middleware/audit-log.service';

export interface GDPRDataExport {
  exportMetadata: {
    userId: string;
    exportedAt: string;
    formatVersion: string;
    dataTypes: string[];
  };
  userData: {
    profile: any;
    progress: any;
    exercises: any[];
    achievements: any[];
    lessonProgress: any[];
    bookmarks: any[];
    events: any[];
  };
}

@Injectable()
export class GdprService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  /**
   * Export all user data in machine-readable format (GDPR Article 20 compliance)
   * @param userId - User ID requesting data export
   * @param ipAddress - IP address of the request
   * @returns Complete user data export
   */
  async exportUserData(userId: string, ipAddress?: string): Promise<GDPRDataExport> {
    // Audit log data export request
    await this.auditLog.logDataExport(userId, ipAddress);
    // Fetch all user data in parallel for performance
    const [user, progress, exercises, achievements, lessonProgress, bookmarks, events] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            // Explicitly exclude password
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
          take: 1000, // Limit to last 1000 events to prevent huge exports
        }),
      ]);

    if (!user) {
      throw new Error('User not found');
    }

    const dataExport: GDPRDataExport = {
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

  /**
   * Delete all user data (GDPR Article 17 - Right to Erasure)
   * @param userId - User ID requesting data deletion
   * @param ipAddress - IP address of the request
   * @returns Deletion confirmation
   */
  async deleteUserData(
    userId: string,
    ipAddress?: string,
  ): Promise<{ deleted: boolean; deletedAt: string }> {
    // Get user email before deletion for audit log
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Audit log account deletion (before actual deletion)
    await this.auditLog.logAccountDeletion(userId, user.email, ipAddress);

    // Prisma cascade delete will handle related records
    // due to onDelete: Cascade in schema
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      deleted: true,
      deletedAt: new Date().toISOString(),
    };
  }

  /**
   * Get summary of user data for deletion confirmation
   * @param userId - User ID
   * @returns Summary of data to be deleted
   */
  async getUserDataSummary(userId: string): Promise<{
    user: any;
    dataCounts: {
      exercises: number;
      achievements: number;
      lessonProgress: number;
      bookmarks: number;
      events: number;
    };
  }> {
    const [user, exerciseCount, achievementCount, lessonProgressCount, bookmarkCount, eventCount] =
      await Promise.all([
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
}
