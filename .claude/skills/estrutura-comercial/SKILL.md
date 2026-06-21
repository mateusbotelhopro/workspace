---
name: estrutura-comercial
description: >
  Estrutura o processo comercial de um cliente (ou da operação interna): etapas do
  pipeline de vendas, critérios de qualificação de lead, cadência de follow-up e
  scripts de abordagem por etapa. Gera um documento salvo na pasta do cliente.
  Use quando o usuário mencionar "estruturar comercial", "estrutura comercial",
  "pipeline de vendas", "processo comercial" ou "monta o comercial do cliente X".
---

# /estrutura-comercial — Estrutura do Processo Comercial

## Dependências

- **Briefing do cliente:** `clientes/[nome-cliente]/briefing.md` (objetivo, público, ticket, histórico)
- **Tom de voz:** `_contexto/preferencias.md`

---

## Workflow

### Passo 1 — Definir o alvo

Perguntar (se não estiver claro) se é a estrutura comercial de um cliente específico ou da própria operação do Mateus.

- Cliente → ler `clientes/[nome-cliente]/briefing.md`
- Operação própria → não precisa de briefing externo, usar `_contexto/empresa.md`

### Passo 2 — Desenhar o pipeline

Definir as etapas do funil de vendas, adaptadas ao tipo de produto/serviço (ticket alto vs baixo, venda consultiva vs autoatendimento). Etapas-base, ajustar conforme o caso:

1. Lead (entrada)
2. Qualificação
3. Apresentação/proposta
4. Negociação
5. Fechamento
6. Pós-venda/onboarding

Pra cada etapa, documentar:
- Critério de entrada (o que faz o lead avançar pra essa etapa)
- Ação esperada (o que precisa ser feito)
- Prazo máximo antes de virar perda/follow-up
- Responsável (se é solo, marcar como tal)

### Passo 3 — Critérios de qualificação

Definir o que torna um lead "bom" pra esse negócio (orçamento, urgência, fit de público) com base no briefing.

### Passo 4 — Cadência de follow-up

Definir quantos contatos, em que intervalo, por qual canal (WhatsApp, email, ligação), até considerar o lead perdido.

### Passo 5 — Salvar

- Cliente → `clientes/[nome-cliente]/estrutura-comercial.md`
- Operação própria → `interno/comercial/estrutura.md`

Usar tabelas markdown pra deixar o pipeline visualmente claro.

### Passo 6 — Confirmar

Avisar onde foi salvo e perguntar se quer detalhar os scripts de abordagem de alguma etapa específica (não escrever scripts completos por padrão, só quando pedido).

---

## Regras

- Não inventar metas, números de conversão ou ticket — se não tiver no briefing, perguntar ou marcar `[a definir]`
- Adaptar o número de etapas à realidade do negócio (venda simples não precisa de 6 etapas)
- Tom direto, sem jargão de gestão genérico
