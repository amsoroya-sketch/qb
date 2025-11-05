import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * ExamType enum matching Prisma schema
 */
export enum ExamTypeEnum {
  STAGE_COMPLETION = 'STAGE_COMPLETION', // After completing all lessons in a stage
  FINAL_ASSESSMENT = 'FINAL_ASSESSMENT', // Track completion exam
  CERTIFICATION = 'CERTIFICATION', // Official certificate exam
}

/**
 * Track enum matching Prisma schema
 */
export enum TrackEnum {
  A = 'A',
  B = 'B',
}

/**
 * ExerciseType enum matching Prisma schema
 */
export enum ExerciseTypeEnum {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  TRUE_FALSE = 'TRUE_FALSE',
  MATCHING = 'MATCHING',
  DRAG_DROP = 'DRAG_DROP',
  WORD_ANALYSIS = 'WORD_ANALYSIS',
  MORPHEME_IDENTIFICATION = 'MORPHEME_IDENTIFICATION',
  VERB_CONJUGATION = 'VERB_CONJUGATION',
  NOUN_DECLENSION = 'NOUN_DECLENSION',
  ROOT_EXTRACTION = 'ROOT_EXTRACTION',
  SENTENCE_TYPE = 'SENTENCE_TYPE',
  SYNTACTIC_ROLE = 'SYNTACTIC_ROLE',
  PHRASE_GROUPING = 'PHRASE_GROUPING',
  AGREEMENT_CHECKING = 'AGREEMENT_CHECKING',
  I3RAB_ANALYSIS = 'I3RAB_ANALYSIS',
  MORPHEME_SEGMENTATION = 'MORPHEME_SEGMENTATION',
  DEPENDENCY_TREE = 'DEPENDENCY_TREE',
}

/**
 * Create a new question for exam
 */
export class CreateExamQuestionDto {
  @ApiProperty({ example: 'What is the case of this noun?' })
  @IsString()
  question: string;

  @ApiPropertyOptional({ example: 'ما هو إعراب هذا الاسم؟' })
  @IsOptional()
  @IsString()
  questionArabic?: string;

  @ApiProperty({ enum: ExerciseTypeEnum, example: ExerciseTypeEnum.NOUN_DECLENSION })
  @IsEnum(ExerciseTypeEnum)
  type: ExerciseTypeEnum;

  @ApiPropertyOptional({
    example: [
      { value: 'NOM', label: 'Nominative (مرفوع)' },
      { value: 'ACC', label: 'Accusative (منصوب)' },
      { value: 'GEN', label: 'Genitive (مجرور)' },
    ],
  })
  @IsOptional()
  @IsArray()
  options?: any[];

  @ApiProperty({ example: 'NOM' })
  @IsString()
  correctAnswer: string;

  @ApiPropertyOptional({
    example: 'This noun is nominative because it is the subject of the sentence.',
  })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({ example: 'case' })
  @IsOptional()
  @IsString()
  grammarFocus?: string;

  @ApiPropertyOptional({ example: '2:255' })
  @IsOptional()
  @IsString()
  verseReference?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  wordPosition?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;
}

/**
 * 1. CreateExamDto - Create new exam (admin)
 */
export class CreateExamDto {
  @ApiProperty({ example: 'Stage 1 Completion Exam' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'اختبار إكمال المرحلة الأولى' })
  @IsOptional()
  @IsString()
  titleArabic?: string;

  @ApiPropertyOptional({ example: 'Comprehensive exam covering all Stage 1 topics' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ExamTypeEnum, example: ExamTypeEnum.STAGE_COMPLETION })
  @IsEnum(ExamTypeEnum)
  type: ExamTypeEnum;

