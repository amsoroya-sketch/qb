import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check - liveness probe' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-11-07T04:00:00.000Z',
        uptime: 3600,
      },
    },
  })
  async check() {
    return this.healthService.check();
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness check - checks database and Redis connections' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready to serve traffic',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-11-07T04:00:00.000Z',
        checks: {
          database: 'ok',
          redis: 'ok',
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is not ready',
    schema: {
      example: {
        status: 'error',
        timestamp: '2025-11-07T04:00:00.000Z',
        checks: {
          database: 'error',
          redis: 'ok',
        },
        errors: ['Database connection failed'],
      },
    },
  })
  async readiness() {
    return this.healthService.readiness();
  }
}
