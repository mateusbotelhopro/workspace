from playwright.sync_api import sync_playwright
import os

html_path = os.path.join(os.path.dirname(__file__), "relatorio-2026-07.html")
pdf_path = os.path.join(os.path.dirname(__file__), "relatorio-2026-07.pdf")

file_url = "file:///" + html_path.replace("\\", "/")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(file_url)
    page.wait_for_timeout(1500)
    page.pdf(
        path=pdf_path,
        format="A4",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
    )
    browser.close()

size_kb = os.path.getsize(pdf_path) / 1024
print(f"PDF salvo: {pdf_path}")
print(f"Tamanho: {size_kb:.0f} KB")
