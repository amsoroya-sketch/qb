export declare class XpHistoryItem {
    date: string;
    xp: number;
    level: number;
}
export declare class LevelMilestone {
    level: number;
    xpRequired: number;
    achievedDate: string | null;
}
export declare class WeeklyStatsItem {
    xpGained: number;
    lessonsCompleted: number;
}
export declare class WeeklyStatsComparison {
    currentWeek: WeeklyStatsItem;
    lastWeek: WeeklyStatsItem;
    change: number;
}
export declare class AnalyticsResponseDto {
    xpHistory: XpHistoryItem[];
    levelMilestones: LevelMilestone[];
    weeklyStats: WeeklyStatsComparison;
}
