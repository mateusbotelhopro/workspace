# Prospecção — Vellos

Fluxo padrão pra organizar listas de prospecção/leads do Vellos.

## Como funciona

1. **`a-processar/`** — jogar aqui a lista crua (CSV, XLSX, ou deixar o link do Google Sheets à mão) assim que ela chegar.
2. Pedir pra organizar (ex: "organiza essa lista", "divide em N partes"). Isso roda `scripts/processar_cnpj.py` (formato CNPJ do Vellos: `razaoSocial`, `telefone_1`/`telefone_2`, `socios`, `cnaePrincipal`, etc.), que:
   - Remove leads sem telefone válido, fixos (só aceita celular — DDD + 9 dígitos com "9" logo depois) e duplicados
   - Formata telefone pro padrão WhatsApp (`55DDDNUMERO`)
   - Gera só HTML (sem CSV), um arquivo flat por parte — sem subpasta
3. Resultado vai pra **`processadas/[nome-da-lista]/`** — arquivos `lista-1.html`, `lista-2.html`, etc. direto na pasta, sem subpasta por parte.

## Comando usado por trás

```bash
python3 clientes/vellos/prospeccao/scripts/processar_cnpj.py --input "<arquivo(s) .xlsx em a-processar/>" --output-dir "clientes/vellos/prospeccao/processadas/<nome-da-lista>" --partes <N> --title "<Nome da Lista>"
```

## Regra

Sempre que uma lista nova cair em `a-processar/`, o padrão é gerar só HTML pronto pra mandar mensagem no WhatsApp (sem CSV, sem pasta por parte) — decisão fixada em 2026-07-29. Se a lista vier num formato genérico (não-CNPJ, sem essas colunas), aí sim usar a skill `limpar-listas` (`~/.claude/skills/limpar-listas/SKILL.md`), que ainda gera CSV + relatório.
