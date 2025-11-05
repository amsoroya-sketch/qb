export type ActivityLevel = 'none' | 'low' | 'medium' | 'high';
export declare class CalendarDayItem {
    date: string;
    exercisesCompleted: number;
    lessonsCompleted: number;
    xpEarned: number;
    timeSpent: number;
    activityLevel: ActivityLevel;
}
export declare class ActivityStats {
    totalActiveDays: number;
    longestStreak: number;
    currentStreak: number;
    averagePerDay: number;
}
export declare class ActivityCalendarResponseDto {
    calendar: CalendarDayItem[];
    stats: ActivityStats;
}
