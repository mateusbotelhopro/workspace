# MVP — Next Leads (Real)

> Status atual do sistema em produção. Atualizado em: 2026-05-18

---

## Status do MVP

**O MVP está entregue e em produção.**

| Critério | Status |
|----------|--------|
| API online em api.nextleads.cloud | ✅ |
| /health respondendo | ✅ |
| PostgreSQL + Redis rodando | ✅ |
| Docker Compose estável (4+ dias) | ✅ |
| Webhook Unipile recebendo | ✅ |
| Sync polling a cada 30s | ✅ |
| Fila Bull processando | ✅ |
| Lead criado/atualizado | ✅ |
| Mensagem salva sem duplicata | ✅ |
| IA classificando (gpt-4.1-mini) | ✅ |
| Alerta WhatsApp enviado | ✅ |
| SLA 30min e 60min | ✅ |
| Resumo fim de semana (2ª 08h) | ✅ |
| Roteamento por conta LinkedIn | ✅ (corrigido 2026-05-18) |
| Alerta para grupo geral | ✅ (configurado 2026-05-18) |

---

## Estrutura de módulos

```
src/
  app.controller.ts          ← dashboard HTML (GET /) + health
  app.module.ts
  app.service.ts

  infra/
    auth/internal-secret.guard.ts    ← header x-nextleads-secret
    date/business-hours.ts           ← seg-sex 08h-18h (America/Sao_Paulo)
    prisma/prisma.module.ts
    prisma/prisma.service.ts

  modules/
    ai/                      ← OpenAI Responses API, JSON Schema strict
    leads/                   ← upsert por unipileChatId
    linkedin-accounts/       ← mapeamento conta → SDR (guard)
    messages/                ← CRUD + existsByUnipileMessageId
    queue/
      message.processor.ts   ← fila "messages": normaliza→lead→msg→IA→whatsapp
      whatsapp.processor.ts  ← fila "whatsapp": delay humanizado 3-8s
      queue.module.ts        ← 2 filas registradas
    response-sla/
      response-sla.cron.ts   ← cron 5min
      response-sla.service.ts← lógica SLA 30/60min + consulta Unipile
      response-sla.controller.ts ← POST /response-sla/check (guard)
      weekend-summary.cron.ts← cron 2ª 08h SP
      weekend-summary.service.ts ← resume sáb/dom por SDR
    sdr/                     ← POST e GET /sdrs
    stats/
      stats.controller.ts    ← /stats, /stats/accounts, /stats/sdrs, /stats/conversations
      dashboard.controller.ts← /dashboard HTML (guard)
    unipile/
      unipile.cron.ts        ← cron 30s → syncMessages()
      unipile.service.ts     ← itera todas as contas ativas + getChatInfo
      unipile.controller.ts  ← POST /unipile/sync (guard)
    webhook/
      webhook.controller.ts  ← POST /webhooks/unipile/message
      normalizers/unipile-message.normalizer.ts
    whatsapp/                ← Z-API: retry 3x, logs, formatAlert()
    zapi-webhook/            ← recebe eventos de entrega da Z-API
```

---

## Fluxo completo

```
1. Lead responde no LinkedIn
2. Unipile dispara webhook → POST /webhooks/unipile/message
   OU cron 30s detecta mensagem nova via polling
3. Payload entra na fila "messages"
4. MessageProcessor:
   a. normalizeUnipileMessage() — extrai campos, limpa nomes inválidos
   b. Busca linkedinAccount por account_id → routedSdrId
   c. findOrCreateLead() — upsert por unipileChatId
   d. messagesService.create() — salva, evita duplicata
   e. aiService.analyzeMessage() — OpenAI retorna JSON estruturado
   f. Verifica horário comercial (ou IGNORE_BUSINESS_HOURS)
   g. Adiciona na fila "whatsapp" para o SDR
   h. Se GLOBAL_ALERT_GROUP_ID → também envia pro grupo
5. WhatsappProcessor:
   a. Delay aleatório 3-8s (humanização)
   b. Z-API send-text com retry 3x
   c. Loga resultado em whatsapp_logs
6. Cron 5min — ResponseSlaService:
   a. Busca mensagens inbound > 30 min
   b. Consulta Unipile: SDR respondeu?
   c. Se não → alerta SLA (30 ou 60 min)
7. Cron segunda 08h — WeekendSummaryService:
   a. Resume mensagens de sáb/dom por SDR
   b. Envia resumo no WhatsApp
```

---

## Variáveis de ambiente

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nextleads
REDIS_URL=redis://redis:6379
PORT=3000

OPENAI_API_KEY=sk-...

UNIPILE_API_KEY=
UNIPILE_DSN=api42.unipile.com:17201
UNIPILE_ACCOUNT_ID=         # legado — sync agora usa DB

ZAPI_INSTANCE_ID=
ZAPI_TOKEN=
ZAPI_CLIENT_TOKEN=

DEFAULT_SDR_ID=             # fallback quando conta sem SDR mapeado
INTERNAL_API_SECRET=        # header x-nextleads-secret (rotas protegidas)
INTERNAL_SECRET=            # header x-nextleads-secret (GET /)
GLOBAL_ALERT_GROUP_ID=      # ID do grupo WhatsApp para cópia de todos alertas

IGNORE_BUSINESS_HOURS=false # true = envia 24h (produção atual: true)
```

---

## Payload de teste

```bash
curl -X POST https://api.nextleads.cloud/webhooks/unipile/message \
  -H "Content-Type: application/json" \
  -d '{
    "id": "msg_test_001",
    "text": "Tenho interesse, como funciona?",
    "chat_id": "chat_test_001",
    "account_id": "0jNmMm7uT6OKXTEoV0q57g",
    "direction": "inbound",
    "timestamp": "2026-05-18T12:00:00.000Z",
    "sender": { "name": "João Teste" }
  }'
```

---

## Roadmap pós-MVP

| Versão | Features |
|--------|---------|
| v1.1 | Histórico por lead, filtros por temperatura/SDR, retry de alertas, painel de contas LinkedIn |
| v1.2 | Dashboard visual completo, métricas de conversão, status de follow-up por lead |
| v2.0 | Multi-empresa, login, permissões, playbooks de IA, integração CRM, cobrança SaaS |
