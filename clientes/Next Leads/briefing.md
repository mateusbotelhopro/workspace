# Briefing — Next Leads

## Negócio
Next Leads é um SaaS de radar comercial para LinkedIn. Captura mensagens recebidas nas contas LinkedIn dos clientes via Unipile, classifica com IA (OpenAI gpt-4.1-mini) e envia alertas no WhatsApp do SDR responsável via Z-API. Possui SLA automático (30 e 60 min) e resumo semanal de fim de semana.

**Produto em produção desde maio/2026.** 11.000+ jobs processados, 31+ contas LinkedIn conectadas, 6 SDRs ativos, 12+ clientes operando.

## Objetivo principal
1. Site institucional + blog SEO (nextleads.com.br) — já publicado, ~90 páginas (blog, glossário, landing pages, ferramentas)
2. API de automação (api.nextleads.cloud) — MVP entregue e em produção
3. Evolução do produto: dashboard visual, multi-empresa, login/permissões, integração CRM, cobrança SaaS

## Público / cliente ideal
Empresas B2B que usam LinkedIn para prospecção ativa. Times comerciais com SDRs que perdem leads por não verem mensagens a tempo, sem priorização por temperatura/intenção, sem cobrança automática de resposta.

## Histórico de tráfego/marketing
Site com estratégia de conteúdo SEO agressiva: blog com 40+ artigos sobre prospecção B2B, SDR, terceirização, cadência, ferramentas. Landing pages comparativas (V4 Company, tráfego pago vs prospecção). Glossário de vendas B2B. Ferramentas interativas (calculadora ROI, quiz maturidade, recomendador de nicho).

## Investimento previsto
[a definir]

## Concorrentes de referência
V4 Company (comparação direta em landing pages), agências de BPO de SDR

## Prazo / meta
- MVP da API: entregue (maio/2026)
- v1.1: histórico por lead, filtros, retry de alertas, painel de contas
- v1.2: dashboard visual, métricas de conversão, status follow-up
- v2.0: multi-empresa, login, permissões, playbooks IA, CRM, cobrança SaaS

## Observações adicionais
- Stack backend: NestJS 11 + TypeScript, PostgreSQL 15 + Prisma, Redis 7 + Bull, Docker Compose em VPS (72.60.243.27)
- Alerta de segurança: docker-compose.yml no servidor tem credenciais hardcoded (pendente migrar para .env)
- Site é HTML estático puro (sem framework), hospedado com .htaccess (Apache/Hostinger provável)
- Acessos e mapeamento SDR/contas documentados em `api.nextleads.cloud/docs/`
