# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "prints")
OUT = os.path.join(BASE, "anotado")
os.makedirs(OUT, exist_ok=True)

ACCENT = (56, 189, 248)   # #38bdf8
RED = (239, 68, 68)       # #ef4444
GREEN = (34, 197, 94)     # #22c55e
BG = (10, 10, 10)
WHITE = (255, 255, 255)
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"

GRADE = os.path.join(SRC, "WhatsApp Image 2026-07-03 at 16.33.27.jpeg")
PERFIL = os.path.join(SRC, "WhatsApp Image 2026-07-03 at 16.33.279.jpeg")


def load_font(size):
    return ImageFont.truetype(FONT_BOLD, size)


def text_block_size(draw, text, font, line_gap=6):
    lines = text.split("\n")
    w = max(draw.textlength(l, font=font) for l in lines)
    h = (font.size + line_gap) * len(lines)
    return w, h


def draw_label_box(draw, xy, text, font, color=ACCENT, pad=10):
    lx, ly, rx, ry = xy
    draw.rounded_rectangle([lx, ly, rx, ry], radius=8, fill=BG, outline=color, width=3)
    lines = text.split("\n")
    line_h = font.size + 6
    for i, l in enumerate(lines):
        draw.text((lx + pad, ly + pad + i * line_h), l, font=font, fill=WHITE)


def draw_arrow(draw, start, end, color=ACCENT):
    draw.line([start, end], fill=color, width=5)
    ax, ay = end
    r = 8
    draw.ellipse([ax - r, ay - r, ax + r, ay + r], outline=color, width=4)
    draw.ellipse([ax - 3, ay - 3, ax + 3, ay + 3], fill=color)


def canvas_with_margin(photo, margins, scale=1):
    if scale != 1:
        photo = photo.resize((photo.width * scale, photo.height * scale), Image.LANCZOS)
    pw, ph = photo.size
    ml, mt, mr, mb = [m * scale for m in margins]
    canvas = Image.new("RGB", (pw + ml + mr, ph + mt + mb), BG)
    canvas.paste(photo, (int(ml), int(mt)))
    return canvas, (ml, mt)


def labeled_box(draw, text, font, top_left, color):
    """Draws a label box with top-left corner at top_left, returns its rect."""
    tw, th = text_block_size(draw, text, font)
    bw, bh = tw + 20, th + 20
    lx, ly = top_left
    draw_label_box(draw, (lx, ly, lx + bw, ly + bh), text, font, color=color)
    return (lx, ly, lx + bw, ly + bh)


# ---------- 1. VITRINE: bio + destaques ----------
im = Image.open(PERFIL).convert("RGB")
photo = im.crop((0, 0, 700, 218))
canvas, (ml, mt) = canvas_with_margin(photo, margins=(20, 20, 20, 190), scale=2)
draw = ImageDraw.Draw(canvas)
font = load_font(24)
draw.rectangle([ml, mt, ml + photo.width * 2, mt + photo.height * 2], outline=ACCENT, width=2)
anchor = (int(419 * 2 + ml), int(183 * 2 + mt))
box = labeled_box(
    draw,
    "APENAS 2 DESTAQUES FIXADOS\nFaltam: A Clínica · Quem Sou · Pacientes",
    font,
    (ml + 20, canvas.height - 150),
    ACCENT,
)
draw_arrow(draw, (box[0] + 40, box[1]), anchor, color=ACCENT)
canvas.save(os.path.join(OUT, "01-vitrine-bio-destaques.jpg"), quality=92)
print("saved 01")

# ---------- 2. POSTS FIXADOS: 3 lábios ----------
im = Image.open(PERFIL).convert("RGB")
photo = im.crop((186, 230, 508, 368))
canvas, (ml, mt) = canvas_with_margin(photo, margins=(20, 90, 20, 20), scale=2)
draw = ImageDraw.Draw(canvas)
font = load_font(22)
draw.rectangle([ml, mt, ml + photo.width * 2, mt + photo.height * 2], outline=RED, width=2)
# center of middle lip cell, relative to crop origin (186,230)
anchor = (int((347 - 186) * 2 + ml), int((299 - 230) * 2 + mt))
box = labeled_box(
    draw,
    "3 DE 3 POSTS FIXADOS SAO DO\nMESMO PROCEDIMENTO (LABIOS)",
    font,
    (ml, 16),
    RED,
)
draw_arrow(draw, ((box[0] + box[2]) / 2, box[3]), anchor, color=RED)
canvas.save(os.path.join(OUT, "02-posts-fixados.jpg"), quality=92)
print("saved 02")

# ---------- 3. MINA DE OURO: reels validados ----------
im = Image.open(GRADE).convert("RGB")
photo = im.crop((401, 156, 711, 325))
canvas, (ml, mt) = canvas_with_margin(photo, margins=(20, 20, 20, 130), scale=2)
draw = ImageDraw.Draw(canvas)
font = load_font(20)
draw.rectangle([ml, mt, ml + photo.width * 2, mt + photo.height * 2], outline=GREEN, width=2)

# reel A (jaleco, 39,6mil) center, relative to crop origin (401,156)
a_anchor = (int((459 - 401) * 2 + ml), int((240 - 156) * 2 + mt))
box_a = labeled_box(draw, "39,6 MIL VIEWS\nJALECO", font, (ml + 20, canvas.height - 110), GREEN)
draw_arrow(draw, ((box_a[0] + box_a[2]) / 2, box_a[1]), a_anchor, color=GREEN)

# reel B (paciente masculino, 10,8mil) center
b_anchor = (int((652 - 401) * 2 + ml), int((240 - 156) * 2 + mt))
box_b = labeled_box(draw, "10,8 MIL VIEWS\nPACIENTE", font, (ml + 20 + (box_a[2] - box_a[0]) + 30, canvas.height - 110), GREEN)
draw_arrow(draw, ((box_b[0] + box_b[2]) / 2, box_b[1]), b_anchor, color=GREEN)

canvas.save(os.path.join(OUT, "03-mina-de-ouro-reels.jpg"), quality=92)
print("saved 03")

print("done")
