import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResponseSlaService } from './response-sla.service';

@Injectable()
export class ResponseSlaCron {
  constructor(private readonly responseSlaService: ResponseSlaService) {}

  // Verifica leads sem resposta a cada 5 minutos
  // Envia alerta de SLA em 30 min e 60 min se SDR não respondeu
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    try {
      const result = await this.responseSlaService.checkPendingResponses();
      console.log('Response SLA check:', result);
    } catch (error: any) {
      console.error('Erro no cron Response SLA:', error?.message || 'Erro desconhecido');
    }
  }
}
