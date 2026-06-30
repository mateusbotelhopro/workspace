# Next Leads

---

## Quem é esse cliente

- **Nome:** Next Leads
- **Segmento:** SaaS — Radar comercial para LinkedIn (automação de prospecção B2B)
- **Contato principal:** José Luiz (joseluiz@nextleads.com.br)
- **Início do trabalho:** maio/2026

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [x] Site / blog / SaaS / aplicativo
- [x] Automação WhatsApp (ManyChat/n8n)
- [x] Copywriting
- [x] Conteúdo / redes sociais

## O que foi entregue

- **API (api.nextleads.cloud):** MVP em produção desde maio/2026. NestJS 11, PostgreSQL, Redis, Bull, OpenAI, Z-API. Documentação técnica completa em `api.nextleads.cloud/docs/` e `api.nextleads.cloud/CLAUDE.md`.
- **Site (nextleads.com.br):** ~90 páginas HTML estáticas — home, serviços, blog (40+ artigos SEO), glossário de vendas, landing pages comparativas, ferramentas interativas (calculadora ROI, quiz maturidade), cases, contato.

## Acessos e contas conectadas

- **VPS:** `root@72.60.243.27` (Docker Compose)
- **API:** <https://api.nextleads.cloud> (header `x-nextleads-secret`)
- **Unipile:** `joseluiz@nextleads.com.br` (integração LinkedIn)
- **Planilha SDR/LinkedIn:** [Google Sheets](https://docs.google.com/spreadsheets/d/1SbFYLfsdWCdGKLWbm9-TLm7kQ-X94rgZnkoZYorUXFs/)
- **Detalhes completos:** `api.nextleads.cloud/docs/ACESSOS.md` e `api.nextleads.cloud/docs/DADOS-PRODUCAO.md`

## Tom de voz deste cliente

Segue o padrão do sistema.

## Identidade visual

[a definir]

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](tarefas.md).

## Estratégia e histórico

- **MVP entregue:** maio/2026 — sistema capturando, classificando e alertando em produção (11.000+ jobs, 31 contas, 6 SDRs, 12+ clientes)
- **Correções pós-MVP (2026-05-18/21):** roteamento multi-conta, SLA individual por SDR, sync iterando todas as contas, deploy script, dashboard
- **Roadmap:** v1.1 (filtros, retry, painel contas) → v1.2 (dashboard visual, métricas) → v2.0 (multi-empresa, login, CRM, cobrança SaaS)
- **SEO:** site com conteúdo agressivo de blog/glossário/landing pages comparativas para captura orgânica B2B

---

## Contexto do sistema principal

Essa pasta vive dentro do Kortex OS (`c:\Users\mateu\Desktop\Kortex OS`). Se for aberta como workspace separado, esses arquivos do sistema principal continuam valendo e devem ser lidos quando relevante:

- `../../_contexto/empresa.md` — quem presta o serviço, como o negócio funciona
- `../../_contexto/preferencias.md` — tom de voz e estilo padrão (a menos que sobrescrito acima)
- `../../_contexto/estrategia.md` — foco atual e prioridades do negócio como um todo
- `../../marca/design-guide.md` — identidade visual padrão pra tarefas visuais
- `../../templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis

## Regras

- Skills disponíveis em `.claude/skills/` ou `.claude/commands/` do sistema principal continuam valendo mesmo abrindo essa pasta separada.
- Não inventar dados de conta, métrica ou histórico — perguntar ou deixar `[a definir]`.
- Atualizar este arquivo quando houver mudança de serviço contratado, conta conectada ou direção estratégica relevante.
