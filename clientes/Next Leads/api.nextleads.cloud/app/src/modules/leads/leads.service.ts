import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateLead(data: {
    nome?: string;
    linkedinProfileUrl?: string;
    unipileChatId?: string;
    sdrId?: string;
  }) {
    if (data.unipileChatId) {
      const existing = await this.prisma.lead.findUnique({
        where: { unipileChatId: data.unipileChatId },
      });

      if (existing) return existing;
    }

    return this.prisma.lead.create({
      data: {
        nome: data.nome || null,
        linkedinProfileUrl: data.linkedinProfileUrl || null,
        unipileChatId: data.unipileChatId || null,
        sdrId: data.sdrId || null,
      },
    });
  }

  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        sdr: true,
        messages: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
