# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "anotado")
os.makedirs(OUT, exist_ok=True)

ACCENT = (56, 189, 248)       # #38bdf8
BG = (10, 10, 10)             # #0a0a0a
WHITE = (255, 255, 255)
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"


def load_font(size):
    return ImageFont.truetype(FONT_BOLD, size)


def text_block_size(draw, text, font, line_gap=6):
    lines = text.split("\n")
    w = max(draw.textlength(l, font=font) for l in lines)
    h = (font.size + line_gap) * len(lines)
    return w, h


def draw_arrow_line(draw, start, end):
    draw.line([start, end], fill=ACCENT, width=5)
    ax, ay = end
    r = 9
    draw.ellipse([ax - r, ay - r, ax + r, ay + r], outline=ACCENT, width=4)
    draw.ellipse([ax - 3, ay - 3, ax + 3, ay + 3], fill=ACCENT)


def draw_label_box(draw, box_xy, text, font, pad=10):
    lx, ly, rx, ry = box_xy
    draw.rounded_rectangle([lx, ly, rx, ry], radius=10, fill=BG, outline=ACCENT, width=3)
    lines = text.split("\n")
    line_h = font.size + 6
    for i, l in enumerate(lines):
        draw.text((lx + pad, ly + pad + i * line_h), l, font=font, fill=WHITE)


def annotate(filename, out_name, margins, labels, font_size=20, scale=1):
    """margins = (left, top, right, bottom) em px ao redor da foto original.
    labels = lista de dicts: side ('left'|'right'|'top'|'bottom'), slot (posicao ordinal 0..n na margem),
             anchor (x,y) no espaco da FOTO ORIGINAL, text (str)
    scale = fator de upscale aplicado a fotos pequenas antes de anotar, para texto nitido no PDF.
    """
    path = os.path.join(BASE, filename)
    photo = Image.open(path).convert("RGB")
    if scale != 1:
        photo = photo.resize((photo.width * scale, photo.height * scale), Image.LANCZOS)
        labels = [{**lab, "anchor": (lab["anchor"][0] * scale, lab["anchor"][1] * scale)} for lab in labels]
        margins = tuple(m * scale for m in margins)
        font_size = font_size * scale
    pw, ph = photo.size
    ml, mt, mr, mb = margins
    canvas_w = pw + ml + mr
    canvas_h = ph + mt + mb
    canvas = Image.new("RGB", (canvas_w, canvas_h), BG)
    canvas.paste(photo, (ml, mt))
    draw = ImageDraw.Draw(canvas)
    font = load_font(font_size)

    # contorno sutil na foto
    draw.rectangle([ml, mt, ml + pw, mt + ph], outline=ACCENT, width=2)

    # agrupar por lado para empilhar
    by_side = {"left": [], "right": [], "top": [], "bottom": []}
    for lab in labels:
        by_side[lab["side"]].append(lab)

    for side, items in by_side.items():
        n = len(items)
        for i, lab in enumerate(items):
            text = lab["text"]
            ax, ay = lab["anchor"]
            ax += ml
            ay += mt
            tw, th = text_block_size(draw, text, font)
            box_w, box_h = tw + 20, th + 20

            if side == "left":
                lx = 14
                ly = mt + (i + 0.5) * (ph / n) - box_h / 2
                ly = max(6, min(ly, canvas_h - box_h - 6))
                start = (lx + box_w, ly + box_h / 2)
            elif side == "right":
                lx = canvas_w - box_w - 14
                ly = mt + (i + 0.5) * (ph / n) - box_h / 2
                ly = max(6, min(ly, canvas_h - box_h - 6))
                start = (lx, ly + box_h / 2)
            elif side == "top":
                lx = ml + (i + 0.5) * (pw / n) - box_w / 2
                lx = max(6, min(lx, canvas_w - box_w - 6))
                ly = 14
                start = (lx + box_w / 2, ly + box_h)
            else:  # bottom
                lx = ml + (i + 0.5) * (pw / n) - box_w / 2
                lx = max(6, min(lx, canvas_w - box_w - 6))
                ly = canvas_h - box_h - 14
                start = (lx + box_w / 2, ly)

            draw_arrow_line(draw, start, (ax, ay))
            draw_label_box(draw, (lx, ly, lx + box_w, ly + box_h), text, font)

    out_path = os.path.join(OUT, out_name)
    canvas.save(out_path, quality=92)
    print("saved", out_path)


# ---------- A: Tatui (900x1600) ----------
annotate(
    "WhatsApp Image 2026-06-22 at 12.23.35.jpeg",
    "01-tatui.jpg",
    margins=(260, 60, 260, 60),
    labels=[
        {"side": "left", "anchor": (450, 380), "text": "ESTRUTURA\n(MOSAICO/CONFIANCA)"},
        {"side": "left", "anchor": (230, 850), "text": "FATOR HUMANO\n(SEGURANCA)"},
        {"side": "right", "anchor": (345, 200), "text": "LOCALIZACAO\n(CONVERSAO LOCAL)"},
        {"side": "right", "anchor": (350, 615), "text": "CTA ALTO VALOR\n(AGENDAMENTO)"},
    ],
    font_size=22,
)

