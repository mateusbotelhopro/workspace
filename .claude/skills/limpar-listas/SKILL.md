---
name: limpar-listas
description: Abre listas de prospecção/leads/contratos (CSV, XLSX ou link do Google Sheets), limpa duplicatas, linhas vazias/resumo e telefones inválidos, formata telefones pro padrão WhatsApp, e exporta um CSV limpo + relatório HTML estilizado. Use quando o usuário mandar uma planilha de leads/prospecção pra organizar, pedir pra "limpar lista", "tirar duplicado", "formatar telefone pra whatsapp", "exportar lista em html", ou similar.
---

# Limpar Listas

Skill genérica para tratar listas de leads/prospecção/contratos vindas de qualquer cliente (Datameet, Vellos, João Ferret etc). Lê CSV, XLSX ou um link de Google Sheets, limpa e exporta.

## O que a skill remove

1. **Linhas vazias ou de resumo** — linhas sem nome, telefone nem e-mail, ou linhas cujo "nome" é claramente um resumo de planilha (`Total`, `Subtotal`, `Soma`, `Contabilidade`, `Resumo` etc).
2. **Leads sem telefone válido** — incluindo leads que só têm e-mail. Regra do negócio: lista final é pra prospecção via WhatsApp, então quem não tem telefone utilizável sai.
3. **Duplicados** — mesmo telefone normalizado aparecendo mais de uma vez (mantém a primeira ocorrência).

Telefones são normalizados pro formato `55DDDNUMERO` (prontos pra link `wa.me/`), aceitando entrada com ou sem `55`, com ou sem formatação (parênteses, espaços, hífen).

## Como usar

```bash
python3 ~/.claude/skills/limpar-listas/scripts/limpar.py --input "<caminho ou link>" [--output-dir "<pasta>"] [--title "Nome da Lista"]
```

- `--input`: caminho de um `.csv`/`.xlsx` local, OU um link do Google Sheets (a skill converte automaticamente pra export CSV — a planilha precisa estar com link de visualização público ou "qualquer pessoa com o link")
- `--output-dir`: opcional. Se não passar, salva na mesma pasta do arquivo de entrada
- `--title`: título que aparece no relatório HTML (ex: "Leads Datameet — Junho 2026")
- `--col-nome`, `--col-telefone`, `--col-email`: opcional, só usar se a skill não conseguir identificar as colunas automaticamente (ela reconhece variações comuns em português/inglês: nome/lead/empresa, telefone/whatsapp/celular, email/e-mail)

Gera dois arquivos na pasta de saída:
- `lista-limpa.csv` — colunas `nome`, `telefone_original`, `whatsapp` (formato `55DDDNUMERO`), `email`
- `relatorio-prospeccao.html` — página com cards de estatística (recebidos, removidos por motivo, total final) e tabela com link direto pro WhatsApp de cada lead

## Fluxo

1. Perguntar (se não estiver claro) onde está a lista: arquivo já na pasta do cliente, ou link do Google Sheets
2. Rodar o script apontando `--output-dir` pra pasta do cliente (ex: `clientes/vellos/prospeccao/processadas/`)
3. Reportar os números do print do script (quantos foram removidos e por quê)
4. Avisar se a coluna de telefone não foi encontrada automaticamente, pedindo o nome exato da coluna

## Regras

- Nunca inventar ou tentar adivinhar um telefone/e-mail que não esteja na planilha original
- Se uma lista tiver uma coluna que pareça ser de telefone mas o script não detectar automaticamente, usar `--col-telefone` em vez de editar a planilha manualmente
- Se o usuário quiser critérios diferentes (ex: manter leads só com e-mail, ou um formato de telefone de outro país), ajustar a chamada ou avisar que é preciso editar o script — não fazer limpeza manual linha a linha como substituto
