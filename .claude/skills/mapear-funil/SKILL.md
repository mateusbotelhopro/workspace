---
name: mapear-funil
description: >
  Mapeia o funil de marketing/vendas de um cliente — canais de aquisição, etapas de
  consciência, pontos de contato e conversões — e indica onde automações de WhatsApp
  se encaixam quando o cliente tiver esse serviço contratado. Gera um documento salvo
  na pasta do cliente. Use quando o usuário mencionar "mapear funil", "funil de vendas",
  "funil de marketing", "mapeia o funil do cliente X" ou "desenhar a jornada do cliente".
---

# /mapear-funil — Mapeamento de Funil

## Dependências

- **Briefing do cliente:** `clientes/[nome-cliente]/briefing.md`
- **Serviços contratados:** `clientes/[nome-cliente]/CLAUDE.md` (pra saber se tem tráfego pago, automação WhatsApp etc.)

---

## Workflow

### Passo 1 — Ler o contexto do cliente

Ler `briefing.md` (público, objetivo, histórico de tráfego/marketing) e `CLAUDE.md` (serviços contratados — isso define quais canais entram no mapeamento).

### Passo 2 — Mapear as etapas

Estrutura-base (ajustar à realidade do negócio):

1. **Topo (atração)** — canal de aquisição (tráfego pago, orgânico, indicação), conteúdo/oferta usada pra captar atenção
2. **Meio (consideração)** — como o lead é nutrido (conteúdo, remarketing, DM automática, email)
3. **Fundo (decisão)** — o que leva à conversão (proposta, oferta, prova social, urgência)
4. **Pós-venda/retenção** — o que mantém o cliente ativo ou gera indicação

Pra cada etapa, registrar: canal, ação esperada do lead, métrica de sucesso.

### Passo 3 — Encaixar automação de WhatsApp (se aplicável)

Se o CLAUDE.md do cliente marcar "Automação WhatsApp" como serviço ativo, indicar em qual etapa do funil ela entra (ex: comentário em post → DM automática → qualificação → follow-up via n8n) e qual ferramenta está em uso (ManyChat, n8n + WhatsApp Cloud API/Z-API/Revolution API — ver `templates/ferramentas/catalogo.md`).

### Passo 4 — Salvar

Salvar em `clientes/[nome-cliente]/funil.md`, em formato de tabela markdown (etapa | canal | ação esperada | métrica).

### Passo 5 — Confirmar

Avisar onde foi salvo. Se identificar gargalo óbvio (etapa sem canal definido, sem métrica), apontar.

---

## Regras

- Basear só no que o briefing e o CLAUDE.md do cliente trazem — marcar `[a definir]` pro que não tiver informação, nunca inventar
- Não confundir com `/estrutura-comercial` — funil é a jornada do lead/cliente pelos canais, estrutura comercial é o processo interno de vendas
- Tom direto
