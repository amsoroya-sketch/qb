import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { register } from 'prom-client';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @ApiExcludeEndpoint() // Exclude from Swagger docs
  @Header('Content-Type', register.contentType)
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  async getMetrics() {
    return register.metrics();
  }
}
