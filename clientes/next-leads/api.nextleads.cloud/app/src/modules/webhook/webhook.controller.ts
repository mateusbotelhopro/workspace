import { Controller, Post, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Controller('webhooks/unipile')
export class WebhookController {
  constructor(
    @InjectQueue('messages')
    private readonly queue: Queue,
  ) {}

  @Post('message')
  async handleMessage(@Body() body: any) {
    console.log(
      'PAYLOAD UNIPILE RAW:',
      JSON.stringify(body, null, 2),
    );

    await this.queue.add('process-message', body);

    return {
      ok: true,
    };
  }
}
