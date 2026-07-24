import { Module } from '@nestjs/common';
import { ResponseSlaService } from './response-sla.service';
import { ResponseSlaController } from './response-sla.controller';
import { ResponseSlaCron } from './response-sla.cron';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { WeekendSummaryService } from './weekend-summary.service';
import { WeekendSummaryCron } from './weekend-summary.cron';

@Module({
  imports: [WhatsappModule],
  controllers: [ResponseSlaController],
  providers: [ResponseSlaService, ResponseSlaCron, WeekendSummaryService, WeekendSummaryCron],
})
export class ResponseSlaModule {}
