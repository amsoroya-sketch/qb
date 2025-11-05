import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVersesDto {
  @ApiProperty({ example: 'الرحمن' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ enum: ['text', 'root'], default: 'text' })
  @IsOptional()
  @IsEnum(['text', 'root'])
  searchType?: 'text' | 'root';

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
