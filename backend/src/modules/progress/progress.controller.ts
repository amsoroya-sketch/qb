import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user progress' })
  @ApiResponse({ status: 200, description: 'Returns user progress' })
  async getMyProgress(@CurrentUser('sub') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get('me/dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard stats' })
  async getDashboard(@CurrentUser('sub') userId: string) {
    return this.progressService.getDashboardStats(userId);
  }

  @Get('me/lessons')
  @ApiOperation({ summary: 'Get lesson progress for current user' })
  @ApiResponse({ status: 200, description: 'Returns lesson progress' })
  async getMyLessonProgress(@CurrentUser('sub') userId: string) {
    return this.progressService.getLessonProgress(userId);
  }

  @Get('me/achievements')
  @ApiOperation({ summary: 'Get achievement progress for current user' })
  @ApiResponse({ status: 200, description: 'Returns achievements' })
  async getMyAchievements(@CurrentUser('sub') userId: string) {
    return this.progressService.getAchievementProgress(userId);
  }

  @Post('me/streak')
  @ApiOperation({ summary: 'Update user streak (called on daily login)' })
  @ApiResponse({ status: 200, description: 'Streak updated' })
  async updateMyStreak(@CurrentUser('sub') userId: string) {
    return this.progressService.updateStreak(userId);
  }

  @Get('me/analytics')
  @ApiOperation({ summary: 'Get progress analytics with time-series data' })
  @ApiResponse({ status: 200, description: 'Returns analytics data for charts' })
  async getMyAnalytics(@CurrentUser('sub') userId: string) {
    return this.progressService.getAnalytics(userId);
  }

  @Get('me/topic-mastery')
  @ApiOperation({ summary: 'Get grammar topic mastery breakdown' })
  @ApiResponse({ status: 200, description: 'Returns topic accuracy and skill levels' })
  async getMyTopicMastery(@CurrentUser('sub') userId: string) {
    return this.progressService.getTopicMastery(userId);
  }

  @Get('me/activity-calendar')
  @ApiOperation({ summary: 'Get daily activity calendar data' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to fetch (1-730, default 365)',
  })
  @ApiResponse({ status: 200, description: 'Returns activity heatmap data' })
  async getMyActivityCalendar(@CurrentUser('sub') userId: string, @Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 365;
    return this.progressService.getActivityCalendar(userId, daysNum);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get progress for specific user (admin)' })
  @ApiResponse({ status: 200, description: 'Returns user progress' })
  async getUserProgress(@Param('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }
}
