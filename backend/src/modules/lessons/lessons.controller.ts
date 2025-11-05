import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FindLessonsDto } from './dto/find-lessons.dto';
import { CompleteLessonDto } from './dto/complete-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  async findAll(@Query() query: FindLessonsDto) {
    const result = await this.lessonsService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonsService.findOne(id);
    return {
      success: true,
      data: lesson,
    };
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get user progress for lesson' })
  @ApiResponse({ status: 200, description: 'Progress retrieved' })
  async getProgress(@Param('id') lessonId: string, @CurrentUser('sub') userId: string) {
    const progress = await this.lessonsService.getUserLessonProgress(userId, lessonId);
    return {
      success: true,
      data: progress,
    };
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson started' })
  async startLesson(@Param('id') lessonId: string, @CurrentUser('sub') userId: string) {
    const progress = await this.lessonsService.startLesson(userId, lessonId);
    return {
      success: true,
      data: progress,
    };
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson completed' })
  async completeLesson(
    @Param('id') lessonId: string,
    @Body() dto: CompleteLessonDto,
    @CurrentUser('sub') userId: string,
  ) {
    const progress = await this.lessonsService.completeLesson(userId, lessonId, dto.timeSpent);
    return {
      success: true,
      data: progress,
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new lesson (Admin only)' })
  @ApiResponse({ status: 201, description: 'Lesson created' })
  async create(@Body() dto: CreateLessonDto) {
    const lesson = await this.lessonsService.create(dto);
    return {
      success: true,
      data: lesson,
    };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update lesson (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    const lesson = await this.lessonsService.update(id, dto);
    return {
      success: true,
      data: lesson,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete lesson (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson deleted' })
  async remove(@Param('id') id: string) {
    const result = await this.lessonsService.remove(id);
    return {
      success: true,
      ...result,
    };
  }
}
