import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class SdrService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { nome: string; whatsapp: string }) {
    return this.prisma.sdr.create({
      data: { nome: data.nome, whatsapp: data.whatsapp, ativo: true },
    });
  }

  async findAll() {
    return this.prisma.sdr.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
