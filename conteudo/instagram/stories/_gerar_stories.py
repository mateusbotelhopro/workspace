"""
Gera os HTMLs e renderiza em PNG (1080x1920) os stories dos destaques.
Uso: python _gerar_stories.py
Depois de gerar, pode apagar este arquivo (é só ferramenta de build).
"""
import os
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))

FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Playfair+Display:ital@1&display=swap" rel="stylesheet">'

TEMPLATE_LIGHT = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
{fonts}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  :root{{
    --bg:#F4F4F2; --ink:#0A0A0B; --blue:#2438E8; --blue-deep:#0E1A8C;
    --white:#fff; --gray:#54545C;
  }}
  html,body{{ width:1080px; height:1920px; }}
  body{{
    background:var(--bg); color:var(--ink);
    font-family:'Archivo',sans-serif;
    padding:64px 76px 56px; position:relative;
    display:flex; flex-direction:column; justify-content:space-between;
    overflow:hidden;
  }}
  .segments{{ display:flex; gap:8px; }}
  .segments .seg{{ flex:1; height:6px; border-radius:100px; background:rgba(10,10,11,.15); overflow:hidden; }}
  .segments .seg.done{{ background:var(--blue); }}
  .top{{ display:flex; align-items:center; gap:14px; margin-top:22px; }}
  .brand-pill{{
    display:inline-flex; align-items:center; gap:10px;
    border:2px solid var(--ink); border-radius:100px;
    padding:12px 22px; background:var(--white);
    box-shadow:5px 5px 0 var(--ink);
    font-family:'Archivo Black',sans-serif; font-size:19px;
    text-transform:uppercase; letter-spacing:.5px;
  }}
  .dot{{ width:14px; height:14px; border-radius:50%; background:var(--blue); }}
  .center{{ margin-top:auto; margin-bottom:auto; }}
  .kicker{{
    font-family:'Archivo Black',sans-serif; font-size:26px;
    text-transform:uppercase; letter-spacing:2px; color:var(--blue);
    margin-bottom:30px;
  }}
  h1{{
    font-family:'Bricolage Grotesque',sans-serif; font-weight:800;
    font-size:98px; line-height:.99; letter-spacing:-1.5px;
    text-transform:uppercase;
  }}
  h1 em{{ font-style:normal; color:var(--blue); }}
  .sub{{
    margin-top:40px; font-size:42px; line-height:1.36; font-weight:500;
    color:var(--ink); max-width:880px;
  }}
  .sub b{{ font-weight:800; }}
  .bottom{{ display:flex; align-items:center; justify-content:space-between; }}
  .hint{{
    font-family:'Archivo Black',sans-serif; font-size:22px;
    text-transform:uppercase; letter-spacing:1px; color:var(--gray);
  }}
  .count{{ font-family:'Archivo Black',sans-serif; font-size:22px; color:var(--gray); }}
