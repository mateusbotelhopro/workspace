import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [StatsController, DashboardController],
})
export class StatsModule {}
