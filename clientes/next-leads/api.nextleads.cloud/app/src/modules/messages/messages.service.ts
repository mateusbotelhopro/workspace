import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async existsByUnipileMessageId(unipileMessageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { unipileMessageId },
    });

    return !!message;
  }

  async create(data: {
    leadId?: string;
    unipileMessageId: string;
    texto: string;
    direction: string;
    receivedAt: Date;
  }) {
    return this.prisma.message.create({
      data: {
        leadId: data.leadId || null,
        unipileMessageId: data.unipileMessageId,
        texto: data.texto,
        direction: data.direction,
        receivedAt: data.receivedAt,
      },
    });
  }

  async findAll() {
    return this.prisma.message.findMany({
      include: {
        lead: {
          include: { sdr: true },
        },
        aiAnalysis: true,
        whatsappLogs: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
