import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async home(@Headers('x-nextleads-secret') secret?: string) {
    if (secret !== process.env.INTERNAL_API_SECRET) {
      throw new UnauthorizedException();
    }

    const [totalLeads, totalMessages, totalSdrs, totalAccounts, lastMessages, sdrs, accounts] =
      await Promise.all([
        this.prisma.lead.count(),
        this.prisma.message.count(),
        this.prisma.sdr.count({ where: { ativo: true } }),
        this.prisma.linkedinAccount.count({ where: { ativo: true } }),
        this.prisma.message.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { lead: { include: { sdr: true, linkedinAccount: true } }, aiAnalysis: true },
        }),
        this.prisma.sdr.findMany({
          where: { ativo: true },
          include: { linkedinAccounts: true, leads: true },
          orderBy: { nome: 'asc' },
        }),
        this.prisma.linkedinAccount.findMany({
          where: { ativo: true },
          include: { sdr: true, leads: true },
          orderBy: { accountName: 'asc' },
        }),
      ]);

    return `<!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8" /><title>Next Leads Dashboard</title></head><body>
<h1>Next Leads — ${totalLeads} leads | ${totalMessages} mensagens | ${totalSdrs} SDRs | ${totalAccounts} contas</h1>
</body></html>`;
  }

  @Get('/health')
  health() {
    return { ok: true, uptime: process.uptime() };
  }
}
