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
import { ExamService } from './exam.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CreateExamDto,
  UpdateExamDto,
  ExamDetailDto,
  ExamListDto,
  StartExamDto,
  SubmitExamDto,
  ExamResultDto,
  ExamAttemptDto,
  FindExamsDto,
  CreateExamQuestionDto,
  CanRetakeExamDto,
} from './dto/exam.dto';

@ApiTags('exam')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  // ==================== Admin Endpoints ====================

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create exam (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Exam created successfully',
    type: ExamDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid exam data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async create(@Body() dto: CreateExamDto): Promise<ExamDetailDto> {
    return this.examService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update exam (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Exam updated successfully',
    type: ExamDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid exam data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateExamDto): Promise<ExamDetailDto> {
    return this.examService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete exam (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Exam deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.examService.delete(id);
  }

  @Post(':id/questions')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add question to exam (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Question added successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid question data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async addQuestion(@Param('id') id: string, @Body() dto: CreateExamQuestionDto) {
    return this.examService.addQuestion(id, dto);
  }

  // ==================== User Endpoints ====================

  @Get()
  @ApiOperation({ summary: 'List all published exams' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of exams',
    type: [ExamListDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query() filters: FindExamsDto,
  ): Promise<ExamListDto[]> {
    return this.examService.findAll(userId, filters);
  }

  @Get('attempts')
  @ApiOperation({ summary: 'Get user exam attempt history' })
  @ApiResponse({
    status: 200,
    description: 'Returns user exam attempts',
    type: [ExamAttemptDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAttempts(
    @CurrentUser('sub') userId: string,
    @Query('examId') examId?: string,
  ): Promise<ExamAttemptDto[]> {
    return this.examService.getAttempts(userId, examId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam details' })
  @ApiResponse({
    status: 200,
    description: 'Returns exam details',
    type: ExamDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Exam is not published' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<ExamDetailDto> {
    return this.examService.findOne(id, userId);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start exam session' })
  @ApiResponse({
    status: 201,
    description: 'Exam session started',
    type: StartExamDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Exam has no questions, attempt already in progress, or cooldown period active',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Exam is not published' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async startExam(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<StartExamDto> {
    return this.examService.startExam(id, userId);
  }

  @Post('attempt/:attemptId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit ALL exam answers at once' })
  @ApiResponse({
    status: 200,
    description: 'Exam submitted and graded',
    type: ExamResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Time limit exceeded, already completed, or not all questions answered',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Attempt does not belong to user' })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async submitExam(
    @Param('attemptId') attemptId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: SubmitExamDto,
  ): Promise<ExamResultDto> {
    return this.examService.submitExam(attemptId, userId, dto);
  }

  @Get(':id/can-retake')
  @ApiOperation({ summary: 'Check if user can retake exam (respects cooldown)' })
  @ApiResponse({
    status: 200,
    description: 'Returns retake eligibility',
    type: CanRetakeExamDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async canRetake(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<CanRetakeExamDto> {
    return this.examService.canRetakeExam(userId, id);
  }
}
