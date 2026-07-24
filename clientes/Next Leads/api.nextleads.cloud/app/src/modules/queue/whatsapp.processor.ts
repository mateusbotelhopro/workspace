import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Processor('whatsapp')
export class WhatsappProcessor {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Process('send-whatsapp')
  async handle(job: Job) {
    console.log('Processando fila WhatsApp:', job.id);

    const { phone, message, messageId, sdrId } = job.data;

    // Delay humanizado para evitar bloqueio da Z-API
    const randomDelay = Math.floor(Math.random() * 5000) + 3000;
    console.log(`Delay humano WhatsApp: ${randomDelay}ms`);
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    const result = await this.whatsappService.sendText({ phone, message, messageId, sdrId });

    if (!result) throw new Error('Falha ao enviar WhatsApp pela Z-API');

    console.log('WhatsApp enviado pela fila:', result);
    return result;
  }
}
