import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../../infra/prisma/prisma.service';

type LeadAnalysis = {
  resumo: string;
  temperatura: 'frio' | 'morno' | 'quente';
  intencao: 'duvida' | 'interesse' | 'preco' | 'objecao' | 'agendamento' | 'rejeicao' | 'outro';
  prioridade: 'baixa' | 'media' | 'alta';
  proximo_passo: string;
  resposta_sugerida: string;
};

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async analyzeMessage(data: { messageId: string; leadName?: string | null; texto: string }) {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY ausente. Pulando análise IA.');
      return null;
    }

    try {
      console.log('IA iniciada para mensagem:', data.messageId);

      const response = await this.openai.responses.create({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: 'Você é um analista SDR. Analise respostas recebidas no LinkedIn e retorne apenas JSON estruturado.',
          },
          {
            role: 'user',
            content: `Lead: ${data.leadName || 'Não informado'}\n\nMensagem recebida:\n"${data.texto}"\n\nClassifique a mensagem para um SDR comercial.`,
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'lead_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                resumo: { type: 'string' },
                temperatura: { type: 'string', enum: ['frio', 'morno', 'quente'] },
                intencao: { type: 'string', enum: ['duvida', 'interesse', 'preco', 'objecao', 'agendamento', 'rejeicao', 'outro'] },
                prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
                proximo_passo: { type: 'string' },
                resposta_sugerida: { type: 'string' },
              },
              required: ['resumo', 'temperatura', 'intencao', 'prioridade', 'proximo_passo', 'resposta_sugerida'],
            },
          },
        },
      });

      const analysis = JSON.parse(response.output_text) as LeadAnalysis;
      console.log('IA finalizada:', { temperatura: analysis.temperatura, intencao: analysis.intencao, prioridade: analysis.prioridade });

      return this.prisma.aiAnalysis.create({
        data: {
          messageId: data.messageId,
          resumo: analysis.resumo,
          temperatura: analysis.temperatura,
          intencao: analysis.intencao,
          prioridade: analysis.prioridade,
          proximoPasso: analysis.proximo_passo,
          respostaSugerida: analysis.resposta_sugerida,
        },
      });
    } catch (error) {
      console.error('Erro na análise IA:', error);
      return null;
    }
  }
}
