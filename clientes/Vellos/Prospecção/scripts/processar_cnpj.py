#!/usr/bin/env python3
"""Combina, limpa e divide listas de prospecção CNPJ (formato Vellos) em N partes,
gerando um relatorio HTML por parte com link direto pro WhatsApp de cada lead.

Campos de saida: nome do socio, telefone (whatsapp), endereco, atuacao (CNAE principal), email.
"""

import argparse
import csv
import html
import math
import re
import sys
import unicodedata
from pathlib import Path

import pandas as pd

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")


def normalize_header(h: str) -> str:
    h = str(h).strip().lower()
    return "".join(c for c in unicodedata.normalize("NFKD", h) if not unicodedata.combining(c))


def normalize_phone(raw: str):
    if not raw:
        return None, False
    digits = re.sub(r"\D", "", str(raw))
    if not digits:
        return None, False
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


def first_valid_phone(row):
    candidates = [row.get("telefone_1"), row.get("telefone_2")]
    outros = str(row.get("outrosTelefones") or "")
    candidates += re.split(r"[,|;]", outros)
    for raw in candidates:
        raw = str(raw or "").strip()
        if not raw or raw.lower() == "none":
            continue
        digits, valid = normalize_phone(raw)
        if valid:
            return raw, digits
    return "", None


def first_email(row):
    email = str(row.get("email") or "").strip()
    if email and email.lower() != "none":
        return email
    outros = str(row.get("outrosEmails") or "")
    for cand in re.split(r"[,|;]", outros):
        cand = cand.strip()
        if cand and cand.lower() != "none":
            return cand
    return ""


def clean_atuacao(cnae: str) -> str:
    cnae = str(cnae or "").strip()
    if not cnae or cnae.lower() == "none":
        return ""
    return re.sub(r"^\d+\s*-\s*", "", cnae)


def build_endereco(row) -> str:
    partes_rua = str(row.get("endereco") or "").strip()
    bairro = str(row.get("bairro") or "").strip()
    municipio = str(row.get("municipio") or "").strip()
    uf = str(row.get("uf") or "").strip()

    linha1 = partes_rua
    if bairro and bairro.lower() != "none":
        linha1 = f"{linha1} - {bairro}" if linha1 else bairro

    linha2 = ""
    if municipio and municipio.lower() != "none":
        linha2 = municipio
    if uf and uf.lower() != "none":
        linha2 = f"{linha2}/{uf}" if linha2 else uf

    return ", ".join(p for p in [linha1, linha2] if p)


def load_and_clean(inputs):
    frames = [pd.read_excel(p, dtype=str) for p in inputs]
    df = pd.concat(frames, ignore_index=True)

    stats = {
        "total_recebido": len(df),
        "removidos_sem_telefone_valido": 0,
        "removidos_duplicado": 0,
        "total_final": 0,
    }

    rows = []
    seen_phones = set()
    for _, row in df.iterrows():
        telefone_original, whatsapp = first_valid_phone(row)
        if not whatsapp:
            stats["removidos_sem_telefone_valido"] += 1
            continue
        if whatsapp in seen_phones:
            stats["removidos_duplicado"] += 1
            continue
        seen_phones.add(whatsapp)

        rows.append({
            "nome_socio": str(row.get("socios") or "").strip(),
            "telefone_original": telefone_original,
            "whatsapp": whatsapp,
            "endereco": build_endereco(row),
            "atuacao": clean_atuacao(row.get("cnaePrincipal")),
            "email": first_email(row),
        })

    stats["total_final"] = len(rows)
    return rows, stats


def write_csv(rows, output_path: Path):
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["nome_socio", "telefone_original", "whatsapp", "endereco", "atuacao", "email"]
        )
        writer.writeheader()
        writer.writerows(rows)


def write_html(rows, output_path: Path, title: str, parte_num: int, total_partes: int):
    def esc(s):
        return html.escape(str(s)) if s else ""

    cards = "\n".join(
        f"""<article class="card">
          <h3>{esc(r['nome_socio']) or 'Sem nome de sócio'}</h3>
          <p class="tel">{esc(r['telefone_original'])}</p>
          <p class="info"><span class="label">Endereço</span>{esc(r['endereco']) or '—'}</p>
          <p class="info"><span class="label">Atuação</span>{esc(r['atuacao']) or '—'}</p>
          <p class="info"><span class="label">E-mail</span>{esc(r['email']) or '—'}</p>
          <a class="wa-btn" href="https://wa.me/{r['whatsapp']}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3C8.5 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/></svg>
            Chamar no WhatsApp
          </a>
        </article>"""
        for r in rows
    )

    doc = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>{esc(title)} — Parte {parte_num}</title>
