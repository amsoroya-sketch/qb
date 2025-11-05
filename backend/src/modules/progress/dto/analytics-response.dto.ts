import { ApiProperty } from '@nestjs/swagger';

export class XpHistoryItem {
  @ApiProperty({ description: 'Date in ISO format (YYYY-MM-DD)', example: '2025-11-01' })
  date: string;

  @ApiProperty({ description: 'Total XP at this date', example: 150 })
  xp: number;

  @ApiProperty({ description: 'Level at this date', example: 2 })
  level: number;
}

export class LevelMilestone {
  @ApiProperty({ description: 'Level number', example: 3 })
  level: number;

  @ApiProperty({ description: 'XP required to reach this level', example: 250 })
  xpRequired: number;

  @ApiProperty({
    description: 'Date when user achieved this level (null if not achieved)',
    example: '2025-11-03T10:30:00Z',
    nullable: true,
  })
  achievedDate: string | null;
}

export class WeeklyStatsItem {
  @ApiProperty({ description: 'XP gained in this period', example: 120 })
  xpGained: number;

  @ApiProperty({ description: 'Lessons completed in this period', example: 3 })
  lessonsCompleted: number;
}

export class WeeklyStatsComparison {
  @ApiProperty({ description: 'Current week statistics' })
  currentWeek: WeeklyStatsItem;

  @ApiProperty({ description: 'Last week statistics' })
  lastWeek: WeeklyStatsItem;

  @ApiProperty({ description: 'Percentage change (positive or negative)', example: 25.5 })
  change: number;
}

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'XP and level history for the past 30 days',
    type: [XpHistoryItem],
  })
  xpHistory: XpHistoryItem[];

  @ApiProperty({
    description: 'Level milestones with achievement dates',
    type: [LevelMilestone],
  })
  levelMilestones: LevelMilestone[];

  @ApiProperty({
    description: 'Weekly statistics comparison',
    type: WeeklyStatsComparison,
  })
  weeklyStats: WeeklyStatsComparison;
}
