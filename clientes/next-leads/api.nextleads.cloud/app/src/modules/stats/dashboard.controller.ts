import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import type { Response } from 'express';
import { InternalSecretGuard } from '../../infra/auth/internal-secret.guard';

@Controller('dashboard')
@UseGuards(InternalSecretGuard)
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getDashboard(@Res() res: Response) {
    const [totalLeads, totalMessages, whatsappSent, whatsappFailed, sla30Sent, sla60Sent, lastMessages] =
      await Promise.all([
        this.prisma.lead.count(),
        this.prisma.message.count(),
        this.prisma.whatsappLog.count({ where: { status: 'sent' } }),
        this.prisma.whatsappLog.count({ where: { status: 'failed' } }),
        this.prisma.whatsappLog.count({ where: { status: { in: ['sla_30min', 'sla_30_sent'] } } }),
        this.prisma.whatsappLog.count({ where: { status: { in: ['sla_60min', 'sla_60_sent'] } } }),
        this.prisma.message.findMany({
          take: 15,
          orderBy: { createdAt: 'desc' },
          include: { lead: { include: { sdr: true } }, aiAnalysis: true },
        }),
      ]);

    const html = `<html><head><title>Next Leads</title></head><body style="font-family:Arial;background:#0A1F44;color:white;padding:20px">
<h1>🚀 Next Leads</h1>
<p>Leads: ${totalLeads} | Mensagens: ${totalMessages} | Enviados: ${whatsappSent} | Falhas: ${whatsappFailed} | SLA30: ${sla30Sent} | SLA60: ${sla60Sent}</p>
${lastMessages.map((m) => `<div style="background:#111;padding:15px;margin:10px 0;border-radius:10px">
<b>${m.lead?.nome || 'Lead'}</b> → ${m.lead?.sdr?.nome || 'SEM SDR'}<br/>
${m.texto}<br/>
<small>${new Date(m.createdAt).toLocaleString('pt-BR')} | ${m.aiAnalysis?.temperatura || '-'} | ${m.aiAnalysis?.intencao || '-'}</small>
</div>`).join('')}
</body></html>`;

    return res.send(html);
  }
}