<style>
  :root {{ --dark:#0d1f1c; --accent:#00c9a7; --wa:#25D366; --light:#f5faf9; }}
  * {{ margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }}
  html {{ -webkit-text-size-adjust:100%; }}
  body {{ font-family:-apple-system,'Segoe UI',Arial,sans-serif; background:var(--light); color:var(--dark); padding:32px; }}
  h1 {{ font-size:clamp(19px,4vw,24px); margin-bottom:6px; }}
  .meta {{ color:#56685f; margin-bottom:24px; font-size:13px; }}
  .stats {{ display:flex; gap:14px; margin-bottom:28px; flex-wrap:wrap; }}
  .stat {{ background:#fff; border:1px solid #dce8e3; border-radius:10px; padding:14px 18px; min-width:150px; }}
  .stat .v {{ font-size:22px; font-weight:700; color:var(--dark); }}
  .stat .l {{ font-size:11.5px; color:#5d7269; text-transform:uppercase; letter-spacing:.04em; margin-top:2px; }}
  .stat.final {{ border-color:var(--accent); background:rgba(0,201,167,.08); }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; }}
  .card {{ background:#fff; border:1px solid #dce8e3; border-radius:12px; padding:16px; display:flex; flex-direction:column; box-shadow:0 2px 10px rgba(13,31,28,.05); min-width:0; }}
  .card h3 {{ font-size:15px; margin-bottom:4px; word-break:break-word; }}
  .card .tel {{ font-size:12.5px; color:#5d7269; margin-bottom:8px; }}
  .card .info {{ font-size:12.5px; line-height:1.5; margin-bottom:2px; word-break:break-word; }}
  .card .label {{ display:block; font-size:10.5px; color:#5d7269; text-transform:uppercase; letter-spacing:.04em; margin-top:6px; }}
  .wa-btn {{ margin-top:14px; display:flex; align-items:center; justify-content:center; gap:8px; background:var(--wa); color:#fff; font-weight:700; padding:12px 14px; border-radius:8px; text-decoration:none; font-size:14px; }}
  .wa-btn:active {{ opacity:.85; }}
  @media (max-width:480px) {{ body {{ padding:16px; }} .grid {{ grid-template-columns:1fr; }} .stats {{ gap:10px; }} .stat {{ min-width:120px; padding:12px 14px; }} }}
</style>
</head>
<body>
  <h1>{esc(title)} — Parte {parte_num} de {total_partes}</h1>
  <p class="meta">{len(rows)} contatos prontos para abordagem via WhatsApp.</p>
  <div class="stats">
    <div class="stat final"><div class="v">{len(rows)}</div><div class="l">Contatos nesta parte</div></div>
  </div>
  <div class="grid">
    {cards}
  </div>
</body>
</html>
"""
    output_path.write_text(doc, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Combina, limpa e divide listas CNPJ de prospecção.")
    parser.add_argument("--input", nargs="+", required=True, help="Um ou mais arquivos .xlsx")
    parser.add_argument("--output-dir", required=True, help="Pasta de saída")
    parser.add_argument("--partes", type=int, default=1, help="Em quantas partes dividir o resultado")
    parser.add_argument("--title", default="Lista de Prospecção", help="Título do relatório")
    args = parser.parse_args()

    rows, stats = load_and_clean(args.input)

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    n = args.partes
    tamanho = math.ceil(len(rows) / n)
    partes = [rows[i * tamanho:(i + 1) * tamanho] for i in range(n)]

    for i, parte in enumerate(partes, start=1):
        parte_dir = out_dir / f"Lista {i} - {len(parte)} contatos"
        parte_dir.mkdir(parents=True, exist_ok=True)
        write_csv(parte, parte_dir / "lista.csv")
        write_html(parte, parte_dir / "lista.html", args.title, i, n)

    print(f"Recebidos (combinado): {stats['total_recebido']}")
    print(f"Removidos (sem telefone válido): {stats['removidos_sem_telefone_valido']}")
    print(f"Removidos (duplicados): {stats['removidos_duplicado']}")
    print(f"Total final: {stats['total_final']}")
    for i, parte in enumerate(partes, start=1):
        print(f"Lista {i}: {len(parte)} contatos -> {out_dir / f'Lista {i} - {len(parte)} contatos' / 'lista.html'}")


if __name__ == "__main__":
    main()