</style>
</head>
<body>
  <div>
    <div class="segments">{segments}</div>
    <div class="top"><span class="brand-pill"><span class="dot"></span>Botelho · Marketing Jurídico</span></div>
  </div>

  <div class="center">
    <div class="kicker">{kicker}</div>
    <h1>{headline}</h1>
    <p class="sub">{sub}</p>
  </div>

  <div class="bottom">
    <span class="hint">{hint}</span>
    <span class="count">{count}</span>
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
  :root{{
    --bg:#0A0A0B; --ink:#F4F4F2; --blue:#4F6BFF; --white:#fff; --gray:#8A8A92;
  }}
  html,body{{ width:1080px; height:1920px; }}
  body{{
    background:var(--bg); color:var(--ink);
    font-family:'Archivo',sans-serif;
    padding:64px 76px 56px; position:relative;
    display:flex; flex-direction:column; justify-content:space-between;
    overflow:hidden;
  }}
  .segments{{ display:flex; gap:8px; }}
  .segments .seg{{ flex:1; height:6px; border-radius:100px; background:rgba(244,244,242,.18); overflow:hidden; }}
  .segments .seg.done{{ background:var(--blue); }}
  .top{{ display:flex; align-items:center; gap:14px; margin-top:22px; }}
  .brand-pill{{
    display:inline-flex; align-items:center; gap:10px;
    border:2px solid var(--ink); border-radius:100px;
    padding:12px 22px; background:transparent; color:var(--ink);
    box-shadow:5px 5px 0 var(--blue);
    font-family:'Archivo Black',sans-serif; font-size:19px;
    text-transform:uppercase; letter-spacing:.5px;
  }}
  .dot{{ width:14px; height:14px; border-radius:50%; background:var(--blue); }}
  .center{{ margin-top:auto; margin-bottom:auto; }}
  .kicker{{
    font-family:'Archivo Black',sans-serif; font-size:26px;
    text-transform:uppercase; letter-spacing:2px; color:var(--blue);
    margin-bottom:30px;
  }}
  h1{{
    font-family:'Bricolage Grotesque',sans-serif; font-weight:800;
    font-size:98px; line-height:.99; letter-spacing:-1.5px;
    text-transform:uppercase; color:var(--ink);
  }}
  h1 em{{ font-style:normal; color:var(--blue); }}
  .sub{{
    margin-top:40px; font-size:42px; line-height:1.36; font-weight:500;
    color:var(--ink); max-width:880px;
  }}
  .sub b{{ font-weight:800; color:var(--blue); }}
  .bottom{{ display:flex; align-items:center; justify-content:space-between; }}
  .cta{{
    display:inline-flex; align-items:center; gap:14px;
    font-family:'Archivo Black',sans-serif; font-size:26px;
    text-transform:uppercase; letter-spacing:1px;
    background:var(--blue); color:var(--white);
    border:2px solid var(--ink); border-radius:100px;
    padding:22px 34px; box-shadow:6px 6px 0 var(--ink);
  }}
  .count{{ font-family:'Archivo Black',sans-serif; font-size:22px; color:var(--gray); }}
</style>
</head>
<body>
  <div>
    <div class="segments">{segments}</div>
    <div class="top"><span class="brand-pill"><span class="dot"></span>Botelho · Marketing Jurídico</span></div>
  </div>

  <div class="center">
    <div class="kicker">{kicker}</div>
    <h1>{headline}</h1>
    <p class="sub">{sub}</p>
  </div>

  <div class="bottom">
    <span class="cta">{hint}</span>
    <span class="count">{count}</span>
  </div>
