# Leady — CRM de Tráfego + WhatsApp

## O que é

**Leady** (leady.pro) é o produto SaaS próprio do Mateus Botelho: um CRM pra quem roda tráfego pago com conversão no WhatsApp. Junta o que o **Kommo** faz (inbox de WhatsApp, pipeline kanban, automações) com o que o **Tintim** faz (atribuição de qual anúncio gerou cada conversa e envio de eventos de conversão pro Meta via Conversions API), num produto só.

Primeiro usuário é a própria agência (dogfooding nos clientes de tráfego), depois vira produto vendável.

## Documentos do planejamento

1. `01-visao.md` — problema, solução, benchmark Kommo/Tintim, público, posicionamento
2. `02-escopo-funcional.md` — módulos e funcionalidades detalhadas
3. `03-arquitetura.md` — stack, integrações Meta, fluxos críticos, modelo de dados, riscos técnicos
4. `04-roadmap.md` — fases (0 a 3) com checklists e metas de fase

Ler nessa ordem pra pegar contexto. Ao evoluir o projeto, manter esses arquivos atualizados (marcar checkboxes do roadmap, registrar decisões tomadas).

## Decisões já tomadas

- Nome: **Leady**; domínio: **leady.pro** (app em app.leady.pro, links rastreáveis em leady.pro/r/:slug)
- MVP só com WhatsApp Cloud API (oficial); API não-oficial (Z-API/Evolution) fica pra Fase 3
- Stack: Next.js + TypeScript, Supabase (Postgres + Realtime), BullMQ/Redis com worker separado
- Multi-tenant por workspace (um workspace por cliente da agência)
- Sem broadcast/disparo em massa por enquanto

## Decisões em aberto

- Cliente piloto
- Onde hospedar o worker (Railway/Render)

## Código (`app/`)

Monorepo npm workspaces, typecheck e build passando:

- `app/apps/web` — Next.js 15 (App Router). Telas: inbox, pipeline, contatos, relatórios, configurações (placeholders estruturados). Backend real: webhook do WhatsApp (`/api/webhooks/whatsapp`, com validação de assinatura) e redirecionador de links rastreáveis (`/r/[slug]`, registra clique + injeta código na mensagem)
- `app/apps/worker` — Node + BullMQ (6 filas). Job de mensagem recebida já implementa o fluxo completo: canal → contato → conversa → mensagem → atribuição (CTWA referral > código de link > direto) → lead na etapa de entrada → enfileira evento CAPI. Job de CAPI monta payload com hash SHA-256
- `app/packages/shared` — tipos de domínio, contratos das filas, constantes, schemas zod
- `app/supabase/migrations` — schema completo (20+ tabelas, RLS por org)
- **Stubs de integração Meta** (última etapa): `app/apps/worker/src/integrations/meta/{whatsapp,capi,marketing}.ts` — assinaturas prontas, lançam erro até implementar

Detalhe importante: `ioredis` fixado em `5.10.1` (mesma versão que o bullmq usa internamente); versão divergente duplica o pacote e quebra o typecheck.

## Convenções

- Documentação de produto em português, código em inglês (UI em português)
- Rodar checagens: `npm run typecheck` e `npm run build` dentro de `app/`
