# Roadmap

Critério geral: cada fase termina com algo usável em cliente real da agência. Nada de fase que só "prepara" a próxima.

## Fase 0 — Fundação (1 a 2 semanas de trabalho efetivo)

Objetivo: decisões tomadas e ambiente pronto.

- [ ] Criar app na Meta (WhatsApp + Webhooks + Marketing API) e iniciar processo de advanced access
- [ ] Definir nome do produto e domínio (inclui subdomínio do redirecionador de links)
- [x] Setup do repositório: Next.js + TS, Supabase, Redis, worker (monorepo em `app/`)
- [x] Modelo de dados inicial (migration completa em `app/supabase/migrations/0001_schema_inicial.sql`)
- [ ] Escolher cliente piloto da agência (idealmente um que roda CTWA hoje)

## Fase 1 — MVP: rastrear, atender, devolver evento (4 a 8 semanas)

Objetivo: substituir Tintim + planilha/CRM improvisado num cliente piloto.

**Canal e inbox**
- [ ] Conexão Cloud API (cadastro manual de token no início, embedded signup depois)
- [ ] Webhook de mensagens + envio de texto e mídia
- [ ] Inbox realtime com atribuição manual de atendente e notas internas

**Atribuição**
- [ ] Captura do `referral` CTWA (ctwa_clid + ad_id)
- [ ] Redirecionador de links rastreáveis com código na mensagem
- [ ] Resolução de nomes de campanha via Marketing API
- [ ] Origem visível na conversa e no card

**Pipeline**
- [ ] Um funil por workspace, etapas configuráveis, kanban drag-and-drop
- [ ] Card com valor, responsável e motivo de perda
- [ ] Lead criado automaticamente na primeira mensagem

**CAPI**
- [ ] Config de pixel/token por workspace
- [ ] Mapeamento etapa → evento (Lead, QualifiedLead, Purchase com valor)
- [ ] Fila de envio com retry + log visível

**Relatório**
- [ ] Tabela por campanha/conjunto/anúncio: conversas, leads, vendas, receita
- [ ] Multi-tenant básico (workspaces isolados, papéis admin/atendente)

**Meta da fase:** cliente piloto operando 100% dentro da ferramenta, eventos aparecendo no Gerenciador de Eventos do Meta com match quality aceitável.

## Fase 2 — Operação de verdade (após validação do MVP)

Objetivo: a ferramenta segura a rotina de atendimento sem gambiarras.

- [ ] Mensagens rápidas e templates HSM (com estado de janela de 24h no inbox)
- [ ] Automações por etapa (mensagem, tag, tarefa, webhook)
- [ ] Follow-up por inatividade
- [ ] Tarefas com visão do dia
- [ ] Investimento via insights (CPL, custo por venda, ROAS no dashboard)
- [ ] Distribuição automática de conversas (round-robin)
- [ ] Notificação de venda pro gestor
- [ ] Múltiplos funis por workspace
- [ ] Relatório de atendimento (tempo de resposta, vendas por atendente)

**Meta da fase:** rodar em 3+ clientes da agência sem suporte manual diário.

## Fase 3 — Produto vendável (SaaS)

Objetivo: alguém de fora da agência consegue assinar e usar sozinho.

- [ ] Onboarding self-service (embedded signup do WhatsApp, wizard de pixel e funil)
- [ ] Billing (Stripe ou Asaas) e planos
- [ ] Painel agência (multi-workspace consolidado)
- [ ] Canal não-oficial (Z-API/Evolution) como opção
- [ ] Chatbot de triagem (menu, coleta de dados, direcionamento)
- [ ] Google Ads: offline conversions via gclid
- [ ] API pública + integração n8n documentada
- [ ] Site do produto + material de venda

## Backlog (sem fase)

- Instagram DM e outros canais
- Broadcast com templates aprovados
- App mobile
- Lead scoring automático
- IA no atendimento (resumo de conversa, sugestão de resposta, qualificação automática)

## Riscos de execução

1. **Escopo demais no MVP.** Regra: se o cliente piloto consegue operar sem a feature, ela vai pra Fase 2.
2. **Review do app Meta atrasar.** Começar o processo na Fase 0, não quando o código estiver pronto.
3. **Concorrer com a rotina da agência.** Reservar blocos fixos de trabalho no produto; o dogfooding ajuda porque o produto vira ferramenta de entrega dos próprios clientes.
