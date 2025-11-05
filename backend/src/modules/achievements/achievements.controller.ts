import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiResponse({ status: 200, description: 'Returns all achievements' })
  async findAll() {
    return this.achievementsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get achievement statistics' })
  @ApiResponse({ status: 200, description: 'Returns achievement stats with category breakdown' })
  async getStats() {
    return this.achievementsService.getAchievementStats();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all achievement categories' })
  @ApiResponse({ status: 200, description: 'Returns list of achievement categories' })
  async getCategories() {
    return this.achievementsService.getAchievementCategories();
  }

  @Get('categories/:category')
  @ApiOperation({ summary: 'Get achievements by category' })
  @ApiResponse({ status: 200, description: 'Returns achievements in the specified category' })
  @ApiResponse({ status: 404, description: 'Category not found or no achievements in category' })
  async getAchievementsByCategory(@Param('category') category: string) {
    return this.achievementsService.getAchievementsByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single achievement' })
  @ApiResponse({ status: 200, description: 'Returns achievement details' })
  @ApiResponse({ status: 404, description: 'Achievement not found' })
  async findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Get('me/unlocked')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user unlocked achievements' })
  @ApiResponse({ status: 200, description: 'Returns user achievements' })
  async getMyAchievements(@CurrentUser('sub') userId: string) {
    return this.achievementsService.getUserAchievements(userId);
  }

  @Post('me/check')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check and unlock new achievements' })
  @ApiResponse({ status: 200, description: 'Returns newly unlocked achievements' })
  async checkAchievements(@CurrentUser('sub') userId: string) {
    return this.achievementsService.checkAndUnlockAchievements(userId);
  }
}
