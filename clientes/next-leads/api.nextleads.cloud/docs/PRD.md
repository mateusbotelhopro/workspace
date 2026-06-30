# PRD — Next Leads (Real)

> Documento baseado no sistema em produção. Atualizado em: 2026-05-18

---

## 1. O que é

**Next Leads** é um radar comercial inteligente para LinkedIn.

Captura mensagens recebidas nas contas LinkedIn dos clientes via Unipile, classifica com IA e envia alertas no WhatsApp do SDR responsável. Possui sistema de SLA com alertas automáticos em 30 e 60 minutos caso o SDR não responda.

---

## 2. Problema

Times comerciais perdem leads quentes no LinkedIn porque:
- SDRs não veem mensagens a tempo
- Não há priorização por temperatura ou intenção
- Nenhuma sugestão de resposta
- Sem histórico estruturado
- Sem cobrança automática de resposta

---

## 3. Solução

1. Mensagem chega no LinkedIn do cliente
2. Sistema captura, normaliza e classifica com IA
3. SDR recebe alerta no WhatsApp com resumo e sugestão
4. Se não responder em 30 min → novo alerta ⚠️
5. Se não responder em 60 min → alerta crítico 🚨
6. Segunda-feira às 8h → resumo das mensagens do fim de semana

---

## 4. Arquitetura real

```
LinkedIn (26 contas de clientes)
  ↓
Unipile (webhook em tempo real + sync polling a cada 30s)
  ↓
POST /webhooks/unipile/message
  ↓
Fila Redis "messages" (Bull)
  ↓
MessageProcessor
  ├── Normaliza payload (normalizer defensivo, múltiplos formatos)
  ├── Roteia SDR via linkedin_accounts → sdrId
  ├── Cria/atualiza Lead (upsert por unipileChatId)
  ├── Salva Message
  ├── AiService → OpenAI Responses API gpt-4.1-mini (JSON Schema strict)
  └── Fila Redis "whatsapp" (Bull)
        ↓
        WhatsappProcessor
        ├── Delay humanizado (3–8s aleatório)
        └── Z-API → WhatsApp do SDR

Cron a cada 5 min: ResponseSlaService
  ├── Consulta Unipile: houve resposta outbound?
  ├── > 30 min sem resposta → alerta ⚠️ + log sla_30_sent
  └── > 60 min sem resposta → alerta 🚨 + log sla_60_sent

Cron toda segunda 08h (SP): WeekendSummaryService
  └── Resume mensagens sáb/dom por SDR → WhatsApp

Cron a cada 30s: UnipileService.syncMessages()
  └── Itera todas as linkedin_accounts ativas → queue "messages"
```

---

## 5. Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | NestJS + TypeScript |
| Banco | PostgreSQL 15 + Prisma |
| Filas | Redis 7 + Bull (2 filas: messages, whatsapp) |
| Crons | @nestjs/schedule |
| IA | OpenAI Responses API — gpt-4.1-mini (JSON Schema strict) |
| WhatsApp | Z-API (com retry 3x e humanização) |
| LinkedIn | Unipile (webhook + polling) |
| Deploy | Docker Compose em VPS |
| Proxy | Nginx + Let's Encrypt |
| Domínio | api.nextleads.cloud |

---

## 6. Modelo de dados

### Sdr
```prisma
model Sdr {
  id        String  @id @default(uuid())
  nome      String
  whatsapp  String
  ativo     Boolean @default(true)
  createdAt DateTime @default(now())
  leads            Lead[]
  whatsappLogs     WhatsappLog[]
  linkedinAccounts LinkedinAccount[]
}
```

### LinkedinAccount
```prisma
model LinkedinAccount {
  id               String  @id @default(uuid())
  unipileAccountId String  @unique
  accountName      String
  clientName       String?
  ativo            Boolean @default(true)
  sdrId            String?
  sdr              Sdr?    @relation(...)
  leads            Lead[]
}
```

### Lead
```prisma
model Lead {
  id                 String  @id @default(uuid())
  nome               String?
  linkedinProfileUrl String?
  unipileChatId      String? @unique
  sdrId              String?
  linkedinAccountId  String?
  createdAt          DateTime @default(now())
  sdr             Sdr?
  linkedinAccount LinkedinAccount?
  messages        Message[]
}
```

