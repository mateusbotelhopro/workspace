---
name: contrato-cliente
description: >
  Gera o contrato de prestação de serviço de um cliente a partir do briefing.md e dos
  serviços contratados no CLAUDE.md dele, e entrega em PDF salvo na pasta do cliente.
  Use quando o usuário mencionar "contrato", "enviar contrato", "fechar contrato",
  "contrato pro cliente X" ou "preciso mandar o contrato".
---

# /contrato-cliente — Geração de Contrato

## Dependências

- **Briefing do cliente:** `clientes/[Nome do Cliente]/briefing.md`
- **Serviços contratados:** `clientes/[Nome do Cliente]/CLAUDE.md`
- **Dados do prestador:** `_contexto/empresa.md`
- **Tom de voz:** `_contexto/preferencias.md`

---

## Workflow

### Passo 1 — Identificar o cliente e puxar contexto

Ler `clientes/[Nome do Cliente]/briefing.md` e `CLAUDE.md` pra saber serviços contratados, objetivo e qualquer dado já registrado.

Se faltar algo essencial pra fechar o contrato (valor, forma de pagamento, prazo/vigência, data de início), perguntar só o que estiver faltando — não travar o fluxo perguntando o que já está documentado.

### Passo 2 — Ler dados do prestador

Ler `_contexto/empresa.md` pra nome, serviços e contato de quem presta o serviço. Se faltar CNPJ/endereço, deixar placeholder `[preencher]` em vez de inventar.

### Passo 3 — Montar o contrato

Gerar um HTML com as cláusulas:

1. Partes (prestador e contratante, com placeholders pros dados que faltarem)
2. Objeto — o que está sendo contratado, em linguagem clara
3. Escopo dos serviços — lista do que está incluído (baseado nos serviços marcados no CLAUDE.md do cliente)
4. O que NÃO está incluído (quando relevante)
5. Prazo e vigência (ou renovação automática, se for recorrente)
6. Valor e forma de pagamento
7. Cancelamento/rescisão
8. Confidencialidade
9. Foro
10. Assinaturas (linha pra prestador e contratante, com data)

**Estilo visual:** mesmo padrão das propostas — aplicar `marca/design-guide.md` se preenchido, senão visual neutro (fundo branco, texto escuro, tipografia limpa, sem floreio).

Salvar o HTML em `clientes/[Nome do Cliente]/contrato.html`.

### Passo 4 — Converter pra PDF

**Nunca usar `npx playwright pdf` (CLI)** — ele não ativa `printBackground`, então qualquer fundo colorido (headers escuros, caixas de destaque) some no PDF e texto claro sobre fundo escuro fica invisível.

Usar o script `scripts/gerar-pdf.js` desta skill, que renderiza com `printBackground: true`:

```bash
node ".claude/skills/contrato-cliente/scripts/gerar-pdf.js" "caminho/absoluto/clientes/[Nome do Cliente]/contrato.html" "clientes/[Nome do Cliente]/contrato.pdf"
```

Se Playwright/Chromium não estiver instalado: `npx playwright install chromium`.

### Passo 5 — Confirmar

Avisar: "Contrato gerado em `clientes/[Nome do Cliente]/contrato.pdf`." Perguntar se quer que eu prepare um rascunho de email pra enviar junto (usando o MCP do Gmail, se estiver conectado).

---

## Regras

- Nunca inventar valor, prazo, cláusula legal ou dado cadastral — deixar `[preencher]` quando não tiver a informação
- Isso não é um documento validado juridicamente — é um rascunho. Avisar o usuário disso na primeira vez que gerar contrato pra um cliente novo
- Tom direto, sem juridiquês desnecessário além do que é padrão de contrato
- Se a pasta `clientes/[Nome do Cliente]/` não existir, avisar — provavelmente o cliente ainda não passou por `/onboarding-cliente`
