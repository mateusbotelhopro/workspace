# CRM — Tráfego + WhatsApp

Monorepo do produto. Planejamento completo em `../01-visao.md` a `../04-roadmap.md`.

## Estrutura

```
apps/
  web/      Next.js — telas (inbox, pipeline, relatórios, configurações),
            webhook do WhatsApp e redirecionador de links rastreáveis
  worker/   Node + BullMQ — processamento de mensagens, envio CAPI,
            resolução de nomes de anúncio, insights, follow-ups
packages/
  shared/   Tipos de domínio, contratos das filas, constantes, schemas zod
supabase/
  migrations/  Schema do banco (Postgres + RLS)
```

## Rodar local

```bash
npm install
cp .env.example .env   # preencher Supabase e Redis
npm run dev            # web em http://localhost:3000
npm run dev:worker     # worker das filas (precisa de Redis rodando)
```

## Comandos

- `npm run typecheck` — typecheck de todos os workspaces
- `npm run build` — build de todos os workspaces

## Estado atual

Estrutura bruta: telas com placeholder, filas definidas, schema do banco pronto.
As chamadas reais às APIs da Meta (WhatsApp Cloud API, Conversions API, Marketing API)
estão em `apps/worker/src/integrations/meta/` como stubs — são a última etapa.
