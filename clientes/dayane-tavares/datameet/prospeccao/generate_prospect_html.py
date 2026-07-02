import html
import re
from pathlib import Path
from urllib.parse import quote

import pandas as pd


SOURCE = Path("Lista_20266308522835.xlsx")
PHONE_COLUMNS = ("telefone_1", "telefone_2", "outrosTelefones")


def only_digits(value):
    return re.sub(r"\D", "", str(value or ""))


def cnpj_format(value):
    digits = only_digits(value).zfill(14)
    if len(digits) != 14:
        return html.escape(str(value or ""))
    return f"{digits[:2]}.{digits[2:5]}.{digits[5:8]}/{digits[8:12]}-{digits[12:]}"


def phone_format(digits):
    return f"({digits[:2]}) {digits[2:7]}-{digits[7:]}"


def whatsapp_numbers(row):
    numbers = []
    for col in PHONE_COLUMNS:
        for raw in re.split(r"[,;|/]+", str(row.get(col, ""))):
            digits = only_digits(raw)
            if digits.startswith("55") and len(digits) > 11:
                digits = digits[2:]
            if len(digits) == 11 and digits[2] == "9":
                numbers.append(digits)
    return sorted(set(numbers))


def clean(value):
    if pd.isna(value):
        return ""
    value = str(value).strip()
    return "" if value.lower() == "nan" else value


def field(label, value):
    value = clean(value)
    if not value:
        return ""
    return f"<span><strong>{html.escape(label)}:</strong> {html.escape(value)}</span>"


def render_item(row, position):
    company = clean(row.get("nomeFantasia")) or clean(row.get("razaoSocial"))
    legal_name = clean(row.get("razaoSocial"))
    city = " / ".join(part for part in (clean(row.get("municipio")), clean(row.get("uf"))) if part)
    phones = row["whatsapp"]
    message = f"Olá, tudo bem? Falo com {company}?"

    buttons = []
    for phone in phones:
        url = f"https://wa.me/55{phone}?text={quote(message)}"
        buttons.append(
            f'<a class="whatsapp" href="{url}" target="_blank" rel="noopener">'
            f"Chamar {phone_format(phone)}</a>"
        )

    details = "\n".join(
        part
        for part in (
            field("Razao social", legal_name if legal_name != company else ""),
            field("CNPJ", cnpj_format(row.get("cnpj"))),
            field("Cidade", city),
            field("Abertura", row.get("dataAbertura")),
            field("Porte", row.get("porte")),
            field("Faixa faturamento", row.get("faixa_faturamento")),
            field("Funcionarios", row.get("quantidade_funcionarios")),
            field("Socios", row.get("socios")),
            field("Email", row.get("email")),
        )
        if part
    )

    return f"""
      <article class="card">
        <div class="topline">
          <span class="index">#{position:03d}</span>
          <span class="location">{html.escape(city)}</span>
        </div>
        <h2>{html.escape(company)}</h2>
        <div class="actions">{''.join(buttons)}</div>
        <div class="details">{details}</div>
      </article>
"""


def render_page(rows, title, filename):
    total = len(rows)
    cards = "\n".join(render_item(row, i + 1) for i, (_, row) in enumerate(rows.iterrows()))
    content = f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)}</title>
  <style>
    :root {{
      --bg: #f6f7f9;
      --panel: #ffffff;
      --ink: #18212f;
      --muted: #677083;
      --line: #dfe3ea;
      --green: #128c4a;
      --green-dark: #0e6f3b;
      --blue: #244b8f;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: var(--bg);
      color: var(--ink);
    }}
    header {{
      position: sticky;
      top: 0;
      z-index: 2;
      background: #ffffff;
      border-bottom: 1px solid var(--line);
      padding: 18px 24px;
    }}
    header h1 {{
      margin: 0 0 6px;
      font-size: 24px;
      line-height: 1.2;
    }}
    header p {{
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }}
    main {{
      max-width: 1180px;
      margin: 0 auto;
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 14px;
    }}
    .card {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }}
    .topline {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
    }}
    .index {{
      color: var(--blue);
      font-weight: 700;
    }}
    .location {{
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}
    h2 {{
      margin: 0;
      font-size: 17px;
      line-height: 1.25;
    }}
    .actions {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }}
    .whatsapp {{
      min-height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 9px 12px;
      border-radius: 6px;
      background: var(--green);
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
    }}
    .whatsapp:hover {{ background: var(--green-dark); }}
    .details {{
      border-top: 1px solid var(--line);
      padding-top: 11px;
      display: grid;
      gap: 7px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.35;
    }}
    .details strong {{ color: var(--ink); }}
    @media print {{
      header {{ position: static; }}
      main {{ display: block; padding: 0; }}
      .card {{ break-inside: avoid; margin: 0 0 10px; }}
      .whatsapp {{ color: #ffffff !important; }}
    }}
  </style>
</head>
<body>
  <header>
    <h1>{html.escape(title)}</h1>
    <p>{total} contatos com celular valido para WhatsApp. Fixos e contatos apenas com e-mail foram removidos.</p>
  </header>
  <main>
{cards}
  </main>
</body>
</html>
"""
    Path(filename).write_text(content, encoding="utf-8")


def main():
    df = pd.read_excel(SOURCE, dtype=str).fillna("")
    df["whatsapp"] = df.apply(whatsapp_numbers, axis=1)
    valid = df[df["whatsapp"].map(bool)].copy()
    valid = valid.sort_values(
        by=["uf", "municipio", "nomeFantasia", "razaoSocial"],
        kind="stable",
    ).reset_index(drop=True)

    half = (len(valid) + 1) // 2
    render_page(valid.iloc[:half], "Prospeccao WhatsApp - Lista 1", "prospeccao_whatsapp_lista_1.html")
    render_page(valid.iloc[half:], "Prospeccao WhatsApp - Lista 2", "prospeccao_whatsapp_lista_2.html")
    print(f"valid={len(valid)} excluded={len(df) - len(valid)} split={half}/{len(valid) - half}")


if __name__ == "__main__":
    main()