### Message
```prisma
model Message {
  id               String   @id @default(uuid())
  unipileMessageId String   @unique
  leadId           String?
  texto            String
  direction        String
  receivedAt       DateTime
  createdAt        DateTime @default(now())
  lead         Lead?
  aiAnalysis   AiAnalysis?
  whatsappLogs WhatsappLog[]
}
```

### AiAnalysis
```prisma
model AiAnalysis {
  id               String  @id @default(uuid())
  messageId        String  @unique
  resumo           String?
  temperatura      String? -- frio | morno | quente
  intencao         String? -- duvida | interesse | preco | objecao | agendamento | rejeicao | outro
  prioridade       String? -- baixa | media | alta
  proximoPasso     String?
  respostaSugerida String?
  createdAt        DateTime @default(now())
}
```

### WhatsappLog
```prisma
model WhatsappLog {
  id         String    @id @default(uuid())
  messageId  String?
  sdrId      String?
  status     String    -- sent | failed | sla_30_sent | sla_60_sent | skipped_*
  error      String?
  retryCount Int       @default(0)
  sentAt     DateTime?
  createdAt  DateTime  @default(now())
}
```

---

## 7. Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | / | INTERNAL_SECRET | Dashboard HTML |
| GET | /health | — | `{ok:true, uptime:...}` |
| POST | /webhooks/unipile/message | — | Webhook Unipile |
| POST | /webhooks/zapi/received | — | Webhook Z-API entrega |
| POST | /webhooks/zapi/status | — | Webhook Z-API status |
| POST | /sdrs | — | Criar SDR |
| GET | /sdrs | — | Listar SDRs |
| GET | /leads | — | Listar leads |
| GET | /messages | — | Listar mensagens |
| GET | /linkedin-accounts | INTERNAL_API_SECRET | Listar contas LinkedIn |
| POST | /linkedin-accounts | INTERNAL_API_SECRET | Cadastrar/editar conta |
| POST | /unipile/sync | INTERNAL_API_SECRET | Forçar sync manual |
| POST | /response-sla/check | INTERNAL_API_SECRET | Forçar check SLA |
| GET | /stats | INTERNAL_API_SECRET | Stats gerais |
| GET | /stats/accounts | INTERNAL_API_SECRET | Stats por conta |
| GET | /stats/sdrs | INTERNAL_API_SECRET | Stats por SDR |
| GET | /stats/conversations | INTERNAL_API_SECRET | Conversas |
| GET | /dashboard | INTERNAL_API_SECRET | Dashboard HTML |

> Auth `INTERNAL_API_SECRET`: header `x-nextleads-secret: nextleads-secret-2026`

---

## 8. Análise IA — Schema real

**Input:** texto da mensagem + nome do lead

**Output (JSON Schema strict):**
```json
{
  "resumo": "string",
  "temperatura": "frio | morno | quente",
  "intencao": "duvida | interesse | preco | objecao | agendamento | rejeicao | outro",
  "prioridade": "baixa | media | alta",
  "proximo_passo": "string",
  "resposta_sugerida": "string"
}
```

---

## 9. Template do alerta WhatsApp

```
🚨 Nova mensagem no LinkedIn

🔗 Conta LinkedIn: {{linkedinAccountName}}
👤 Lead: {{leadName}}
💬 Mensagem:
"{{text}}"

📊 Análise IA:
• 🔥 Temperatura: {{temperatura}}
• 🎯 Intenção: {{intencao}}
• ⚡ Prioridade: {{prioridade}}

🧠 Resumo:
{{resumo}}

➡️ Próximo passo:
{{proximoPasso}}

💬 Sugestão de resposta:
"{{respostaSugerida}}"
```

---

## 10. Regras de negócio

| Regra | Comportamento |
|-------|--------------|
| Texto vazio | Ignora sem processar IA |
| Mensagem duplicada | Ignora por `unipileMessageId` |
| Conta sem SDR | Usa `DEFAULT_SDR_ID` |
| IA falhou | Mensagem salva, sem alerta |
| Z-API falhou | 3 retentativas, loga erro |
| Fora do horário | Loga `skipped_outside_business_hours` (seg–sex 08h–18h SP) |
| `IGNORE_BUSINESS_HOURS=true` | Envia 24h |
| SLA 30 min | Alerta ⚠️ se SDR não respondeu |
| SLA 60 min | Alerta 🚨 crítico |
| GLOBAL_ALERT_GROUP_ID | Envia cópia de todo alerta pro grupo |
