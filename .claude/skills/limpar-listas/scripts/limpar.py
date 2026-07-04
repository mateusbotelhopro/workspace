#!/usr/bin/env python3
"""Limpa e exporta listas de prospeccao/leads (CSV, XLSX ou link do Google Sheets)."""

import argparse
import csv
import html
import re
import sys
import unicodedata

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from urllib.request import urlretrieve

import pandas as pd

JUNK_NAME_PATTERNS = [
    r"^total\b", r"^subtotal\b", r"^soma\b", r"^somat[oó]rio\b",
    r"^contabil", r"^m[eé]dia\b", r"^resumo\b", r"^observa[cç][aã]o",
]

HEADER_ALIASES = {
    "nome": ["nome", "name", "lead", "contato", "cliente", "razao social", "razão social", "empresa"],
    "telefone": ["telefone", "whatsapp", "celular", "fone", "phone", "tel", "numero", "número"],
    "email": ["email", "e-mail", "mail"],
}


def normalize_header(h: str) -> str:
    h = str(h).strip().lower()
    h = "".join(c for c in unicodedata.normalize("NFKD", h) if not unicodedata.combining(c))
    return h


def find_column(columns, target):
    norm_cols = {normalize_header(c): c for c in columns}
    aliases = HEADER_ALIASES[target]
    for alias in aliases:
        alias_norm = normalize_header(alias)
        for norm, original in norm_cols.items():
            if alias_norm == norm or alias_norm in norm:
                return original
    return None


def gsheet_to_csv_url(url: str) -> str:
    """Converte um link normal do Google Sheets pra link de export CSV."""
    if "docs.google.com/spreadsheets" not in url:
        return url
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if not match:
        raise ValueError("Não consegui extrair o ID da planilha do link do Google Sheets.")
    sheet_id = match.group(1)
    gid_match = re.search(r"[#&]gid=(\d+)", url)
    gid = gid_match.group(1) if gid_match else "0"
    return f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"


def load_table(source: str) -> pd.DataFrame:
    parsed = urlparse(source)
    if parsed.scheme in ("http", "https"):
        csv_url = gsheet_to_csv_url(source)
        tmp_path, _ = urlretrieve(csv_url)
        return pd.read_csv(tmp_path, dtype=str, keep_default_na=False)

    path = Path(source)
    if path.suffix.lower() in (".xlsx", ".xls"):
        return pd.read_excel(path, dtype=str)
    return pd.read_csv(path, dtype=str, keep_default_na=False)


def normalize_phone(raw: str):
    """Retorna (digits_com_55, valido). digits_com_55 e None se invalido."""
    if not raw:
        return None, False
    digits = re.sub(r"\D", "", str(raw))
    if not digits:
        return None, False

    # remove zero de discagem internacional/tronco se sobrar prefixo 0
    if digits.startswith("0") and len(digits) > 11:
        digits = digits.lstrip("0")

    if digits.startswith("55") and len(digits) in (12, 13):
        national = digits[2:]
    elif len(digits) in (10, 11):
        national = digits
    else:
        return None, False

    ddd = national[:2]
    if not ddd.isdigit() or int(ddd) < 11 or int(ddd) > 99:
        return None, False

    return "55" + national, True


def is_junk_name(name: str) -> bool:
    name_norm = normalize_header(name)
    if not name_norm:
        return True
    return any(re.match(pat, name_norm) for pat in JUNK_NAME_PATTERNS)


def clean(df: pd.DataFrame, col_nome=None, col_telefone=None, col_email=None):
    columns = list(df.columns)
    col_nome = col_nome or find_column(columns, "nome")
    col_telefone = col_telefone or find_column(columns, "telefone")
    col_email = col_email or find_column(columns, "email")

    if not col_telefone:
        raise ValueError(
            "Não encontrei uma coluna de telefone/WhatsApp na lista. "
            "Use --col-telefone pra indicar o nome exato da coluna."
        )

    stats = {
        "total_recebido": len(df),
        "removidos_linha_vazia_ou_resumo": 0,
        "removidos_sem_telefone_valido": 0,
        "removidos_duplicado": 0,
        "total_final": 0,
    }

    rows = []
    seen_phones = set()

    for _, row in df.iterrows():
        nome = str(row.get(col_nome, "")).strip() if col_nome else ""
        email = str(row.get(col_email, "")).strip() if col_email else ""
        telefone_raw = str(row.get(col_telefone, "")).strip()

        if is_junk_name(nome) and not telefone_raw and not email:
            stats["removidos_linha_vazia_ou_resumo"] += 1
            continue

        phone_digits, valid = normalize_phone(telefone_raw)
        if not valid:
            stats["removidos_sem_telefone_valido"] += 1
            continue

        if phone_digits in seen_phones:
            stats["removidos_duplicado"] += 1
            continue
        seen_phones.add(phone_digits)

        rows.append({
            "nome": nome,
            "telefone_original": telefone_raw,
            "whatsapp": phone_digits,
            "email": email,
        })

    stats["total_final"] = len(rows)
    return rows, stats


