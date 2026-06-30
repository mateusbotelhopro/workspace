import { Body, Controller, Post } from '@nestjs/common';

@Controller('webhooks/zapi')
export class ZapiWebhookController {
  @Post('received')
  received(@Body() body: any) {
    console.log('Z-API received:', body);
    return { ok: true, event: 'received' };
  }

  @Post('status')
  status(@Body() body: any) {
    console.log('Z-API status:', body);
    return { ok: true, event: 'status' };
  }

  @Post('connected')
  connected(@Body() body: any) {
    console.log('Z-API connected:', body);
    return { ok: true, event: 'connected' };
  }

  @Post('disconnected')
  disconnected(@Body() body: any) {
    console.log('Z-API disconnected:', body);
    return { ok: true, event: 'disconnected' };
  }
}