  @ApiProperty({ example: 1, minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  stage: number;

  @ApiProperty({ enum: TrackEnum, example: TrackEnum.A })
  @IsEnum(TrackEnum)
  track: TrackEnum;

  @ApiPropertyOptional({ example: 85, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minPassScore?: number;

  @ApiProperty({ example: 3600, description: 'Time limit in seconds (REQUIRED for exams)' })
  @IsInt()
  @Min(300)
  timeLimit: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsInt()
  @Min(0)
  xpReward?: number;

  @ApiPropertyOptional({
    example: '<svg>...</svg>',
    description: 'Certificate template (SVG or HTML)',
  })
  @IsOptional()
  @IsString()
  certificateTemplate?: string;

  @ApiPropertyOptional({
    example: 86400,
    description: 'Retake cooldown in seconds (default 24hrs)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  retakeCooldown?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [CreateExamQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamQuestionDto)
  questions?: CreateExamQuestionDto[];
}

/**
 * 2. UpdateExamDto - Update exam (admin)
 */
export class UpdateExamDto extends PartialType(CreateExamDto) {}

/**
 * 3. ExamQuestionDto - Question response (without correct answer during exam)
 */
export class ExamQuestionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiPropertyOptional()
  questionArabic?: string;

  @ApiProperty({ enum: ExerciseTypeEnum })
  type: ExerciseTypeEnum;

  @ApiPropertyOptional()
  options?: any[];

  @ApiPropertyOptional()
  explanation?: string;

  @ApiPropertyOptional()
  grammarFocus?: string;

  @ApiPropertyOptional()
  verseReference?: string;

  @ApiPropertyOptional()
  wordPosition?: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  points: number;

  // NOTE: correctAnswer is excluded during exam, only shown in results
  @ApiPropertyOptional()
  correctAnswer?: string;
}

/**
 * 4. ExamDetailDto - Full exam with questions
 */
export class ExamDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  titleArabic?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ExamTypeEnum })
  type: ExamTypeEnum;

  @ApiProperty()
  stage: number;

  @ApiProperty({ enum: TrackEnum })
  track: TrackEnum;

  @ApiProperty()
  minPassScore: number;

  @ApiProperty()
  timeLimit: number;

  @ApiProperty()
  xpReward: number;

  @ApiPropertyOptional()
  certificateTemplate?: string;

  @ApiProperty()
  retakeCooldown: number;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty({ type: [ExamQuestionDto] })
  questions: ExamQuestionDto[];

  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * 5. ExamListDto - List item (without questions)
 */
export class ExamListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  titleArabic?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ExamTypeEnum })
  type: ExamTypeEnum;

  @ApiProperty()
  stage: number;

  @ApiProperty({ enum: TrackEnum })
  track: TrackEnum;

  @ApiProperty()
  minPassScore: number;

  @ApiProperty()
  timeLimit: number;

  @ApiProperty()
  xpReward: number;

  @ApiProperty()
  retakeCooldown: number;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  totalPoints: number;

  @ApiPropertyOptional({ description: 'User best score if userId provided' })
  bestScore?: number;

  @ApiPropertyOptional({ description: 'User attempt count if userId provided' })
  attemptCount?: number;

  @ApiPropertyOptional({ description: 'Can user retake exam (respects cooldown)' })
  canRetake?: boolean;

  @ApiProperty()
  createdAt: Date;
}

/**
 * 6. StartExamDto - Response when starting exam
 */
export class StartExamDto {
  @ApiProperty()
  examId: string;

  @ApiProperty()
  attemptId: string;

  @ApiProperty({ type: [ExamQuestionDto] })
  questions: ExamQuestionDto[]; // WITHOUT correctAnswer

  @ApiProperty({ description: 'Time limit in seconds' })
  timeLimit: number;

  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  startedAt: Date;
}

/**
 * 7. SubmitExamDto - Submit ALL answers at once (NOT one-by-one like Quiz)
 */
export class SubmitExamDto {
  @ApiProperty({
    example: {
      'question-uuid-1': 'answer1',
      'question-uuid-2': 'answer2',
      'question-uuid-3': 'answer3',
    },
    description: 'Map of questionId -> userAnswer',
  })
  @IsOptional()
  answers: Record<string, string>;
}

/**
 * 8. ExamResultDto - Final results with certificate (after submission)
 */
export class ExamResultDto {
  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  examId: string;

  @ApiProperty({ description: 'Final score 0-100' })
  score: number;

  @ApiProperty()
  passed: boolean;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  timeSpent: number;

  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  correctAnswers: number;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  pointsEarned: number;

  @ApiPropertyOptional()
  certificateUrl?: string;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty({ description: 'Detailed answers with correctness' })
  answers: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    explanation?: string;
  }>;
}

/**
 * 9. ExamAttemptDto - Attempt history item
 */
export class ExamAttemptDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  examId: string;

  @ApiProperty()
  examTitle: string;

  @ApiProperty({ description: 'Score 0-100' })
  score: number;

  @ApiProperty()
  passed: boolean;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty({ description: 'Time spent in seconds' })
  timeSpent: number;

  @ApiPropertyOptional()
  certificateUrl?: string;

  @ApiProperty()
  startedAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;
}

/**
 * 10. FindExamsDto - Query filters for listing exams
 */
export class FindExamsDto {
  @ApiPropertyOptional({ enum: ExamTypeEnum })
  @IsOptional()
  @IsEnum(ExamTypeEnum)
  type?: ExamTypeEnum;

  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  stage?: number;

  @ApiPropertyOptional({ enum: TrackEnum })
  @IsOptional()
  @IsEnum(TrackEnum)
  track?: TrackEnum;

  @ApiPropertyOptional({ example: true, description: 'Only published exams' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublished?: boolean;
}

/**
 * 11. CanRetakeExamDto - Response for can-retake check
 */
export class CanRetakeExamDto {
  @ApiProperty()
  canRetake: boolean;

  @ApiPropertyOptional({ description: 'Seconds until can retake' })
  secondsUntilRetake?: number;

  @ApiPropertyOptional()
  lastAttemptDate?: Date;

  @ApiPropertyOptional()
  nextAvailableDate?: Date;
}
