import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MessageProcessor } from './message.processor';
import { WhatsappProcessor } from './whatsapp.processor';
import { LeadsModule } from '../leads/leads.module';
import { MessagesModule } from '../messages/messages.module';
import { AiModule } from '../ai/ai.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { host: 'redis', port: 6379, maxRetriesPerRequest: null },
    }),
    BullModule.registerQueue({ name: 'messages' }, { name: 'whatsapp' }),
    LeadsModule,
    MessagesModule,
    AiModule,
    WhatsappModule,
  ],
  providers: [MessageProcessor, WhatsappProcessor],
  exports: [BullModule],
})
export class QueueModule {}
