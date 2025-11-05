import { Controller, Get, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GdprService } from './gdpr.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('gdpr')
@Controller('gdpr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GdprController {
  constructor(private gdprService: GdprService) {}

  @Get('export')
  @ApiOperation({
    summary: 'Export all user data (GDPR Article 20 - Right to Data Portability)',
    description:
      'Returns all personal data associated with the authenticated user in machine-readable JSON format. ' +
      'Includes profile, progress, exercises, achievements, lesson progress, bookmarks, and events.',
  })
  @ApiResponse({
    status: 200,
    description: 'User data exported successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            exportMetadata: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                exportedAt: { type: 'string' },
                formatVersion: { type: 'string' },
                dataTypes: { type: 'array', items: { type: 'string' } },
              },
            },
            userData: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async exportData(@CurrentUser('sub') userId: string) {
    const data = await this.gdprService.exportUserData(userId);

    return {
      success: true,
      data,
    };
  }

  @Get('export/summary')
  @ApiOperation({
    summary: 'Get summary of user data before deletion',
    description:
      'Returns a summary of all data associated with the user to inform deletion decision.',
  })
  @ApiResponse({
    status: 200,
    description: 'User data summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDataSummary(@CurrentUser('sub') userId: string) {
    const summary = await this.gdprService.getUserDataSummary(userId);

    return {
      success: true,
      data: summary,
    };
  }

  @Delete('delete-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account and all associated data (GDPR Article 17 - Right to Erasure)',
    description:
      'Permanently deletes the user account and all associated personal data. ' +
      'This action is irreversible. The user will be logged out and cannot access the system again.',
  })
  @ApiResponse({
    status: 200,
    description: 'User account and all data deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Account deleted successfully' },
        data: {
          type: 'object',
          properties: {
            deleted: { type: 'boolean' },
            deletedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@CurrentUser('sub') userId: string) {
    const result = await this.gdprService.deleteUserData(userId);

    return {
      success: true,
      message: 'Account deleted successfully. All your data has been permanently removed.',
      data: result,
    };
  }
}