def write_csv(rows, output_path: Path):
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["nome", "telefone_original", "whatsapp", "email"])
        writer.writeheader()
        writer.writerows(rows)


def write_html(rows, stats, output_path: Path, title: str):
    def esc(s):
        return html.escape(str(s)) if s else ""

    table_rows = "\n".join(
        f"""<tr>
          <td>{esc(r['nome']) or '—'}</td>
          <td><a href="https://wa.me/{r['whatsapp']}" target="_blank" rel="noopener">{esc(r['telefone_original'])}</a></td>
          <td>{esc(r['email']) or '—'}</td>
        </tr>"""
        for r in rows
    )

    doc = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>{esc(title)}</title>
<style>
  :root {{ --dark:#0d1f1c; --accent:#00c9a7; --light:#f5faf9; }}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family:'Segoe UI',Arial,sans-serif; background:var(--light); color:var(--dark); padding:40px; }}
  h1 {{ font-size:24px; margin-bottom:6px; }}
  .meta {{ color:#56685f; margin-bottom:28px; font-size:13px; }}
  .stats {{ display:flex; gap:14px; margin-bottom:32px; flex-wrap:wrap; }}
  .stat {{ background:#fff; border:1px solid #dce8e3; border-radius:10px; padding:14px 18px; min-width:150px; }}
  .stat .v {{ font-size:22px; font-weight:700; color:var(--dark); }}
  .stat .l {{ font-size:11.5px; color:#5d7269; text-transform:uppercase; letter-spacing:.04em; margin-top:2px; }}
  .stat.final {{ border-color:var(--accent); background:rgba(0,201,167,.08); }}
  table {{ width:100%; border-collapse:collapse; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(13,31,28,.06); }}
  th, td {{ text-align:left; padding:10px 14px; border-bottom:1px solid #eef3f1; font-size:13.5px; }}
  th {{ background:var(--dark); color:var(--light); font-size:12px; text-transform:uppercase; letter-spacing:.05em; }}
  tr:last-child td {{ border-bottom:none; }}
  a {{ color:var(--accent); text-decoration:none; font-weight:600; }}
</style>
</head>
<body>
  <h1>{esc(title)}</h1>
  <p class="meta">Lista limpa para prospecção — telefones formatados para WhatsApp, duplicatas e linhas inválidas removidas.</p>
  <div class="stats">
    <div class="stat"><div class="v">{stats['total_recebido']}</div><div class="l">Recebidos</div></div>
    <div class="stat"><div class="v">{stats['removidos_sem_telefone_valido']}</div><div class="l">Sem telefone válido</div></div>
    <div class="stat"><div class="v">{stats['removidos_duplicado']}</div><div class="l">Duplicados</div></div>
    <div class="stat"><div class="v">{stats['removidos_linha_vazia_ou_resumo']}</div><div class="l">Linhas vazias/resumo</div></div>
    <div class="stat final"><div class="v">{stats['total_final']}</div><div class="l">Prontos para abordagem</div></div>
  </div>
  <table>
    <thead><tr><th>Nome</th><th>WhatsApp</th><th>E-mail</th></tr></thead>
    <tbody>
      {table_rows}
    </tbody>
  </table>
</body>
</html>
"""
    output_path.write_text(doc, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Limpa e exporta listas de prospecção/leads.")
    parser.add_argument("--input", required=True, help="Caminho do CSV/XLSX ou link do Google Sheets")
    parser.add_argument("--output-dir", default=None, help="Pasta de saída (default: mesma pasta do input)")
    parser.add_argument("--title", default="Lista de Prospecção", help="Título do relatório HTML")
    parser.add_argument("--col-nome", default=None)
    parser.add_argument("--col-telefone", default=None)
    parser.add_argument("--col-email", default=None)
    args = parser.parse_args()

    df = load_table(args.input)
    rows, stats = clean(df, args.col_nome, args.col_telefone, args.col_email)

    if args.output_dir:
        out_dir = Path(args.output_dir)
    else:
        parsed = urlparse(args.input)
        out_dir = Path(args.input).parent if parsed.scheme not in ("http", "https") else Path(".")
    out_dir.mkdir(parents=True, exist_ok=True)

    csv_path = out_dir / "lista-limpa.csv"
    html_path = out_dir / "relatorio-prospeccao.html"
    write_csv(rows, csv_path)
    write_html(rows, stats, html_path, args.title)

    print(f"Recebidos: {stats['total_recebido']}")
    print(f"Removidos (sem telefone válido): {stats['removidos_sem_telefone_valido']}")
    print(f"Removidos (duplicados): {stats['removidos_duplicado']}")
    print(f"Removidos (linha vazia/resumo): {stats['removidos_linha_vazia_ou_resumo']}")
    print(f"Total final: {stats['total_final']}")
    print(f"CSV: {csv_path}")
    print(f"HTML: {html_path}")


if __name__ == "__main__":
    main()
