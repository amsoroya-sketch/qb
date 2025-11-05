import { ApiProperty } from '@nestjs/swagger';

export type ActivityLevel = 'none' | 'low' | 'medium' | 'high';

export class CalendarDayItem {
  @ApiProperty({ description: 'Date in ISO format (YYYY-MM-DD)', example: '2025-11-05' })
  date: string;

  @ApiProperty({ description: 'Number of exercises completed', example: 12 })
  exercisesCompleted: number;

  @ApiProperty({ description: 'Number of lessons completed', example: 2 })
  lessonsCompleted: number;

  @ApiProperty({ description: 'XP earned on this day', example: 150 })
  xpEarned: number;

  @ApiProperty({ description: 'Time spent in minutes', example: 45 })
  timeSpent: number;

  @ApiProperty({
    description: 'Activity level for heatmap visualization',
    enum: ['none', 'low', 'medium', 'high'],
    example: 'medium',
  })
  activityLevel: ActivityLevel;
}

export class ActivityStats {
  @ApiProperty({ description: 'Total number of active days', example: 85 })
  totalActiveDays: number;

  @ApiProperty({ description: 'Longest streak of consecutive days', example: 15 })
  longestStreak: number;

  @ApiProperty({ description: 'Current active streak', example: 5 })
  currentStreak: number;

  @ApiProperty({ description: 'Average XP per active day', example: 125.5 })
  averagePerDay: number;
}

export class ActivityCalendarResponseDto {
  @ApiProperty({
    description: 'Daily activity data for the requested period',
    type: [CalendarDayItem],
  })
  calendar: CalendarDayItem[];

  @ApiProperty({
    description: 'Activity statistics summary',
    type: ActivityStats,
  })
  stats: ActivityStats;
}
