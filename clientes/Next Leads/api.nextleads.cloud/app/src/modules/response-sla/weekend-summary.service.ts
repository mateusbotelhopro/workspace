import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class WeekendSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
  ) {}

  async runWeekendSummary() {
    const now = new Date();
    const day = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
    }).format(now);

    if (day !== 'Mon') return { skipped: true, reason: 'Não é segunda-feira' };

    const lastSaturday = new Date(now);
    lastSaturday.setDate(now.getDate() - 2);
    lastSaturday.setHours(0, 0, 0, 0);

    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - 1);
    lastSunday.setHours(23, 59, 59, 999);

    const messages = await this.prisma.message.findMany({
      where: { direction: 'inbound', receivedAt: { gte: lastSaturday, lte: lastSunday } },
      include: { lead: { include: { sdr: true } } },
    });

    const grouped: Record<string, any[]> = {};
    for (const msg of messages) {
      const sdrId = msg.lead?.sdr?.id;
      if (!sdrId) continue;
      if (!grouped[sdrId]) grouped[sdrId] = [];
      grouped[sdrId].push(msg);
    }

    let sent = 0;
    for (const sdrId of Object.keys(grouped)) {
      const sdr = await this.prisma.sdr.findUnique({ where: { id: sdrId } });
      if (!sdr?.whatsapp) continue;

      const msgs = grouped[sdrId];
      const text = `📊 CHECKUP FIM DE SEMANA\n\nVocê recebeu ${msgs.length} mensagens no fim de semana.\n\n${msgs
        .slice(0, 10)
        .map((m) => `• ${m.lead?.nome || 'Lead'}: "${m.texto.slice(0, 60)}..."`)
        .join('\n')}\n\n➡️ Ação: revisar e responder agora.`;

      const result = await this.whatsappService.sendText({ phone: sdr.whatsapp, message: text });
      if (result) sent++;
    }

    return { ok: true, totalMessages: messages.length, sdrsNotified: sent };
  }
}
