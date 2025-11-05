import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FindExercisesDto, SubmitExerciseDto } from './dto';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exercises with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated exercises' })
  async findAll(@Query() query: FindExercisesDto) {
    return this.exercisesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single exercise by ID' })
  @ApiResponse({ status: 200, description: 'Returns exercise details' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all exercises for a lesson' })
  @ApiResponse({ status: 200, description: 'Returns exercises for lesson' })
  async findByLesson(@Param('lessonId') lessonId: string) {
    return this.exercisesService.findByLesson(lessonId);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit exercise answer' })
  @ApiResponse({ status: 200, description: 'Exercise submitted and graded' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async submit(
    @Param('id') exerciseId: string,
    @Body() dto: SubmitExerciseDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.exercisesService.submit(userId, exerciseId, dto);
  }

  @Get(':id/attempts')
  @ApiOperation({ summary: 'Get user attempts for an exercise' })
  @ApiResponse({ status: 200, description: 'Returns user exercise attempts' })
  async getUserAttempts(@Param('id') exerciseId: string, @CurrentUser('sub') userId: string) {
    return this.exercisesService.getUserExercises(userId, exerciseId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get exercise statistics' })
  @ApiResponse({ status: 200, description: 'Returns exercise statistics' })
  async getStats(@Param('id') exerciseId: string) {
    return this.exercisesService.getExerciseStats(exerciseId);
  }
}
