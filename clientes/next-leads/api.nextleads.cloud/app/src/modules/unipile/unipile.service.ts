import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class UnipileService {
  constructor(
    @InjectQueue('messages') private readonly queue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async getChatInfo(chatId: string) {
    const apiKey = process.env.UNIPILE_API_KEY;
    const dsn = process.env.UNIPILE_DSN;
    if (!apiKey || !dsn || !chatId) return null;
    try {
      const response = await axios.get(`https://${dsn}/api/v1/chats/${chatId}`, {
        headers: { 'X-API-KEY': apiKey, accept: 'application/json' },
        timeout: 15000,
      });
      return response.data;
    } catch {
      return null;
    }
  }

  extractLeadName(chat: any, item: any) {
    const fallback = item?.sender_id || item?.sender_attendee_id || 'LinkedIn';
    if (!chat) return fallback;
    const participants = chat.participants || chat.attendees || chat.members || [];
    if (!Array.isArray(participants) || participants.length === 0) {
      return chat.name || chat.full_name || chat.title || fallback;
    }
    const lead =
      participants.find((p: any) =>
        p?.id === item.sender_id ||
        p?.provider_id === item.sender_id ||
        p?.attendee_id === item.sender_attendee_id ||
        p?.id === item.sender_attendee_id,
      ) || participants[0];
    return lead?.name || lead?.full_name || lead?.display_name || lead?.public_identifier || fallback;
  }

  private async syncAccount(unipileAccountId: string, accountName: string) {
    const apiKey = process.env.UNIPILE_API_KEY;
    const dsn = process.env.UNIPILE_DSN;

    const response = await axios.get(
      `https://${dsn}/api/v1/messages?account_id=${unipileAccountId}`,
      {
        headers: { 'X-API-KEY': apiKey, accept: 'application/json' },
        timeout: 20000,
      },
    );

    const items = response.data?.items || [];
    const inbound = items.filter((item: any) => item?.is_sender === 0 && item?.text && item?.id);

    let queued = 0;
    let skipped = 0;

    for (const item of inbound) {
      const exists = await this.prisma.message.findUnique({
        where: { unipileMessageId: item.id },
      });

      if (exists) { skipped++; continue; }

      const chat = await this.getChatInfo(item.chat_id);
      const leadName = this.extractLeadName(chat, item);

      await this.queue.add('process-message', {
        id: item.id,
        text: item.text,
        sender_name: leadName,
        chat_id: item.chat_id,
        direction: 'inbound',
        timestamp: item.timestamp,
        account_id: unipileAccountId,
        linkedin_account_name: accountName,
        provider_id: item.provider_id,
      });

      queued++;
    }

    return { total: items.length, inbound: inbound.length, queued, skipped };
  }

  async syncMessages() {
    const apiKey = process.env.UNIPILE_API_KEY;
    const dsn = process.env.UNIPILE_DSN;
    if (!apiKey || !dsn) throw new Error('Credenciais Unipile ausentes');

    const accounts = await this.prisma.linkedinAccount.findMany({
      where: { ativo: true },
    });

    if (accounts.length === 0) {
      console.warn('Nenhuma conta LinkedIn ativa no banco.');
      return { ok: true, accounts: 0, total: 0, inbound: 0, queued: 0, skipped: 0 };
    }

    let total = 0, inbound = 0, queued = 0, skipped = 0;

    for (const account of accounts) {
      try {
        const result = await this.syncAccount(account.unipileAccountId, account.accountName);
        total += result.total;
        inbound += result.inbound;
        queued += result.queued;
        skipped += result.skipped;
      } catch (err) {
        console.error(`Erro ao sincronizar conta ${account.accountName}:`, err.message);
      }
    }

    return { ok: true, accounts: accounts.length, total, inbound, queued, skipped };
  }
}
