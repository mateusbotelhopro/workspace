import { Module } from '@nestjs/common';
import { ZapiWebhookController } from './zapi-webhook.controller';

@Module({
  controllers: [ZapiWebhookController],
})
export class ZapiWebhookModule {}
