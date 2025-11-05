import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CreateQuizDto,
  UpdateQuizDto,
  QuizDetailDto,
  QuizListDto,
  StartQuizDto,
  SubmitQuizAnswerDto,
  QuizResultDto,
  CompleteQuizDto,
  QuizAttemptDto,
  GenerateQuizDto,
  FindQuizzesDto,
  LeaderboardEntryDto,
  CreateQuizQuestionDto,
} from './dto/quiz.dto';

@ApiTags('quiz')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // ==================== Admin Endpoints ====================

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create quiz (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Quiz created successfully',
    type: QuizDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid quiz data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async create(@Body() dto: CreateQuizDto): Promise<QuizDetailDto> {
    return this.quizService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update quiz (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Quiz updated successfully',
    type: QuizDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid quiz data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateQuizDto): Promise<QuizDetailDto> {
    return this.quizService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete quiz (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Quiz deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.quizService.delete(id);
  }

  @Post(':id/questions')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add question to quiz (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Question added successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid question data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async addQuestion(@Param('id') id: string, @Body() dto: CreateQuizQuestionDto) {
    return this.quizService.addQuestion(id, dto);
  }

  @Post('generate')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Auto-generate quiz from grammar focus (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Quiz generated successfully',
    type: QuizDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid generation parameters or insufficient data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async generateQuiz(@Body() dto: GenerateQuizDto): Promise<QuizDetailDto> {
    return this.quizService.generateQuizFromGrammar(dto);
  }

  // ==================== User Endpoints ====================

  @Get()
  @ApiOperation({ summary: 'List all published quizzes' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of quizzes',
    type: [QuizListDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query() filters: FindQuizzesDto,
  ): Promise<QuizListDto[]> {
    return this.quizService.findAll(userId, filters);
  }

  @Get('attempts')
  @ApiOperation({ summary: 'Get user quiz attempt history' })
  @ApiResponse({
    status: 200,
    description: 'Returns user quiz attempts',
    type: [QuizAttemptDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAttempts(
    @CurrentUser('sub') userId: string,
    @Query('quizId') quizId?: string,
  ): Promise<QuizAttemptDto[]> {
    return this.quizService.getAttempts(userId, quizId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz details' })
  @ApiResponse({
    status: 200,
    description: 'Returns quiz details',
    type: QuizDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Quiz is not published' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<QuizDetailDto> {
    return this.quizService.findOne(id, userId);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start quiz session' })
  @ApiResponse({
    status: 201,
    description: 'Quiz session started',
    type: StartQuizDto,
  })
  @ApiResponse({ status: 400, description: 'Quiz has no questions or attempt already in progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Quiz is not published' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async startQuiz(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<StartQuizDto> {
    return this.quizService.startQuiz(id, userId);
  }

  @Post('attempt/:attemptId/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit answer during quiz' })
  @ApiResponse({
    status: 200,
    description: 'Answer submitted and graded',
    type: QuizResultDto,
  })
  @ApiResponse({ status: 400, description: 'Quiz attempt expired or invalid answer' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Attempt does not belong to user' })
  @ApiResponse({ status: 404, description: 'Attempt or question not found' })
  async submitAnswer(
    @Param('attemptId') attemptId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: SubmitQuizAnswerDto,
  ): Promise<QuizResultDto> {
    return this.quizService.submitAnswer(attemptId, userId, dto);
  }

  @Post('attempt/:attemptId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete quiz and get final score' })
  @ApiResponse({
    status: 200,
    description: 'Quiz completed successfully',
    type: CompleteQuizDto,
  })
  @ApiResponse({ status: 400, description: 'Not all questions answered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Attempt does not belong to user' })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async completeQuiz(
    @Param('attemptId') attemptId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<CompleteQuizDto> {
    return this.quizService.completeQuiz(attemptId, userId);
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get leaderboard for quiz' })
  @ApiResponse({
    status: 200,
    description: 'Returns quiz leaderboard',
    type: [LeaderboardEntryDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async getLeaderboard(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ): Promise<LeaderboardEntryDto[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.quizService.getLeaderboard(id, limitNum);
  }
}
