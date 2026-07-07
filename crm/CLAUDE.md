# Projeto CRM — Tráfego + WhatsApp

## O que é

Produto SaaS próprio do Mateus Botelho: um CRM pra quem roda tráfego pago com conversão no WhatsApp. Junta o que o **Kommo** faz (inbox de WhatsApp, pipeline kanban, automações) com o que o **Tintim** faz (atribuição de qual anúncio gerou cada conversa e envio de eventos de conversão pro Meta via Conversions API), num produto só.

Primeiro usuário é a própria agência (dogfooding nos clientes de tráfego), depois vira produto vendável.

## Documentos do planejamento

1. `01-visao.md` — problema, solução, benchmark Kommo/Tintim, público, posicionamento
2. `02-escopo-funcional.md` — módulos e funcionalidades detalhadas
3. `03-arquitetura.md` — stack, integrações Meta, fluxos críticos, modelo de dados, riscos técnicos
4. `04-roadmap.md` — fases (0 a 3) com checklists e metas de fase

Ler nessa ordem pra pegar contexto. Ao evoluir o projeto, manter esses arquivos atualizados (marcar checkboxes do roadmap, registrar decisões tomadas).

## Decisões já tomadas

- MVP só com WhatsApp Cloud API (oficial); API não-oficial (Z-API/Evolution) fica pra Fase 3
- Stack: Next.js + TypeScript, Supabase (Postgres + Realtime), BullMQ/Redis com worker separado
- Multi-tenant por workspace (um workspace por cliente da agência)
- Sem broadcast/disparo em massa por enquanto

## Decisões em aberto

- Nome do produto e domínio
- Cliente piloto
- Onde hospedar o worker (Railway/Render)

## Convenções

- Documentação de produto em português, código em inglês
- Quando o desenvolvimento começar, o código vive em subpasta `app/` aqui dentro (ou repositório próprio, decidir na Fase 0)
