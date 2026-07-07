"""
Gera os HTMLs e renderiza em PNG os 3 anúncios de tráfego pago (Meta Ads),
cada um em Feed (1080x1350) e Stories (1080x1920).
Uso: python _gerar_ads.py
"""
import os
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))

FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Playfair+Display:ital@1&display=swap" rel="stylesheet">'

SIZES = {"feed": (1080, 1350), "stories": (1080, 1920)}

TEMPLATE_LIGHT = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
{fonts}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  :root{{ --bg:#F4F4F2; --ink:#0A0A0B; --blue:#2438E8; --white:#fff; --gray:#54545C; }}
  html,body{{ width:{w}px; height:{h}px; }}
  body{{ background:var(--bg); color:var(--ink); font-family:'Archivo',sans-serif;
    padding:{pad}; position:relative; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden; }}
  .top{{ display:flex; align-items:center; gap:14px; }}
  .brand-pill{{ display:inline-flex; align-items:center; gap:10px; border:2px solid var(--ink); border-radius:100px;
    padding:12px 22px; background:var(--white); box-shadow:5px 5px 0 var(--ink);
    font-family:'Archivo Black',sans-serif; font-size:19px; text-transform:uppercase; letter-spacing:.5px; }}
  .dot{{ width:14px; height:14px; border-radius:50%; background:var(--blue); }}
  .center{{ margin-top:auto; margin-bottom:auto; }}
  .kicker{{ font-family:'Archivo Black',sans-serif; font-size:{kicker_size}px; text-transform:uppercase; letter-spacing:2px; color:var(--blue); margin-bottom:{kicker_mb}px; }}
  h1{{ font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:{h1_size}px; line-height:.98; letter-spacing:-2px; text-transform:uppercase; max-width:{h1_maxw}px; }}
  h1 em{{ font-style:normal; color:var(--blue); }}
  .sub{{ margin-top:{sub_mt}px; font-size:{sub_size}px; line-height:1.35; font-weight:600; max-width:{sub_maxw}px; color:var(--ink); }}
  .cta-btn{{ margin-top:{cta_mt}px; display:inline-flex; align-items:center; gap:16px; background:var(--blue); color:var(--white);
    border:2px solid var(--ink); border-radius:100px; box-shadow:6px 6px 0 var(--ink);
    padding:{cta_pad}; font-family:'Archivo Black',sans-serif; font-size:{cta_size}px; text-transform:uppercase; letter-spacing:1px; }}
  .bottom{{ display:flex; align-items:flex-end; justify-content:space-between; }}
  .brand{{ font-family:'Archivo Black',sans-serif; font-size:18px; letter-spacing:.5px; text-transform:uppercase; color:var(--gray); }}
</style>
</head>
<body>
  <div class="top"><span class="brand-pill"><span class="dot"></span>Botelho · Marketing Jurídico</span></div>
  <div class="center">
    <div class="kicker">{kicker}</div>
    <h1>{headline}</h1>
    <p class="sub">{sub}</p>
    <span class="cta-btn">{cta} →</span>
  </div>
  <div class="bottom">
    <span class="brand">@botelho.ag</span>
    <span class="brand">Botelho Marketing Jurídico</span>
  </div>
</body>
</html>
"""

TEMPLATE_DARK = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
{fonts}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  :root{{ --ink:#0A0A0B; --blue:#2438E8; --blue-l:#4F6BFF; --white:#fff; --gray:#8A8A92; }}
  html,body{{ width:{w}px; height:{h}px; }}
  body{{ background:var(--ink); color:var(--white); font-family:'Archivo',sans-serif;
    padding:{pad}; position:relative; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden; }}
  .top{{ display:flex; align-items:center; gap:14px; }}
  .brand-pill{{ display:inline-flex; align-items:center; gap:10px; border:2px solid var(--white); border-radius:100px;
    padding:12px 22px; font-family:'Archivo Black',sans-serif; font-size:19px; text-transform:uppercase; letter-spacing:.5px; }}
  .dot{{ width:14px; height:14px; border-radius:50%; background:var(--blue-l); }}
  .center{{ margin-top:auto; margin-bottom:auto; }}
  .kicker{{ font-family:'Archivo Black',sans-serif; font-size:{kicker_size}px; text-transform:uppercase; letter-spacing:2px; color:var(--blue-l); margin-bottom:{kicker_mb}px; }}
  h1{{ font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:{h1_size}px; line-height:.98; letter-spacing:-2px; text-transform:uppercase; max-width:{h1_maxw}px; }}
  h1 em{{ font-style:normal; color:var(--blue-l); }}
  .sub{{ margin-top:{sub_mt}px; font-size:{sub_size}px; line-height:1.35; font-weight:500; max-width:{sub_maxw}px; opacity:.9; }}
  .cta-btn{{ margin-top:{cta_mt}px; display:inline-flex; align-items:center; gap:16px; background:var(--blue); color:var(--white);
    border:2px solid var(--white); border-radius:100px; box-shadow:6px 6px 0 var(--blue-l);
    padding:{cta_pad}; font-family:'Archivo Black',sans-serif; font-size:{cta_size}px; text-transform:uppercase; letter-spacing:1px; }}
  .bottom{{ display:flex; align-items:flex-end; justify-content:space-between; }}
  .brand{{ font-family:'Archivo Black',sans-serif; font-size:18px; letter-spacing:.5px; text-transform:uppercase; opacity:.55; }}
</style>
</head>
<body>
  <div class="top"><span class="brand-pill"><span class="dot"></span>Botelho · Marketing Jurídico</span></div>
  <div class="center">
    <div class="kicker">{kicker}</div>
    <h1>{headline}</h1>
    <p class="sub">{sub}</p>
    <span class="cta-btn">{cta} →</span>
  </div>
  <div class="bottom">
    <span class="brand">@botelho.ag</span>
    <span class="brand">Botelho Marketing Jurídico</span>
  </div>
</body>
</html>
"""

# dimensões calibradas por formato (feed é mais baixo, precisa de tipografia menor que stories)
DIMS = {
    "feed": dict(pad="80px 76px", kicker_size=24, kicker_mb=26, h1_size=98, h1_maxw=880,
                 sub_mt=32, sub_size=36, sub_maxw=820, cta_mt=44, cta_pad="24px 40px", cta_size=26),
    "stories": dict(pad="64px 76px 56px", kicker_size=26, kicker_mb=30, h1_size=104, h1_maxw=880,
                    sub_mt=40, sub_size=40, sub_maxw=860, cta_mt=52, cta_pad="26px 44px", cta_size=28),
}

ADS = {
    "01-diagnostico-gratuito": dict(
        dark=False, kicker="Diagnóstico gratuito",
        headline="Seu escritório <em>ainda</em> depende só de indicação?",
        sub="Analiso seu Google, Instagram e captação de graça e mostro o que está travando a chegada de cliente novo.",
        cta="Quero o diagnóstico",
    ),
    "02-especialista-advocacia": dict(
        dark=True, kicker="Especialista em advocacia",
        headline="Marketing que entende <em>como advogado vende</em>",
        sub="Não sou agência que atende dentista, loja e escritório ao mesmo tempo. Atendimento solo, direto comigo.",
        cta="Fala comigo no direct",
    ),
    "03-advogado-pode-anunciar": dict(
        dark=False, kicker="Mito ou verdade",
        headline="Advogado <em>pode</em> anunciar",
        sub="Só não do jeito que você imagina. Dá pra ter presença digital forte e atrair cliente todo mês sem infringir o Código de Ética da OAB.",
        cta="Entenda como",
    ),
}


def build():
    generated = []
    for folder, ad in ADS.items():
        tpl = TEMPLATE_DARK if ad["dark"] else TEMPLATE_LIGHT
        for fmt, (w, h) in SIZES.items():
            html = tpl.format(fonts=FONTS, w=w, h=h, kicker=ad["kicker"],
                               headline=ad["headline"], sub=ad["sub"], cta=ad["cta"],
                               **DIMS[fmt])
            path = os.path.join(BASE, folder, "instagram", f"{fmt}.html")
            with open(path, "w", encoding="utf-8") as f:
                f.write(html)
            generated.append((path, w, h))
    return generated


def render(items):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for html_path, w, h in items:
            page = browser.new_page(viewport={"width": w, "height": h})
            page.goto("file:///" + html_path.replace("\\", "/"))
            png_path = html_path[:-5] + ".png"
            page.screenshot(path=png_path)
            page.close()
            print("OK", png_path)
        browser.close()


if __name__ == "__main__":
    items = build()
    render(items)
    print(f"Total: {len(items)} peças geradas e renderizadas.")
