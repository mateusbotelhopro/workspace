import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { InternalSecretGuard } from '../../infra/auth/internal-secret.guard';

@Controller('stats')
@UseGuards(InternalSecretGuard)
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getStats() {
    const [totalLeads, totalMessages, whatsappSent, whatsappFailed, sla30Sent, sla60Sent, linkedAccounts, activeSdrs, lastMessages] =
      await Promise.all([
        this.prisma.lead.count(),
        this.prisma.message.count(),
        this.prisma.whatsappLog.count({ where: { status: 'sent' } }),
        this.prisma.whatsappLog.count({ where: { status: 'failed' } }),
        this.prisma.whatsappLog.count({ where: { status: { in: ['sla_30min', 'sla_30_sent'] } } }),
        this.prisma.whatsappLog.count({ where: { status: { in: ['sla_60min', 'sla_60_sent'] } } }),
        this.prisma.linkedinAccount.count({ where: { ativo: true } }),
        this.prisma.sdr.count({ where: { ativo: true } }),
        this.prisma.message.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { lead: { include: { sdr: true, linkedinAccount: true } }, aiAnalysis: true, whatsappLogs: true },
        }),
      ]);

    return { ok: true, overview: { totalLeads, totalMessages, whatsappSent, whatsappFailed, sla30Sent, sla60Sent, linkedAccounts, activeSdrs }, lastMessages };
  }

  @Get('accounts')
  async getAccountsStats() {
    const accounts = await this.prisma.linkedinAccount.findMany({
      orderBy: { accountName: 'asc' },
      include: { sdr: true, leads: { include: { messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { aiAnalysis: true, whatsappLogs: true } } } } },
    });

    return {
      ok: true,
      accounts: accounts.map((account) => {
        const messages = account.leads.flatMap((lead) => lead.messages);
        return {
          id: account.id,
          unipileAccountId: account.unipileAccountId,
          accountName: account.accountName,
          clientName: account.clientName,
          ativo: account.ativo,
          sdr: account.sdr ? { id: account.sdr.id, nome: account.sdr.nome, whatsapp: account.sdr.whatsapp } : null,
          totalLeads: account.leads.length,
          lastMessage: messages[0] || null,
        };
      }),
    };
  }

  @Get('sdrs')
  async getSdrsStats() {
    const sdrs = await this.prisma.sdr.findMany({
      orderBy: { nome: 'asc' },
      include: { leads: { include: { messages: { include: { aiAnalysis: true, whatsappLogs: true } } } }, linkedinAccounts: true, whatsappLogs: true },
    });

    return {
      ok: true,
      sdrs: sdrs.map((sdr) => {
        const messages = sdr.leads.flatMap((lead) => lead.messages);
        return {
          id: sdr.id, nome: sdr.nome, whatsapp: sdr.whatsapp, ativo: sdr.ativo,
          linkedAccounts: sdr.linkedinAccounts.length,
          totalLeads: sdr.leads.length,
          totalMessages: messages.length,
          whatsappSent: sdr.whatsappLogs.filter((log) => log.status === 'sent').length,
          whatsappFailed: sdr.whatsappLogs.filter((log) => log.status === 'failed').length,
          sla30Sent: sdr.whatsappLogs.filter((log) => log.status === 'sla_30min' || log.status === 'sla_30_sent').length,
          sla60Sent: sdr.whatsappLogs.filter((log) => log.status === 'sla_60min' || log.status === 'sla_60_sent').length,
        };
      }),
    };
  }

  @Get('conversations')
  async getConversationsStats() {
    const leads = await this.prisma.lead.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { sdr: true, linkedinAccount: true, messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { aiAnalysis: true, whatsappLogs: true } } },
    });

    return {
      ok: true,
      conversations: leads.map((lead) => ({
        leadId: lead.id, leadName: lead.nome, unipileChatId: lead.unipileChatId,
        sdr: lead.sdr ? { id: lead.sdr.id, nome: lead.sdr.nome, whatsapp: lead.sdr.whatsapp } : null,
        linkedinAccount: lead.linkedinAccount ? { id: lead.linkedinAccount.id, accountName: lead.linkedinAccount.accountName, clientName: lead.linkedinAccount.clientName, unipileAccountId: lead.linkedinAccount.unipileAccountId } : null,
        lastMessage: lead.messages[0] || null,
      })),
    };
  }
}
