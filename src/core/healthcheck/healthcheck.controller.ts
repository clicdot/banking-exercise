import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  // DNSHealthIndicator,
  HealthCheck,
  // TypeOrmHealthIndicator
  MongooseHealthIndicator,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';
import { VersionHealthIndicator } from './services/version-health-check.service';

@ApiTags('Microservice - Health Check')
@Controller('healthcheck')
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  constructor(
    private health: HealthCheckService, // private dns: DNSHealthIndicator, // private db: TypeOrmHealthIndicator,
    private mongoose: MongooseHealthIndicator,
    private version: VersionHealthIndicator,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.mongoose.pingCheck('mongoose', {
          timeout: 5000
        }),
      async () =>
        this.db.pingCheck('postgres', {
          timeout: 5000
        }),
      async () => this.version.isHealthy('Version')
    ]);
  }
}
