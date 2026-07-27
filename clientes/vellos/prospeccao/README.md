# Prospecção — Vellos

Fluxo padrão pra organizar listas de prospecção/leads do Vellos.

## Como funciona

1. **`a-processar/`** — jogar aqui a lista crua (CSV, XLSX, ou deixar o link do Google Sheets à mão) assim que ela chegar.
2. Pedir pra organizar (ex: "organiza essa lista", "limpa a lista X"). Isso roda a skill `limpar-listas`, que:
   - Remove linhas vazias/resumo, leads sem telefone válido e duplicados
   - Formata telefone pro padrão WhatsApp (`55DDDNUMERO`)
   - Gera `lista-limpa.csv` + `relatorio-prospeccao.html` (relatório com cards de estatística e link direto `wa.me/` pra cada lead)
3. Resultado vai pra **`processadas/[nome-da-lista]/`** — uma subpasta por lista processada, com os dois arquivos de saída.

## Comando usado por trás

```bash
python3 ~/.claude/skills/limpar-listas/scripts/limpar.py --input "<arquivo em a-processar/>" --output-dir "clientes/vellos/prospeccao/processadas/<nome-da-lista>" --title "<Nome da Lista>"
```

## Regra

Sempre que uma lista nova cair em `a-processar/`, o padrão é gerar CSV limpo + HTML pronto pra mandar mensagem no WhatsApp — não só a limpeza crua. Detalhes completos do que a skill remove/mantém estão em `~/.claude/skills/limpar-listas/SKILL.md`.
