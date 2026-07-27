import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UnipileService } from './unipile.service';

@Injectable()
export class UnipileCron {
  constructor(private readonly unipileService: UnipileService) {}

  // Busca mensagens novas na Unipile a cada 30 segundos
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    try {
      const result = await this.unipileService.syncMessages();
      console.log('Unipile sync:', result);
    } catch (err) {
      console.error('Erro no cron Unipile:', err.message);
    }
  }
}