</body>
</html>
"""


def segments_html(total, active_index):
    # segments up to and including the active one are "done" (lit)
    segs = []
    for i in range(total):
        cls = "seg done" if i <= active_index else "seg"
        segs.append(f'<div class="{cls}"></div>')
    return "".join(segs)


def slide(folder, n, total, kicker, headline, sub, hint, dark=False):
    tpl = TEMPLATE_DARK if dark else TEMPLATE_LIGHT
    html = tpl.format(
        fonts=FONTS,
        segments=segments_html(total, n - 1),
        kicker=kicker,
        headline=headline,
        sub=sub,
        hint=hint,
        count=f"{n:02d} / {total:02d}",
    )
    path = os.path.join(BASE, folder, "instagram", f"slide-{n:02d}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    return path


DESTAQUES = {
    "01-sobre-quem-somos": [
        dict(kicker="Botelho Marketing Jurídico", headline="Quem cuida<br>da sua<br><em>presença<br>digital</em>", sub="Marketing feito só pra escritório de advocacia.", hint="Toque pra continuar"),
        dict(kicker="Quem é", headline="Não sou<br>agência<br><em>genérica</em>", sub="Trabalho só com escritório de advocacia. As regras e o jeito de vender são diferentes de qualquer outro negócio.", hint="Toque pra continuar"),
        dict(kicker="O problema", headline="Indicação<br>não<br><em>escala</em>", sub="A maioria dos escritórios que atendo dependia só de indicação, sem controle de quando o próximo cliente chega.", hint="Toque pra continuar"),
        dict(kicker="Como atuo", headline="Tráfego<br>dentro<br>da <em>OAB</em>", sub="Tráfego pago, estrutura digital e presença no Instagram — sempre respeitando o que a OAB permite.", hint="Toque pra continuar"),
        dict(kicker="Diferencial", headline="Sem<br>estagiário<br>no <em>meio</em>", sub="Atendimento solo, direto comigo. Quem entende seu caso é quem toca a campanha.", hint="Toque pra continuar"),
    ],
    "02-oab-pode-ou-nao-pode": [
        dict(kicker="OAB e marketing", headline="Advogado<br>pode<br><em>anunciar?</em>", sub="A resposta que a maioria nunca te deu direito.", hint="Toque pra continuar"),
        dict(kicker="O mito", headline="Medo de<br>tomar<br><em>processo</em>", sub="Por causa desse medo, metade dos advogados não tenta e a outra metade faz do jeito errado.", hint="Toque pra continuar"),
        dict(kicker="Proibido", headline="Captação<br>e<br><em>promessa</em>", sub="Captar cliente direto, prometer resultado, usar preço como isca ou comparar com concorrente. Isso o Provimento 205/2021 proíbe.", hint="Toque pra continuar"),
        dict(kicker="Permitido", headline="Educar<br>e ter<br><em>presença</em>", sub="Conteúdo educativo, informação sobre sua área, presença profissional constante. Você pode aparecer.", hint="Toque pra continuar"),
        dict(kicker="Na prática", headline="Não é o<br>que, é o<br><em>como</em>", sub='"Contrate e garanto sua causa" é errado. "Entenda o que a lei diz sobre pensão" é certo.', hint="Toque pra continuar"),
        dict(kicker="Por que importa", headline="Dá pra<br>crescer<br>sem <em>risco</em>", sub="O problema nunca foi anunciar. Foi anunciar do jeito que gera risco ético.", hint="Toque pra continuar"),
    ],
    "03-como-funciona": [
        dict(kicker="O método", headline="Como<br>estruturo<br>a <em>captação</em>", sub="O passo a passo, sem enrolação.", hint="Toque pra continuar"),
        dict(kicker="Passo 1", headline="Diagnóstico<br>antes da<br><em>campanha</em>", sub="Área de atuação, ticket médio, região e concorrência. Sem isso, qualquer anúncio é chute.", hint="Toque pra continuar"),
        dict(kicker="Passo 2", headline="Estrutura<br>que<br><em>converte</em>", sub="Perfil e página ajustados. Tráfego pra perfil fraco ou site lento é dinheiro perdido.", hint="Toque pra continuar"),
        dict(kicker="Passo 3", headline="Busca de<br>quem já<br><em>procura</em>", sub="Campanha de intenção no Google. Na frente de quem já está procurando um advogado agora.", hint="Toque pra continuar"),
        dict(kicker="Passo 4", headline="Resposta<br>rápida<br>ao <em>lead</em>", sub="O gargalo que mais derruba conversão não é a campanha. É a demora pra responder.", hint="Toque pra continuar"),
        dict(kicker="Passo 5", headline="Medir e<br><em>ajustar</em><br>sempre", sub="Quantos contatos viraram reunião, quantas reuniões viraram cliente. Sem achismo.", hint="Toque pra continuar"),
    ],
}

CTA_FINAL = {
    "01-sobre-quem-somos": dict(kicker="Próximo passo", headline="Vamos<br>conversar?", sub="Manda um <b>“oi”</b> no direct. Sem compromisso, sem discurso de vendas."),
    "02-oab-pode-ou-nao-pode": dict(kicker="Ficou com dúvida?", headline="Manda no<br>direct"),
    "03-como-funciona": dict(kicker="Quer isso no seu escritório?", headline="Chama no<br>direct"),
}


def build():
    generated = []
    for folder, slides in DESTAQUES.items():
        total = len(slides) + 1  # + CTA final
        for i, s in enumerate(slides, start=1):
            generated.append(slide(folder, i, total, s["kicker"], s["headline"], s["sub"], s["hint"]))
        cta = CTA_FINAL[folder]
        sub = cta.get("sub", "")
        path = slide(folder, total, total, cta["kicker"], cta["headline"], sub, "Botelho Marketing Jurídico", dark=True)
        generated.append(path)
    return generated


def render(paths):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1920})
        for html_path in paths:
            page.goto("file:///" + html_path.replace("\\", "/"))
            png_path = html_path[:-5] + ".png"
            page.screenshot(path=png_path)
            print("OK", png_path)
        browser.close()


if __name__ == "__main__":
    paths = build()
    render(paths)
    print(f"Total: {len(paths)} slides gerados e renderizados.")
