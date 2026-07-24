const { chromium } = require('playwright');

(async () => {
  const [,, htmlPath, pdfPath] = process.argv;
  if (!htmlPath || !pdfPath) {
    console.error('Uso: node gerar-pdf.js <html-de-entrada> <pdf-de-saida>');
    process.exit(1);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
})();
