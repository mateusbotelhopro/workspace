---
name: proposta-comercial
description: >
  Gera uma proposta comercial profissional a partir de um briefing em texto livre,
  aplica a identidade visual de marca/design-guide.md, e entrega em PDF salvo na pasta
  do cliente. Use quando o usuário mencionar "proposta", "proposta comercial", "orçamento",
  "mandar proposta pro cliente X" ou pedir um documento de venda para um cliente.
---

# /proposta-comercial — Geração de Proposta

## Dependências

- **Identidade visual:** `marca/design-guide.md`
- **Contexto do negócio:** `_contexto/empresa.md`
- **Tom de voz:** `_contexto/preferencias.md`

---

## Workflow

### Passo 1 — Coletar o briefing

Se o usuário ainda não forneceu um briefing completo, perguntar:

1. "Nome do cliente e empresa?"
2. "Qual é o problema ou necessidade do cliente?"
3. "O que você propõe fazer? (serviço ou produto)"
4. "Qual é o valor? (pode ser range ou 'a definir')"
5. "Tem prazo ou entregável específico?"

Se o usuário já forneceu as informações de forma livre, extrai o que der e prossegue sem fazer todas as perguntas.

### Passo 2 — Ler os arquivos de contexto

- Ler `marca/design-guide.md` pra aplicar cores e fontes (se ainda estiver em branco, usar visual neutro: fundo branco, texto escuro, acento azul escuro #1E3A5F, tipografia limpa)
- Ler `_contexto/empresa.md` pra dados do prestador (nome, serviços, contato)
- Ler `_contexto/preferencias.md` pra tom da proposta

### Passo 3 — Gerar o HTML

Criar um arquivo HTML completo com as seguintes seções:

**Estrutura da proposta:**
1. Header — logo/nome da empresa prestadora + data. Se o design guide tiver logo definido, usar a imagem (largura 140-180px), escolhendo a versão certa pro fundo. Se não tiver logo, usar o nome em texto
2. Destinatário — "Proposta para [Cliente]"
3. O problema — o desafio que o cliente enfrenta (2-3 parágrafos, na perspectiva do cliente)
4. A solução — o que você propõe e por que resolve
5. Escopo — o que está incluído (lista clara)
6. O que NÃO está incluído (quando relevante)
7. Prazo e entregáveis
8. Investimento — valor com contexto de ROI quando possível
9. Próximos passos — call to action claro
10. Sobre a empresa — 3-4 linhas sobre quem entrega

**Estilo visual:**
- Aplicar cores e fontes do `marca/design-guide.md`
- Layout de uma coluna, responsivo, leve
- Seções com espaçamento generoso
- Valor em destaque visual

Salvar o HTML temporariamente em `clientes/[nome-cliente]/proposta.html`.

### Passo 4 — Converter pra PDF

**Nunca usar `npx playwright pdf` (CLI)** — ele não ativa `printBackground`, então qualquer fundo colorido (headers escuros, caixas de destaque, seções com fundo de cor) some no PDF e texto claro sobre fundo escuro fica invisível, deixando a página com cara de "em branco".

Usar o script `scripts/gerar-pdf.js` desta skill, que renderiza com `printBackground: true`:

```bash
node ".claude/skills/proposta-comercial/scripts/gerar-pdf.js" "caminho/absoluto/clientes/[nome-cliente]/proposta.html" "clientes/[nome-cliente]/proposta.pdf"
```

Se o Playwright/Chromium ainda não estiver instalado, instalar antes: `npx playwright install chromium`.

Depois de gerar, se a proposta usar fundo escuro ou colorido em alguma seção, tirar um screenshot do HTML (via Playwright, `page.screenshot()`) e conferir visualmente antes de avisar o usuário que terminou — o Read tool consegue exibir o PNG direto.

O PDF final fica em `clientes/[nome-cliente]/proposta.pdf` — esse é o entregável pro cliente. O HTML fica salvo na mesma pasta como fonte editável pra próxima vez.

### Passo 5 — Confirmar

Avisar onde o PDF foi salvo: "Proposta gerada em `clientes/[nome-cliente]/proposta.pdf`."

---

## Regras

- Tom da proposta segue `_contexto/preferencias.md` (sem travessão, sem termos de IA genéricos)
- Nunca inventar valor, prazo ou escopo — se não foi fornecido, deixar placeholder claro pra preencher
- A proposta deve soar como veio de uma pessoa, não de um template corporativo
- Sem jargão desnecessário ("soluções inovadoras", "entregamos valor", etc)
- Se a pasta `clientes/[nome-cliente]/` não existir ainda, criar antes de salvar
