---
name: onboarding-cliente
description: >
  Entrevista um cliente novo pra entender o negócio dele e montar o briefing
  que vai virar a estratégia (tráfego, marketing, comercial). Gera o briefing.md
  na pasta do cliente. Use quando o usuário disser "onboarding", "cliente novo",
  "entrar um cliente", "fazer o briefing do cliente X" ou "preciso entender o negócio do cliente".
---

# /onboarding-cliente — Onboarding de Cliente Novo

## Dependências

- **Contexto do negócio (de quem presta o serviço):** `_contexto/empresa.md`
- **Template de cliente:** `clientes/_modelo-cliente/` (se existir)

---

## Workflow

### Passo 1 — Identificar o cliente

Perguntar: "Qual é o nome do cliente/empresa?"

Verificar se já existe `clientes/[nome-cliente]/`. Se não existir, criar a pasta (copiando a estrutura de `clientes/_modelo-cliente/` se houver, **incluindo o `CLAUDE.md`** — esse arquivo é obrigatório em toda pasta de cliente nova, porque ela às vezes é aberta separada como workspace próprio no Claude Code).

### Passo 2 — Entrevista de descoberta

Fazer as perguntas em conversa, uma por vez (não listar todas de uma vez):

1. "O que a empresa faz, e pra quem vende?"
2. "Qual é o principal objetivo agora — vender mais, gerar lead, reconhecimento de marca, outro?"
3. "Quem é o cliente ideal? (perfil, dor, onde ele tá)"
4. "Já faz tráfego pago ou marketing hoje? O que funcionou e o que não funcionou?"
5. "Qual é o ticket médio / faixa de investimento que pretende colocar?"
6. "Tem concorrentes de referência (bons ou ruins)?"
7. "Tem algum prazo ou meta específica pra essa fase?"
8. "Algo mais que eu deveria saber pra montar a estratégia certa?"

Se o cliente já mandou essas informações soltas (ex: copiou de um formulário ou WhatsApp), extrair o que der e só perguntar o que faltou.

### Passo 3 — Consolidar o briefing

Gerar `clientes/[nome-cliente]/briefing.md`:

```markdown
# Briefing — [Nome do Cliente]

## Negócio
[o que faz, pra quem vende]

## Objetivo principal
[objetivo declarado]

## Público / cliente ideal
[perfil, dor, onde tá]

## Histórico de tráfego/marketing
[o que já fez, o que funcionou/não funcionou]

## Investimento previsto
[ticket médio / faixa de budget]

## Concorrentes de referência
[lista, se houver]

## Prazo / meta
[se houver]

## Observações adicionais
[qualquer outra informação relevante]

---
*Base pra montar a estratégia. Atualizar conforme o cliente trouxer novas informações.*
```

### Passo 3.5 — Gerar o CLAUDE.md do cliente

Copiar `clientes/_modelo-cliente/CLAUDE.md` pra `clientes/[nome-cliente]/CLAUDE.md`, preenchendo os campos com o que foi coletado na entrevista (nome, segmento, serviços contratados — perguntar se ainda não estiver claro qual serviço foi contratado). Esse arquivo é **obrigatório** em toda pasta de cliente: se essa pasta for aberta separada como workspace, ele é o que garante que o contexto do negócio não se perca.

### Passo 4 — Próximo passo

Depois de salvar o briefing, perguntar: "Briefing salvo. Quer que eu já esboce uma estratégia inicial com base nisso, ou prefere revisar o briefing primeiro?"

---

## Regras

- Nunca inventar informação que o cliente não passou — deixar como `[a definir]` se faltar algo importante
- Uma pergunta por vez durante a entrevista
- Se o cliente for muito direto e já mandar tudo de uma vez, não repetir perguntas já respondidas
- Tom segue `_contexto/preferencias.md`
- Todo cliente novo precisa sair dessa skill com `briefing.md` E `CLAUDE.md` na pasta — nunca só o briefing
