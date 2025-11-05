export declare class UserProgressResponseDto {
    id: string;
    userId: string;
    currentXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date | null;
    lessonsCompleted: number;
    exercisesCompleted: number;
    totalTimeSpent: number;
    averageAccuracy: number;
    xpForNextLevel: number;
    xpNeededForNextLevel: number;
    levelProgressPercentage: number;
    createdAt: Date;
    updatedAt: Date;
}
