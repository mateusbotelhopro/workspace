import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { isBusinessHours } from '../../infra/date/business-hours';

@Injectable()
export class ResponseSlaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
  ) {}

  async checkPendingResponses() {
    if (!isBusinessHours()) return { skipped: true, reason: 'Fora do horário comercial' };

    const groupId = process.env.GLOBAL_ALERT_GROUP_ID;
    if (!groupId) return { skipped: true, reason: 'GLOBAL_ALERT_GROUP_ID não configurado' };

    const now = new Date();
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 120 * 60 * 1000);

    // Leads que têm mensagens inbound entre 30min e 2h atrás (janela de alerta)
    const recentInbound = await this.prisma.message.findMany({
      where: {
        direction: 'inbound',
        receivedAt: { gte: twoHoursAgo, lte: thirtyMinAgo },
        leadId: { not: null },
      },
      select: { leadId: true },
      distinct: ['leadId'],
    });

    const leadIds = recentInbound.map((m) => m.leadId as string);
    if (!leadIds.length) return { ok: true, alertsSent30: 0, alertsSent60: 0 };

    let alertsSent30 = 0;
    let alertsSent60 = 0;

    for (const leadId of leadIds) {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId },
        include: { sdr: true, linkedinAccount: true },
      });
      if (!lead) continue;

      // Últimas mensagens do lead ordenadas por data desc
      const messages = await this.prisma.message.findMany({
        where: { leadId },
        orderBy: { receivedAt: 'desc' },
        take: 20,
        include: { aiAnalysis: true },
      });

      const lastInbound = messages.find((m) => m.direction === 'inbound');
      if (!lastInbound) continue;

      // SDR já respondeu após a última mensagem do lead?
      const lastOutbound = messages.find((m) => m.direction === 'outbound');
      if (lastOutbound && lastOutbound.receivedAt > lastInbound.receivedAt) continue;

      const minutesSince = (now.getTime() - lastInbound.receivedAt.getTime()) / 60000;
      if (minutesSince < 30 || minutesSince > 120) continue;

      const threshold = minutesSince >= 60 ? 60 : 30;
      const slaStatus = `sla_${threshold}min`;

      // Alerta já foi enviado para esta mensagem neste threshold?
      const alreadySent = await this.prisma.whatsappLog.findFirst({
        where: { messageId: lastInbound.id, status: slaStatus },
      });
      if (alreadySent) continue;

      const analysis = lastInbound.aiAnalysis;
      const minutes = Math.round(minutesSince);
      const emoji = threshold === 60 ? '🔴' : '🟡';

      const alertLines = [
        `${emoji} ALERTA SLA — ${threshold} minutos sem resposta`,
        '',
        `👩‍💼 SDR: ${lead.sdr?.nome || 'Não identificada'}`,
        `👤 Lead: ${lead.nome || 'Nome não identificado'}`,
        '',
        `💬 Última mensagem:`,
        `"${lastInbound.texto.slice(0, 200)}"`,
        '',
        `⏱ Tempo sem resposta: ${minutes} min`,
      ];

      if (analysis) {
        alertLines.push(
          '',
          `📊 Análise IA:`,
          `• 🔥 Temperatura: ${analysis.temperatura || '-'}`,
          `• 🎯 Intenção: ${analysis.intencao || '-'}`,
          `• ⚡ Prioridade: ${analysis.prioridade || '-'}`,
          '',
          `➡️ Próximo passo:`,
          analysis.proximoPasso || 'Responder o lead imediatamente.',
        );
      }

      const message = alertLines.join('\n');

      // Envia para o SDR individual
      if (lead.sdr?.whatsapp) {
        await this.whatsappService.sendText({
          phone: lead.sdr.whatsapp,
          message,
          messageId: lastInbound.id,
          sdrId: lead.sdrId,
        });
      }

      // Envia para o grupo geral
      const resultGroup = await this.whatsappService.sendText({
        phone: groupId,
        message,
        messageId: lastInbound.id,
        sdrId: lead.sdrId,
      });

      // Registra o SLA como enviado (dedup na próxima rodada do cron)
      if (resultGroup || lead.sdr?.whatsapp) {
        await this.prisma.whatsappLog.create({
          data: {
            messageId: lastInbound.id,
            sdrId: lead.sdrId,
            status: slaStatus,
            sentAt: new Date(),
            retryCount: 0,
          },
        });

        if (threshold === 60) alertsSent60++;
        else alertsSent30++;
      }
    }

    return { ok: true, alertsSent30, alertsSent60 };
  }
}
