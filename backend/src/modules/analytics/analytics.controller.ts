import { Controller, Get, Post, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track user event' })
  @ApiResponse({ status: 201, description: 'Event tracked' })
  async trackEvent(
    @CurrentUser('sub') userId: string,
    @Body() body: { eventType: string; eventData?: any },
  ) {
    return this.analyticsService.trackEvent(userId, body.eventType, body.eventData);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user analytics' })
  @ApiResponse({ status: 200, description: 'Returns user analytics' })
  async getMyAnalytics(
    @CurrentUser('sub') userId: string,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return this.analyticsService.getUserAnalytics(userId, days || 30);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiResponse({ status: 200, description: 'Returns top users' })
  async getLeaderboard(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.analyticsService.getLeaderboard(limit || 50);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get admin analytics dashboard' })
  @ApiResponse({ status: 200, description: 'Returns platform analytics' })
  async getAdminAnalytics() {
    return this.analyticsService.getAdminAnalytics();
  }
}
