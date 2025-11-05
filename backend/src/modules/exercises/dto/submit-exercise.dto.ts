import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitExerciseDto {
  @ApiProperty({ example: 'الكتاب' })
  @IsString()
  userAnswer: string;

  @ApiProperty({ example: 45, description: 'Time spent in seconds' })
  @IsInt()
  @Min(1)
  timeSpent: number;
}
