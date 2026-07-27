# Contexto — Next Leads

> Referência para desenvolvimento e manutenção. Atualizado em: 2026-05-18

---

## O que é o sistema

Radar comercial para LinkedIn. Cada cliente tem uma conta LinkedIn conectada via Unipile. Quando um lead responde, o sistema captura, classifica com IA e avisa o SDR responsável no WhatsApp. Se o SDR não responder, o sistema cobra em 30 e 60 minutos.

---

## Estrutura de SDRs e contas

Cada **SDR** é uma pessoa do time comercial que recebe alertas.
Cada **LinkedinAccount** é uma conta LinkedIn de um cliente, mapeada para um SDR.

Quando uma mensagem chega:
1. O `account_id` do payload identifica qual conta LinkedIn recebeu
2. O sistema busca a `LinkedinAccount` por `unipileAccountId`
3. Usa o `sdrId` da conta para rotear o alerta
4. Se conta sem `sdrId` → usa `DEFAULT_SDR_ID`

Para adicionar/editar mapeamento:
```bash
POST /linkedin-accounts
Header: x-nextleads-secret: nextleads-secret-2026
Body: { "unipileAccountId": "...", "accountName": "...", "clientName": "...", "sdrId": "..." }
```

---

## Como o sync funciona

O cron (`unipile.cron.ts`) roda a cada 30 segundos e chama `syncMessages()`.

**Antes (bug corrigido 2026-05-18):** Buscava mensagens de apenas UMA conta (`UNIPILE_ACCOUNT_ID`).

**Agora:** Itera todas as `linkedin_accounts` com `ativo=true` no banco e busca mensagens de cada uma via `GET /api/v1/messages?account_id={id}`.

Mensagens já salvas são ignoradas por `unipileMessageId`.

---

## Como o roteamento de SDR funciona

```typescript
// message.processor.ts
const linkedinAccount = await prisma.linkedinAccount.findUnique({
  where: { unipileAccountId: job.data.account_id }
});

const routedSdrId = linkedinAccount?.ativo && linkedinAccount?.sdrId
  ? linkedinAccount.sdrId
  : process.env.DEFAULT_SDR_ID;
```

---

## Como o SLA funciona

A cada 5 minutos, `ResponseSlaService.checkPendingResponses()`:
1. Busca mensagens inbound com mais de 30 minutos
2. Consulta Unipile: houve mensagem outbound depois da inbound?
3. Se não houve resposta E alerta ainda não foi enviado → envia alerta
4. Salva log com status `sla_30_sent` ou `sla_60_sent`

Para verificar manualmente:
```bash
curl -X POST https://api.nextleads.cloud/response-sla/check \
  -H "x-nextleads-secret: nextleads-secret-2026"
```

---

## Como o grupo geral funciona

Se `GLOBAL_ALERT_GROUP_ID` estiver configurado, toda mensagem que gera alerta para o SDR também envia uma cópia para o grupo.

Grupo atual: `120363402768321532-group` (SDRs Coord. Luiz e Tici)

O grupo recebe a mesma mensagem com prefixo `👥 ALERTA GERAL`.

---

## Horário comercial

Definido em `infra/date/business-hours.ts`.
- Dias: segunda a sexta
- Horas: 08h às 18h (America/Sao_Paulo)
- Fora desse horário: mensagem é salva e analisada, mas alerta WhatsApp não é enviado
- `IGNORE_BUSINESS_HOURS=true` desativa essa regra (produção atual)

---

## Como adicionar uma nova conta LinkedIn

1. Conectar a conta no painel da Unipile
2. Pegar o `unipileAccountId` gerado
3. Cadastrar via API:
```bash
curl -X POST https://api.nextleads.cloud/linkedin-accounts \
  -H "Content-Type: application/json" \
  -H "x-nextleads-secret: nextleads-secret-2026" \
  -d '{
    "unipileAccountId": "NOVO_ID",
    "accountName": "Nome da Conta",
    "clientName": "Nome do Cliente",
    "sdrId": "ID_DO_SDR"
  }'
```

---

## Como adicionar um novo SDR

```bash
curl -X POST https://api.nextleads.cloud/sdrs \
  -H "Content-Type: application/json" \
  -d '{ "nome": "Nome SDR", "whatsapp": "5511999999999" }'
```

Copiar o `id` retornado e associar às contas LinkedIn via `/linkedin-accounts`.

---

## Monitoramento rápido

```bash
# Status por SDR (últimas 24h, alertas, falhas)
docker exec nextleads_postgres psql -U postgres -d nextleads -c "
SELECT s.nome AS sdr,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(m.id) FILTER (WHERE m.\"receivedAt\" >= NOW() - INTERVAL '24 hours') AS ultimas_24h,
  COUNT(w.id) FILTER (WHERE w.status = 'sent') AS alertas,
  COUNT(w.id) FILTER (WHERE w.status = 'failed') AS falhas,
  COUNT(w.id) FILTER (WHERE w.status LIKE 'sla%') AS sla,
  MAX(m.\"receivedAt\") AS ultima_msg
FROM sdrs s
LEFT JOIN leads l ON l.\"sdrId\" = s.id
LEFT JOIN messages m ON m.\"leadId\" = l.id AND m.direction = 'inbound'
LEFT JOIN whatsapp_logs w ON w.\"sdrId\" = s.id
WHERE s.ativo = true
GROUP BY s.id, s.nome
ORDER BY ultimas_24h DESC;
"

# Logs em tempo real
docker logs nextleads_api --tail 50 | grep -E "routedSdrId|Alerta enviado|Erro|sync"
```

---

## Bugs conhecidos

| Bug | Impacto | Status |
|-----|---------|--------|
| `GET /` usa `INTERNAL_SECRET` mas docker-compose define `INTERNAL_API_SECRET` | Dashboard principal sempre retorna 401 | ✅ Resolvido — `app.controller.ts` atualizado para `INTERNAL_API_SECRET`, variável duplicada removida do docker-compose |

---

## Arquivos chave para manutenção

| Arquivo | Para que mexer |
|---------|---------------|
| `modules/unipile/unipile.service.ts` | Sync de mensagens, lógica de polling |
| `modules/queue/message.processor.ts` | Fluxo principal de processamento |
| `modules/response-sla/response-sla.service.ts` | Lógica de SLA 30/60min |
| `modules/ai/ai.service.ts` | Prompt e schema da IA |
| `modules/whatsapp/whatsapp.service.ts` | Template do alerta, envio Z-API |
| `prisma/schema.prisma` | Schema do banco |
| `docker-compose.yml` | Variáveis de ambiente e serviços |
