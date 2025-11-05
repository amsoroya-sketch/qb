import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to Arabic Nouns' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'مقدمة في الأسماء العربية' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  titleArabic: string;

  @ApiPropertyOptional({ example: 'Learn the basics of Arabic nouns' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: '# Introduction\n\nA noun (الاسم) is...' })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentArabic?: string;

  @ApiProperty({ example: 'A', enum: ['A', 'B'] })
  @IsEnum(['A', 'B'])
  track: 'A' | 'B';

  @ApiProperty({ example: 1, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  stage: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 'nouns' })
  @IsString()
  grammarTopic: string;

  @ApiProperty({ example: 'BEGINNER', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(180)
  estimatedTime: number;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @IsOptional()
  @Min(0)
  xpReward?: number;
}
