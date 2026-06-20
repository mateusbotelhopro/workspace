---
name: apresentacao-institucional
description: >
  Gera a apresentação institucional (pitch de vendas) em PowerPoint, com conteúdo fixo
  sobre a empresa, serviços e diferenciais, aplicando a identidade visual da marca.
  Use quando o usuário pedir "apresentação institucional", "pitch de vendas",
  "mandar apresentação pro cliente" ou "apresentação da empresa".
---

# /apresentacao-institucional — Apresentação Institucional (Pitch de Vendas)

## Dependências

- **Conteúdo institucional:** `marca/apresentacao-institucional.md` (fonte de verdade do conteúdo fixo)
- **Identidade visual:** `marca/design-guide.md`
- **Contexto do negócio:** `_contexto/empresa.md`

---

## Workflow

### Passo 1 — Verificar se o conteúdo institucional já existe

Ler `marca/apresentacao-institucional.md`.

- **Se o arquivo não existir ou estiver vazio:** entrevistar o usuário pra montar o conteúdo (ver Passo 2) e salvar o resultado nesse arquivo antes de gerar a apresentação.
- **Se já existir:** usar o conteúdo salvo direto, sem perguntar de novo. Só perguntar de novo se o usuário disser que quer atualizar algo.

### Passo 2 — Entrevista (só na primeira vez ou quando o conteúdo estiver vazio)

Perguntar, uma por vez:
1. "Como você resumiria o que a empresa faz, em 2-3 frases?"
2. "Quais são os principais serviços? (lista)"
3. "Qual é o seu diferencial em relação à concorrência?"
4. "Tem algum resultado, número ou case que vale destacar?"
5. "Como você quer encerrar — qual é a chamada pra ação?"

Salvar as respostas em `marca/apresentacao-institucional.md` com essa estrutura:

```markdown
# Apresentação Institucional — Conteúdo Fixo

## Sobre a empresa
[resumo]

## Serviços
- [serviço 1]
- [serviço 2]

## Diferenciais
[texto]

## Resultados / cases
[texto]

## Chamada pra ação (slide final)
[texto]
```

### Passo 3 — Gerar a apresentação

Usar a skill nativa `/pptx` pra montar o deck com base no conteúdo de `marca/apresentacao-institucional.md`, seguindo essa estrutura de slides:

1. Capa — nome + logo (se tiver em `marca/design-guide.md`)
2. Sobre a empresa
3. Serviços (um slide ou um por item, dependendo da quantidade)
4. Diferenciais
5. Resultados / cases (se houver)
6. Próximos passos / chamada pra ação

Aplicar cores e fontes de `marca/design-guide.md`. Se estiver em branco, usar visual neutro (fundo branco, texto escuro, um acento de cor).

### Passo 4 — Salvar

Salvar em `marca/apresentacao-institucional.pptx` (versão master, reutilizável).

Perguntar: "Quer que eu gere uma cópia específica pra algum cliente, ou essa versão master já serve pra enviar?"

Se for pra um cliente específico, copiar pra `clientes/[nome-cliente]/apresentacao.pptx` antes de qualquer ajuste pontual.

---

## Regras

- O conteúdo institucional é fixo — não inventar serviços, diferenciais ou números que não estão em `marca/apresentacao-institucional.md`
- Tom segue `_contexto/preferencias.md`
- Atualizações de conteúdo só acontecem quando o usuário pedir explicitamente pra mudar algo
