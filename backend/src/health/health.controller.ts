import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckError,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Public } from '../auth/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  async check() {
    return this.health.check([
      async () => this.liveness(),
      async () => this.databaseCheck(),
    ]);
  }

  private liveness(): HealthIndicatorResult {
    return {
      application: {
        status: 'up',
      },
    };
  }

  private async databaseCheck(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        database: {
          status: 'up',
        },
      };
    } catch (error) {
      throw new HealthCheckError('Database check failed', {
        database: {
          status: 'down',
          message: error instanceof Error ? error.message : 'Unknown database error',
        },
      });
    }
  }
}
