import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}
