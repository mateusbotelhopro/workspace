# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next Leads — NestJS 11 backend API that captures LinkedIn messages via Unipile, classifies them with OpenAI (gpt-4.1-mini), and routes alerts to SDRs via WhatsApp (Z-API).

**Production:** `root@72.60.243.27` · `https://api.nextleads.cloud`  
**Server layout:** docker-compose at `/root/docker-compose.yml`, app source at `/root/app/app/`

## Commands

All commands run from `app/` directory.

```bash
# Development
npm run start:dev       # watch mode
npm run start:debug     # debug + watch

# Production (inside container)
npm run build && npm run start:prod

# Prisma
npx prisma generate                  # regenerate client after schema changes
npx prisma migrate deploy            # apply migrations in production
npx prisma migrate dev --name <name> # create + apply a new migration locally
npx prisma studio                    # GUI on port 5555

# Tests
npm test                             # unit tests (*.spec.ts)
npm run test:e2e                     # e2e (test/app.e2e-spec.ts)
npm run test:cov                     # with coverage

# Lint / format
npm run lint
npm run format
```

## Deploy to production

```bash
# SSH into server
ssh root@72.60.243.27

# From /root — rebuild and restart only the API container
docker compose up -d --build api

# Run pending migrations inside the running container
docker exec nextleads_api npx prisma migrate deploy

# Tail logs
docker logs -f nextleads_api
```

## Architecture

### Message pipeline (happy path)

```
Unipile (LinkedIn)
  ├── Webhook → POST /webhooks/unipile/message
  └── Polling cron (every 30s) → UnipileService.syncMessages()
        ↓
  Bull queue "messages"  (Redis)
        ↓
  MessageProcessor.handle()
    1. normalizeUnipileMessage()          — tolerant multi-format normalizer
    2. Dedup check via unipileMessageId   — silently drops duplicates
    3. LeadsService.findOrCreateLead()    — upsert by unipileChatId
    4. MessagesService.create()           — persist message
    5. AiService.analyzeMessage()         — OpenAI strict JSON Schema → AiAnalysis
    6. isBusinessHours() gate             — skips WhatsApp if outside hours
    7. Bull queue "whatsapp"              — humanized delay (3-8s in WhatsappProcessor)
        ↓
  WhatsappProcessor → WhatsappService.sendText() → Z-API
    sends to: primary SDR + optional secondarySdrId + GLOBAL_ALERT_GROUP_ID
```

### Cron jobs

| Cron | Schedule | Purpose |
|------|----------|---------|
| `UnipileCron` | every 30s | Poll all active `linkedin_accounts` for new inbound messages |
| `ResponseSlaCron` | every 5min | Send SLA alerts at 30 min (`🟡`) and 60 min (`🔴`) if no outbound reply |
| `WeekendSummaryCron` | Mon 08:00 SP | Summarise Sat/Sun messages to the group |

### Module structure

```
src/
  infra/
    prisma/          — PrismaService (global singleton, injected everywhere)
    auth/            — InternalSecretGuard (header: x-nextleads-secret)
    date/            — isBusinessHours() (Mon–Fri 08–18 SP, bypassable via IGNORE_BUSINESS_HOURS=true)
  modules/
    queue/           — BullModule setup, MessageProcessor, WhatsappProcessor
    webhook/         — POST /webhooks/unipile/message → enqueues raw payload
    webhook/normalizers/ — normalizeUnipileMessage() handles every Unipile payload variant
    unipile/         — syncMessages(), getChatInfo(), extractLeadName()
    leads/           — findOrCreateLead() upserts by unipileChatId
    messages/        — create(), existsByUnipileMessageId()
    ai/              — analyzeMessage() → OpenAI responses.create() with strict json_schema
    whatsapp/        — formatAlert(), sendText() with 3 inline retries (3s delay)
    response-sla/    — checkPendingResponses(), WeekendSummaryService
    sdr/             — CRUD for SDR records
    linkedin-accounts/ — CRUD for LinkedinAccount records (guarded)
    stats/           — dashboard HTML + stats endpoints
    zapi-webhook/    — Z-API delivery status callbacks
```

### Data model (key relations)

```
LinkedinAccount (unipileAccountId) ──┐
                                     ├──> Lead (unipileChatId) ──> Message ──> AiAnalysis
Sdr ──────────────────────────────── ┘                                └──> WhatsappLog
```

`secondarySdrId` on `LinkedinAccount` allows routing alerts to a second SDR (not a FK relation — raw UUID, see `message.processor.ts`).

### Known quirks

- `MessageProcessor` accesses `messagesService['prisma']` directly (private property bypass) for Prisma calls that don't belong to MessagesService. Avoid spreading this pattern.
- `INTERNAL_SECRET` and `INTERNAL_API_SECRET` both exist in docker-compose for backwards compatibility; only `INTERNAL_API_SECRET` is read by `InternalSecretGuard`.
- AI uses `openai.responses.create()` (Responses API), not `chat.completions.create()`.
- `IGNORE_BUSINESS_HOURS=true` is set in production — `isBusinessHours()` always returns `true` there.

## Environment variables

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | Prisma |
| `REDIS_URL` | Bull (note: queue module hardcodes `host:redis port:6379` — `REDIS_URL` is informational) |
| `OPENAI_API_KEY` | AiService |
| `UNIPILE_API_KEY` / `UNIPILE_DSN` | UnipileService, MessageProcessor |
| `ZAPI_INSTANCE_ID` / `ZAPI_TOKEN` / `ZAPI_CLIENT_TOKEN` | WhatsappService |
| `DEFAULT_SDR_ID` | Fallback SDR when no LinkedinAccount match |
| `INTERNAL_API_SECRET` | InternalSecretGuard (header `x-nextleads-secret`) |
| `GLOBAL_ALERT_GROUP_ID` | WhatsApp group that receives every alert + SLA alerts |
| `IGNORE_BUSINESS_HOURS` | Set to `"true"` to bypass the Mon–Fri 08–18 gate |
