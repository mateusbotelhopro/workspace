import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeekendSummaryService } from './weekend-summary.service';

@Injectable()
export class WeekendSummaryCron {
  constructor(private readonly weekendSummaryService: WeekendSummaryService) {}

  // Toda segunda-feira às 08h (horário de São Paulo)
  @Cron('0 8 * * 1', { timeZone: 'America/Sao_Paulo' })
  async handleCron() {
    const result = await this.weekendSummaryService.runWeekendSummary();
    console.log('Weekend summary:', result);
  }
}
