import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Basic health check (liveness probe)
   * Returns 200 OK if the application is running
   */
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Readiness check - verifies dependencies are healthy
   * Returns 200 OK if ready to serve traffic, 503 if not ready
   */
  async readiness() {
    const checks: Record<string, string> = {};
    const errors: string[] = [];
    let isReady = true;

    // Check Database Connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch (error) {
      checks.database = 'error';
      errors.push(`Database connection failed: ${error.message}`);
      isReady = false;
    }

    // Check Redis Connection
    try {
      await this.redis.ping();
      checks.redis = 'ok';
    } catch (error) {
      checks.redis = 'error';
      errors.push(`Redis connection failed: ${error.message}`);
      isReady = false;
    }

    const response = {
      status: isReady ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks,
      ...(errors.length > 0 && { errors }),
    };

    if (!isReady) {
      return {
        ...response,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      };
    }

    return response;
  }
}
