import { ApiProperty } from '@nestjs/swagger';

export type MasteryLevel = 'beginner' | 'intermediate' | 'advanced';

export class TopicItem {
  @ApiProperty({ description: 'Grammar topic name', example: 'Past Tense Verbs' })
  topic: string;

  @ApiProperty({ description: 'Total exercises attempted for this topic', example: 25 })
  totalExercises: number;

  @ApiProperty({ description: 'Number of correct answers', example: 20 })
  correctAnswers: number;

  @ApiProperty({ description: 'Accuracy percentage (0-100)', example: 80 })
  accuracy: number;

  @ApiProperty({
    description: 'Last time this topic was practiced (ISO date)',
    example: '2025-11-05T14:30:00Z',
  })
  lastPracticed: string;

  @ApiProperty({
    description: 'Mastery level based on accuracy',
    enum: ['beginner', 'intermediate', 'advanced'],
    example: 'intermediate',
  })
  level: MasteryLevel;
}

export class TopicMasteryResponseDto {
  @ApiProperty({
    description: 'List of grammar topics with mastery data',
    type: [TopicItem],
  })
  topics: TopicItem[];

  @ApiProperty({
    description: 'Overall mastery percentage across all topics',
    example: 75.5,
  })
  overallMastery: number;

  @ApiProperty({
    description: 'Topic with highest accuracy',
    example: 'Noun Cases',
    nullable: true,
  })
  strongestTopic: string | null;

  @ApiProperty({
    description: 'Topic with lowest accuracy',
    example: 'Verb Conjugation',
    nullable: true,
  })
  weakestTopic: string | null;
}
