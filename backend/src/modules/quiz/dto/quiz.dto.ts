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
 * QuizType enum matching Prisma schema
 */
export enum QuizTypeEnum {
  TOPIC = 'TOPIC', // After lesson completion
  COMPREHENSIVE = 'COMPREHENSIVE', // After stage completion
  DIAGNOSTIC = 'DIAGNOSTIC', // Entry assessment
  PRACTICE = 'PRACTICE', // Practice quiz
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
 * Create a new question for quiz
 */
export class CreateQuizQuestionDto {
  @ApiProperty({ example: 'What is the aspect of this verb?' })
  @IsString()
  question: string;

  @ApiPropertyOptional({ example: 'ما هو زمن هذا الفعل؟' })
  @IsOptional()
  @IsString()
  questionArabic?: string;

  @ApiProperty({ enum: ExerciseTypeEnum, example: ExerciseTypeEnum.VERB_CONJUGATION })
  @IsEnum(ExerciseTypeEnum)
  type: ExerciseTypeEnum;

  @ApiPropertyOptional({
    example: [
      { value: 'PERF', label: 'Perfect (ماضي)' },
      { value: 'IMPF', label: 'Imperfect (مضارع)' },
    ],
  })
  @IsOptional()
  @IsArray()
  options?: any[];

  @ApiProperty({ example: 'PERF' })
  @IsString()
  correctAnswer: string;

  @ApiPropertyOptional({ example: 'This verb is in the perfect aspect...' })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({ example: 'aspect' })
  @IsOptional()
  @IsString()
  grammarFocus?: string;

  @ApiPropertyOptional({ example: '1:1' })
  @IsOptional()
  @IsString()
  verseReference?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  wordPosition?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;
}

/**
 * 1. CreateQuizDto - Create new quiz (admin)
 */
export class CreateQuizDto {
  @ApiProperty({ example: 'Verb Aspect Quiz' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'اختبار زمن الفعل' })
  @IsOptional()
  @IsString()
  titleArabic?: string;

  @ApiPropertyOptional({ example: 'Test your knowledge of verb aspects' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: QuizTypeEnum, example: QuizTypeEnum.TOPIC })
  @IsEnum(QuizTypeEnum)
  type: QuizTypeEnum;

  @ApiPropertyOptional({ example: 'lesson-uuid' })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  stage?: number;

  @ApiPropertyOptional({ enum: TrackEnum, example: TrackEnum.A })
  @IsOptional()
  @IsEnum(TrackEnum)
  track?: TrackEnum;

  @ApiPropertyOptional({ example: 80, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minPassScore?: number;

  @ApiPropertyOptional({ example: 600, description: 'Time limit in seconds' })
  @IsOptional()
  @IsInt()
  @Min(60)
  timeLimit?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  xpReward?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [CreateQuizQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions?: CreateQuizQuestionDto[];
}

/**
 * 2. UpdateQuizDto - Update quiz (admin)
 */
export class UpdateQuizDto extends PartialType(CreateQuizDto) {}

/**
 * 3. QuizQuestionDto - Question response (without correct answer for active quiz)
 */
export class QuizQuestionDto {
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

  // NOTE: correctAnswer is excluded when quiz is in progress
  @ApiPropertyOptional()
  correctAnswer?: string;
}

/**
 * 4. QuizDetailDto - Full quiz with questions
 */
export class QuizDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  titleArabic?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: QuizTypeEnum })
  type: QuizTypeEnum;

  @ApiPropertyOptional()
  lessonId?: string;

  @ApiPropertyOptional()
  stage?: number;

  @ApiPropertyOptional({ enum: TrackEnum })
  track?: TrackEnum;

  @ApiProperty()
  minPassScore: number;

  @ApiPropertyOptional()
  timeLimit?: number;

  @ApiProperty()
  xpReward: number;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty({ type: [QuizQuestionDto] })
  questions: QuizQuestionDto[];

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
 * 5. QuizListDto - List item (without questions)
 */
export class QuizListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  titleArabic?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: QuizTypeEnum })
  type: QuizTypeEnum;

  @ApiPropertyOptional()
  lessonId?: string;

  @ApiPropertyOptional()
  stage?: number;

  @ApiPropertyOptional({ enum: TrackEnum })
  track?: TrackEnum;

  @ApiProperty()
  minPassScore: number;

  @ApiPropertyOptional()
  timeLimit?: number;

  @ApiProperty()
  xpReward: number;

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

  @ApiProperty()
  createdAt: Date;
}

/**
 * 6. StartQuizDto - Response when starting quiz
 */
export class StartQuizDto {
  @ApiProperty()
  quizId: string;

  @ApiProperty()
  attemptId: string;

  @ApiProperty({ type: [QuizQuestionDto] })
  questions: QuizQuestionDto[]; // WITHOUT correctAnswer

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  timeLimit?: number;

  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  startedAt: Date;
}

/**
 * 7. SubmitQuizAnswerDto - Submit single answer during quiz
 */
export class SubmitQuizAnswerDto {
  @ApiProperty({ example: 'attempt-uuid' })
  @IsString()
  attemptId: string;

  @ApiProperty({ example: 'question-uuid' })
  @IsString()
  questionId: string;

  @ApiProperty({ example: 'PERF' })
  @IsString()
  userAnswer: string;
}

/**
 * 8. QuizResultDto - Result after single answer submission
 */
export class QuizResultDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  correctAnswer: string;

  @ApiPropertyOptional()
  explanation?: string;

  @ApiProperty()
  pointsEarned: number;

  @ApiProperty({ description: 'Current total score so far' })
  currentScore: number;

  @ApiProperty({ description: 'Questions answered so far' })
  questionsAnswered: number;

  @ApiProperty({ description: 'Total questions in quiz' })
  totalQuestions: number;
}

/**
 * 9. CompleteQuizDto - Final score and feedback
 */
export class CompleteQuizDto {
  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  quizId: string;

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
 * 10. QuizAttemptDto - Quiz attempt history item
 */
export class QuizAttemptDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quizId: string;

  @ApiProperty()
  quizTitle: string;

  @ApiProperty({ description: 'Score 0-100' })
  score: number;

  @ApiProperty()
  passed: boolean;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty({ description: 'Time spent in seconds' })
  timeSpent: number;

  @ApiProperty()
  completedAt: Date;
}

/**
 * Generate quiz from grammar focus
 */
export class GenerateQuizDto {
  @ApiProperty({ example: 'aspect', description: 'Grammar focus area' })
  @IsString()
  grammarFocus: string;

  @ApiPropertyOptional({ example: 10, minimum: 5, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(20)
  questionCount?: number;

  @ApiPropertyOptional({ example: 'Verb Aspect Practice Quiz' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 80, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minPassScore?: number;

  @ApiPropertyOptional({ example: 600, description: 'Time limit in seconds' })
  @IsOptional()
  @IsInt()
  @Min(60)
  timeLimit?: number;
}

/**
 * Query filters for listing quizzes
 */
export class FindQuizzesDto {
  @ApiPropertyOptional({ enum: QuizTypeEnum })
  @IsOptional()
  @IsEnum(QuizTypeEnum)
  type?: QuizTypeEnum;

  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  stage?: number;

  @ApiPropertyOptional({ enum: TrackEnum })
  @IsOptional()
  @IsEnum(TrackEnum)
  track?: TrackEnum;

  @ApiPropertyOptional({ example: 'lesson-uuid' })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ example: true, description: 'Only published quizzes' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

/**
 * Leaderboard entry
 */
export class LeaderboardEntryDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  timeSpent: number;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  rank: number;
}
