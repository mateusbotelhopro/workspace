# Next Leads

**Cliente:** Next Leads  
**Tipo:** SaaS — Radar Comercial LinkedIn  
**API:** https://api.nextleads.cloud  
**Status:** Em produção (11.000+ jobs processados)  
**Atualizado:** 2026-05-18

---

## O que é

Sistema que captura mensagens do LinkedIn via Unipile, classifica com IA e envia alertas no WhatsApp do SDR. Possui SLA automático (alerta em 30 e 60 min sem resposta) e sincronização ativa a cada 30 segundos.

---

## Arquitetura real (produção)

```
LinkedIn
  ↓
Unipile (webhook + polling a cada 30s)
  ↓
POST /webhooks/unipile/message
  ↓
Fila "messages" (Bull/Redis)
  ↓
MessageProcessor
  ├── Normaliza payload
  ├── Roteia para SDR via LinkedinAccount → sdrId
  ├── Cria/atualiza Lead
  ├── Salva Message
  ├── AiService (OpenAI Responses API gpt-4.1-mini)
  └── Fila "whatsapp" (Bull/Redis)
        ↓
        WhatsappProcessor (delay humanizado 3-8s)
        ↓
        Z-API → WhatsApp do SDR

Cron ResponseSLA (a cada 5 min)
  └── Se inbound sem resposta > 30 min → alerta ⚠️
  └── Se inbound sem resposta > 60 min → alerta 🚨
```

---

## Estrutura real do código

```
src/
  app.module.ts
  infra/
    auth/internal-secret.guard.ts    ← header x-nextleads-secret
    date/business-hours.ts           ← seg-sex 08h-18h
    prisma/prisma.module.ts + service
  modules/
    ai/                              ← OpenAI Responses API + json_schema strict
    leads/                           ← findOrCreateLead
    linkedin-accounts/               ← mapeamento conta → SDR (protegido por guard)
    messages/                        ← CRUD + existsByUnipileMessageId
    queue/
      message.processor.ts           ← fila "messages"
      whatsapp.processor.ts          ← fila "whatsapp" com delay humanizado
    response-sla/
      response-sla.cron.ts           ← cron 5min
      response-sla.service.ts        ← lógica SLA 30min/60min
      weekend-summary.cron.ts        ← resumo de fim de semana
      weekend-summary.service.ts
    sdr/
    stats/                           ← dashboard + stats
    unipile/
      unipile.cron.ts                ← cron 30s
      unipile.service.ts             ← syncMessages() + getChatInfo()
    webhook/
      normalizers/unipile-message.normalizer.ts
      webhook.controller.ts + module
    whatsapp/                        ← Z-API com retry 3x + logs
    zapi-webhook/                    ← recebe status de entrega da Z-API
```

---

## Schema real do banco

| Tabela             | Finalidade                                      |
|--------------------|--------------------------------------------------|
| `sdrs`             | SDRs com `nome`, `whatsapp`, `ativo`            |
| `linkedin_accounts`| Conta LinkedIn → SDR responsável                |
| `leads`            | Leads por `unipileChatId`                       |
| `messages`         | Mensagens com `texto`, `direction`, `rawPayload`|
| `ai_analysis`      | Análise IA separada: `temperatura`, `intencao`, `prioridade`, `resumo`, `respostaSugerida` |
| `whatsapp_logs`    | Log de envios: `sent`, `sla_30_sent`, `sla_60_sent`, `failed`, `skipped_*` |

---

## Variáveis de ambiente

Ver [.env.example](app/.env.example).  
**As credenciais reais ficam no docker-compose.yml do servidor** — ver seção de segurança abaixo.

---

## ⚠️ Alerta de segurança

**O docker-compose.yml no servidor (`/root/docker-compose.yml`) contém credenciais reais hardcoded nas `environment:` em vez de usar `env_file:`.**

Isso significa que qualquer pessoa com acesso à VPS vê as chaves.

**Ação recomendada:**
1. Criar `/root/.env` com as credenciais reais
2. Substituir `environment:` por `env_file: - .env` no docker-compose
3. Rotacionar as chaves que foram expostas nesta análise:
   - `OPENAI_API_KEY`
   - `UNIPILE_API_KEY`
   - `ZAPI_TOKEN` / `ZAPI_CLIENT_TOKEN`

---

## Endpoints

| Método | Rota                            | Auth                   | Descrição                    |
|--------|---------------------------------|------------------------|------------------------------|
| GET    | /health                         | —                      | Health check                 |
| POST   | /webhooks/unipile/message       | —                      | Webhook Unipile              |
| POST   | /sdrs                           | —                      | Cadastrar SDR                |
| GET    | /sdrs                           | —                      | Listar SDRs                  |
| GET    | /leads                          | —                      | Listar leads                 |
| GET    | /messages                       | —                      | Listar mensagens             |
| GET    | /linkedin-accounts              | x-nextleads-secret     | Listar contas LinkedIn       |
| POST   | /linkedin-accounts              | x-nextleads-secret     | Cadastrar/editar conta       |
| GET    | /stats                          | —                      | Estatísticas                 |
| GET    | /dashboard                      | —                      | Dashboard                    |

---

## Estado atual (2026-05-18)

- 12 SDRs ativos
- Sistema processando em produção há 4+ dias
- Job #11.390 — mais de 11 mil jobs processados
- `IGNORE_BUSINESS_HOURS=true` ativo (enviando alertas 24h)
- `GLOBAL_ALERT_GROUP_ID` não configurado (grupo geral desativado)
- Apenas 1 conta Unipile configurada: José Luiz / Next Leads
