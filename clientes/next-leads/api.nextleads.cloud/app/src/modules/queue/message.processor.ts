import { Processor, Process, InjectQueue } from '@nestjs/bull';
import axios from 'axios';
import type { Job, Queue } from 'bull';
import { LeadsService } from '../leads/leads.service';
import { MessagesService } from '../messages/messages.service';
import { AiService } from '../ai/ai.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { normalizeUnipileMessage } from '../webhook/normalizers/unipile-message.normalizer';
import { isBusinessHours } from '../../infra/date/business-hours';

@Processor('messages')
export class MessageProcessor {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly messagesService: MessagesService,
    private readonly aiService: AiService,
    private readonly whatsappService: WhatsappService,
    @InjectQueue('whatsapp') private readonly whatsappQueue: Queue,
  ) {}

  @Process('process-message')
  async handle(job: Job) {
    console.log('Job recebido:', job.id);

    const normalized = normalizeUnipileMessage(job.data);
    const unipileAccountId = job.data?.account_id || null;

    const linkedinAccount = unipileAccountId
      ? await this.messagesService['prisma'].linkedinAccount.findUnique({
          where: { unipileAccountId },
          include: { sdr: true },
        })
      : null;

    const linkedinAccountName =
      linkedinAccount?.clientName && linkedinAccount?.accountName
        ? `${linkedinAccount.accountName} / ${linkedinAccount.clientName}`
        : linkedinAccount?.accountName ||
          job.data?.linkedin_account_name ||
          unipileAccountId ||
          'Conta LinkedIn não identificada';

    const routedSdrId =
      linkedinAccount?.ativo && linkedinAccount?.sdrId
        ? linkedinAccount.sdrId
        : process.env.DEFAULT_SDR_ID || undefined;

    console.log('Mensagem normalizada:', { ...normalized, unipileAccountId, linkedinAccountName, routedSdrId });

    if (!normalized.texto) {
      console.warn('Mensagem sem texto. Ignorando.');
      return;
    }

    const alreadyExists = await this.messagesService.existsByUnipileMessageId(normalized.unipileMessageId);
    if (alreadyExists) {
      console.log('Mensagem duplicada. Ignorando:', normalized.unipileMessageId);
      return;
    }

    // Enriquece nome/perfil via Unipile /attendees antes de criar/atualizar o lead
    if (!normalized.leadName && normalized.unipileChatId) {
      try {
        const apiKey = process.env.UNIPILE_API_KEY;
        const dsn = process.env.UNIPILE_DSN;
        if (apiKey && dsn) {
          const resp = await axios.get(
            `https://${dsn}/api/v1/chats/${normalized.unipileChatId}/attendees`,
            { headers: { 'X-API-KEY': apiKey, accept: 'application/json' }, timeout: 10000 },
          );
          const attendees = resp.data?.items || [];
          const attendee = attendees.find((a: any) => a?.is_self === 0) || attendees[0];
          if (attendee) {
            normalized.leadName = attendee?.name || undefined;
            if (!normalized.linkedinProfileUrl && attendee?.profile_url) {
              normalized.linkedinProfileUrl = attendee.profile_url;
            }
          }
        }
      } catch {
        // falha silenciosa — continua sem nome
      }
    }

    const lead = await this.leadsService.findOrCreateLead({
      nome: normalized.leadName,
      linkedinProfileUrl: normalized.linkedinProfileUrl,
      unipileChatId: normalized.unipileChatId,
      sdrId: routedSdrId,
    });

    const updatedLead = await this.messagesService['prisma'].lead.update({
      where: { id: lead.id },
      data: {
        nome: normalized.leadName || lead.nome || null,
        sdrId: routedSdrId || lead.sdrId || null,
        linkedinAccountId: linkedinAccount?.id || null,
      },
      include: { sdr: true, linkedinAccount: true },
    });

    const message = await this.messagesService.create({
      leadId: updatedLead.id,
      unipileMessageId: normalized.unipileMessageId,
      texto: normalized.texto,
      direction: normalized.direction,
      receivedAt: normalized.receivedAt,
    });

    console.log('Mensagem salva no banco:', message.id);

    const analysis = await this.aiService.analyzeMessage({
      messageId: message.id,
      leadName: updatedLead.nome,
      texto: message.texto,
    });

    if (analysis) console.log('Análise IA salva:', analysis.id);
    else console.warn('Mensagem salva sem análise IA.');

    const sdr = updatedLead.sdrId
      ? await this.messagesService['prisma'].sdr.findUnique({ where: { id: updatedLead.sdrId } })
      : null;

    if (!isBusinessHours(new Date())) {
      console.log('Fora do horário comercial. Alerta WhatsApp não enviado.');
      await this.messagesService['prisma'].whatsappLog.create({
        data: {
          messageId: message.id,
          sdrId: sdr?.id || null,
          status: 'skipped_outside_business_hours',
          error: 'Fora do horário comercial: segunda a sexta, 08h às 18h',
        },
      });
      return;
    }

    const alertMessage = this.whatsappService.formatAlert({
      sdrName: sdr?.nome,
      linkedinAccountName,
      leadName: updatedLead.nome,
      text: message.texto,
      analysis,
    });

    if (sdr?.whatsapp) {
      await this.whatsappQueue.add(
        'send-whatsapp',
        { phone: sdr.whatsapp, message: alertMessage, messageId: message.id, sdrId: sdr.id },
        { attempts: 5, backoff: { type: 'exponential', delay: 10000 }, removeOnComplete: true, removeOnFail: false },
      );
      console.log('Mensagem adicionada na fila WhatsApp para SDR:', { sdr: sdr.nome, whatsapp: sdr.whatsapp });

      // SDR secundária (ex: José Luiz → Gabi + Evelly)
      const secondarySdrId = (linkedinAccount as any)?.secondarySdrId;
      if (secondarySdrId) {
        const secondarySdr = await this.messagesService['prisma'].sdr.findUnique({ where: { id: secondarySdrId } });
        if (secondarySdr?.whatsapp) {
          const secondaryAlert = this.whatsappService.formatAlert({
            sdrName: secondarySdr.nome,
            linkedinAccountName,
            leadName: updatedLead.nome,
            text: message.texto,
            analysis,
          });
          await this.whatsappQueue.add(
            'send-whatsapp',
            { phone: secondarySdr.whatsapp, message: secondaryAlert, messageId: message.id, sdrId: secondarySdr.id },
            { attempts: 5, backoff: { type: 'exponential', delay: 10000 }, removeOnComplete: true, removeOnFail: false },
          );
          console.log('Mensagem adicionada na fila WhatsApp para SDR secundária:', { sdr: secondarySdr.nome });
        }
      }
    } else {
      await this.messagesService['prisma'].whatsappLog.create({
        data: {
          messageId: message.id,
          sdrId: updatedLead.sdrId || null,
          status: 'skipped_missing_sdr_whatsapp',
          error: 'SDR não encontrado ou sem WhatsApp',
        },
      });
    }

    const groupId = process.env.GLOBAL_ALERT_GROUP_ID;
    if (groupId) {
      await this.whatsappQueue.add(
        'send-whatsapp',
        { phone: groupId, message: `👥 ALERTA GERAL - NOVA MENSAGEM\n\n${alertMessage}`, messageId: message.id, sdrId: null },
        { attempts: 5, backoff: { type: 'exponential', delay: 10000 }, removeOnComplete: true, removeOnFail: false },
      );
      console.log('Mensagem adicionada na fila WhatsApp para grupo geral.');
    }
  }
}
