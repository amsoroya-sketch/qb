import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonDto {
  @ApiProperty({ example: 900, description: 'Time spent in seconds' })
  @IsInt()
  @Min(0)
  timeSpent: number;
}