# ---------- B: Itaim feminino (900x1600) ----------
annotate(
    "WhatsApp Image 2026-06-22 at 14.53.48 (1).jpeg",
    "02-itaim-feminino.jpg",
    margins=(280, 60, 280, 60),
    labels=[
        {"side": "left", "anchor": (130, 120), "text": "ESTRUTURA\n(MOSAICO/CONFIANCA)"},
        {"side": "left", "anchor": (330, 710), "text": "LOCALIZACAO\n(CONVERSAO LOCAL)"},
        {"side": "left", "anchor": (480, 800), "text": "FATOR HUMANO\n(SEGURANCA)"},
        {"side": "right", "anchor": (350, 110), "text": "VALOR AGREGADO\n(QUEBRA DE MEDO)"},
        {"side": "right", "anchor": (350, 148), "text": "DIFERENCIAL\n(PUBLICO ALVO)"},
    ],
    font_size=20,
)

# ---------- C: Itaim problema/solucao (900x1600) ----------
annotate(
    "WhatsApp Image 2026-06-22 at 14.53.48.jpeg",
    "03-itaim-problema-solucao.jpg",
    margins=(280, 60, 280, 60),
    labels=[
        {"side": "left", "anchor": (180, 380), "text": "PROBLEMA/SOLUCAO\n(ANTES - INFLAMADO)"},
        {"side": "left", "anchor": (345, 190), "text": "LOCALIZACAO\n(CONVERSAO LOCAL)"},
        {"side": "right", "anchor": (570, 280), "text": "PROBLEMA/SOLUCAO\n(DEPOIS - CICATRIZADO)"},
        {"side": "right", "anchor": (350, 615), "text": "VALOR AGREGADO\n(QUEBRA DE MEDO)"},
    ],
    font_size=20,
)

# ---------- D: Blumenau Dermalive (338x600) ----------
annotate(
    "WhatsApp Image 2026-06-26 at 15.33.27.jpeg",
    "04-blumenau-dermalive.jpg",
    margins=(230, 50, 230, 50),
    labels=[
        {"side": "left", "anchor": (150, 285), "text": "ESTRUTURA\n(MOSAICO/CONFIANCA)"},
        {"side": "left", "anchor": (60, 450), "text": "VALOR AGREGADO\n(QUEBRA DE MEDO)"},
        {"side": "right", "anchor": (290, 300), "text": "DIFERENCIAL\n(PUBLICO ALVO)"},
        {"side": "right", "anchor": (140, 335), "text": "LOCALIZACAO\n(CONVERSAO LOCAL)"},
        {"side": "right", "anchor": (270, 480), "text": "FATOR HUMANO\n(SEGURANCA)"},
        {"side": "right", "anchor": (60, 565), "text": "CTA ALTO VALOR\n(AGENDAMENTO)"},
    ],
    font_size=18,
    scale=2,
)

# ---------- E: Sorocaba avaliacoes (900x1600) ----------
annotate(
    "WhatsApp Image 2026-06-26 at 15.33.278.jpeg",
    "05-sorocaba-avaliacoes.jpg",
    margins=(280, 60, 280, 60),
    labels=[
        {"side": "left", "anchor": (200, 150), "text": "ESTRUTURA\n(MOSAICO/CONFIANCA)"},
        {"side": "left", "anchor": (560, 455), "text": "LOCALIZACAO\n(CONVERSAO LOCAL)"},
        {"side": "left", "anchor": (150, 850), "text": "FATOR HUMANO\n(SEGURANCA)"},
        {"side": "right", "anchor": (400, 482), "text": "TRUST SIGNAL\n(+800 AVALIACOES)"},
        {"side": "right", "anchor": (150, 1060), "text": "CTA ALTO VALOR\n(AGENDAMENTO)"},
    ],
    font_size=20,
)

# ---------- F: Recife flyer (896x1195) ----------
annotate(
    "WhatsApp Image 2026-06-26 at 3.jpeg",
    "06-recife-flyer.jpg",
    margins=(280, 60, 280, 60),
    labels=[
        {"side": "left", "anchor": (445, 405), "text": "ESTRUTURA\n(MOSAICO/CONFIANCA)"},
        {"side": "left", "anchor": (445, 975), "text": "VALOR AGREGADO\n(QUEBRA DE MEDO)"},
        {"side": "right", "anchor": (445, 745), "text": "TRUST SIGNAL\n(+800 AVALIACOES)"},
        {"side": "right", "anchor": (445, 1110), "text": "LOCALIZACAO\n(CONVERSAO LOCAL)"},
    ],
    font_size=20,
)

print("done")
