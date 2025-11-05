import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PracticeService } from './practice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  GetPracticeSetDto,
  SubmitPracticeAnswerDto,
  PracticeSetResponseDto,
  PracticeResultDto,
  PracticeModeEnum,
} from './dto/practice.dto';

@ApiTags('practice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get()
  @ApiOperation({ summary: 'Get practice exercise set' })
  @ApiResponse({
    status: 200,
    description: 'Returns practice set',
    type: PracticeSetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @ApiQuery({ name: 'mode', enum: PracticeModeEnum, required: true })
  @ApiQuery({ name: 'count', type: Number, required: false })
  @ApiQuery({ name: 'grammarFocus', type: String, required: false })
  @ApiQuery({ name: 'difficulty', type: String, required: false })
  @ApiQuery({ name: 'surahNumber', type: Number, required: false })
  async getPracticeSet(
    @CurrentUser('sub') userId: string,
    @Query('mode') mode: PracticeModeEnum,
    @Query('grammarFocus') grammarFocus?: string,
    @Query('difficulty') difficulty?: string,
    @Query('count') count?: string,
    @Query('surahNumber') surahNumber?: string,
  ): Promise<PracticeSetResponseDto> {
    const dto: GetPracticeSetDto = {
      mode,
      grammarFocus,
      difficulty,
      count: count ? parseInt(count, 10) : undefined,
      surahNumber: surahNumber ? parseInt(surahNumber, 10) : undefined,
    };
    return this.practiceService.getPracticeSet(userId, dto);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit practice answer' })
  @ApiResponse({
    status: 200,
    description: 'Returns answer result',
    type: PracticeResultDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid answer data' })
  async submitAnswer(
    @CurrentUser('sub') userId: string,
    @Body() dto: SubmitPracticeAnswerDto,
  ): Promise<PracticeResultDto> {
    return this.practiceService.submitPracticeAnswer(userId, dto);
  }
}
