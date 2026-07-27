import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class WhatsappService {
  constructor(private readonly prisma: PrismaService) {}

  formatAlert(data: {
    sdrName?: string | null;
    linkedinAccountName?: string | null;
    leadName?: string | null;
    text: string;
    analysis?: {
      temperatura?: string | null;
      intencao?: string | null;
      prioridade?: string | null;
      resumo?: string | null;
      proximoPasso?: string | null;
      respostaSugerida?: string | null;
    } | null;
  }) {
    const analysis = data.analysis;

    return `🚨 Nova mensagem no LinkedIn

👩‍💼 SDR: ${data.sdrName || 'Não identificada'}
🔗 Conta LinkedIn: ${data.linkedinAccountName || 'Não identificada'}
👤 Lead: ${data.leadName || 'Nome não identificado'}
💬 Mensagem:
"${data.text}"

📊 Análise IA:
• 🔥 Temperatura: ${analysis?.temperatura || 'Não analisado'}
• 🎯 Intenção: ${analysis?.intencao || 'Não analisado'}
• ⚡ Prioridade: ${analysis?.prioridade || 'Não analisado'}

🧠 Resumo:
${analysis?.resumo || 'Análise indisponível.'}

➡️ Próximo passo:
${analysis?.proximoPasso || 'Responder manualmente assim que possível.'}

💬 Sugestão de resposta:
"${analysis?.respostaSugerida || 'Olá, tudo bem? Me fala um pouco mais sobre o que você precisa.'}"`;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendText(data: {
    phone: string;
    message: string;
    messageId?: string;
    sdrId?: string | null;
  }) {
    const instanceId = process.env.ZAPI_INSTANCE_ID;
    const token = process.env.ZAPI_TOKEN;
    const clientToken = process.env.ZAPI_CLIENT_TOKEN;

    if (!instanceId || !token || !clientToken) {
      console.warn('Credenciais Z-API ausentes.');
      await this.prisma.whatsappLog.create({
        data: {
          messageId: data.messageId || null,
          sdrId: data.sdrId || null,
          status: 'skipped_missing_credentials',
          error: 'ZAPI_INSTANCE_ID, ZAPI_TOKEN ou ZAPI_CLIENT_TOKEN ausente',
          retryCount: 0,
        },
      });
      return null;
    }

    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;
    let lastError = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.post(
          url,
          { phone: data.phone, message: data.message },
          {
            headers: { 'Content-Type': 'application/json', 'Client-Token': clientToken },
            timeout: 15000,
          },
        );

        await this.prisma.whatsappLog.create({
          data: {
            messageId: data.messageId || null,
            sdrId: data.sdrId || null,
            status: 'sent',
            sentAt: new Date(),
            error: null,
            retryCount: attempt - 1,
          },
        });

        console.log('WhatsApp enviado:', response.data);
        return response.data;
      } catch (error: any) {
        lastError = error?.response?.data
          ? JSON.stringify(error.response.data)
          : error?.message || 'Erro desconhecido ao enviar WhatsApp';

        console.error(`Erro ao enviar WhatsApp. Tentativa ${attempt}/3:`, lastError);
        if (attempt < 3) await this.sleep(3000);
      }
    }

    await this.prisma.whatsappLog.create({
      data: {
        messageId: data.messageId || null,
        sdrId: data.sdrId || null,
        status: 'failed',
        error: lastError,
        retryCount: 3,
      },
    });

    return null;
  }
}
