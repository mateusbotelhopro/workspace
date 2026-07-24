import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { PrismaModule } from './infra/prisma/prisma.module';
import { QueueModule } from './modules/queue/queue.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { SdrModule } from './modules/sdr/sdr.module';
import { LeadsModule } from './modules/leads/leads.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AiModule } from './modules/ai/ai.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ZapiWebhookModule } from './modules/zapi-webhook/zapi-webhook.module';
import { UnipileModule } from './modules/unipile/unipile.module';
import { StatsModule } from './modules/stats/stats.module';
import { ResponseSlaModule } from './modules/response-sla/response-sla.module';
import { LinkedinAccountsModule } from './modules/linkedin-accounts/linkedin-accounts.module';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    QueueModule,
    WebhookModule,
    SdrModule,
    LeadsModule,
    MessagesModule,
    AiModule,
    WhatsappModule,
    ZapiWebhookModule,
    UnipileModule,
    StatsModule,
    ResponseSlaModule,
    LinkedinAccountsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
