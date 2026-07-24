import os
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(BASE, "guia-otimizacao-perfil.html")
out_path = os.path.join(BASE, "Guia de Otimização de Perfil — Dra. Claudia Mara.pdf")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(f"file:///{html_path.replace(os.sep, '/')}")
    page.wait_for_timeout(800)
    page.pdf(
        path=out_path,
        width="794px",
        height="1123px",
        print_background=True,
        margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
    )
    browser.close()

print("saved", out_path)
