import { IsString, IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PracticeModeEnum {
  QUICK_PRACTICE = 'quick_practice',
  GRAMMAR_DRILLS = 'grammar_drills',
  VERSE_BASED = 'verse_based',
  SPACED_REPETITION = 'spaced_repetition',
  CHALLENGE = 'challenge',
  DAILY = 'daily',
}

export class GetPracticeSetDto {
  @ApiProperty({ enum: PracticeModeEnum, example: PracticeModeEnum.QUICK_PRACTICE })
  @IsEnum(PracticeModeEnum)
  mode: PracticeModeEnum;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  count?: number;

  @ApiPropertyOptional({ example: 'aspect', description: 'Grammar focus area for drills' })
  @IsOptional()
  @IsString()
  grammarFocus?: string;

  @ApiPropertyOptional({ example: 1, description: 'Surah number for verse-based practice' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(114)
  surahNumber?: number;

  @ApiPropertyOptional({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @IsOptional()
  @IsString()
  difficulty?: string;
}

export class SubmitPracticeAnswerDto {
  @ApiProperty({ example: 'exercise-uuid' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ example: 'PERF' })
  @IsString()
  userAnswer: string;

  @ApiProperty({ example: 15, description: 'Time spent in seconds' })
  @IsInt()
  @Min(1)
  timeSpent: number;
}

export class PracticeExerciseDto {
  id: string;
  type: string;
  title: string;
  question: string;
  questionArabic?: string;
  options?: any[];
  xpReward: number;
  difficulty: string;
  metadata?: any;
}

export class PracticeSetResponseDto {
  @ApiProperty({ enum: PracticeModeEnum })
  mode: PracticeModeEnum;

  @ApiProperty({ type: [PracticeExerciseDto] })
  exercises: PracticeExerciseDto[];

  @ApiProperty({ example: 10 })
  totalCount: number;

  @ApiProperty({ example: 15, description: 'Estimated time in minutes' })
  estimatedTime: number;

  @ApiPropertyOptional({ example: 'aspect' })
  grammarFocus?: string;

  @ApiPropertyOptional({ example: 1 })
  surahNumber?: number;

  @ApiPropertyOptional({ type: [String], example: ['aspect', 'case', 'gender'] })
  weakTopics?: string[];
}

export class PracticeResultDto {
  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  correctAnswer: string;

  @ApiProperty()
  explanation?: string;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  timeBonus: number;

  @ApiProperty()
  totalXP: number;

  @ApiProperty()
  accuracy: number;
}
