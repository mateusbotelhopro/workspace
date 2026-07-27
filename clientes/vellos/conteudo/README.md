# Conteúdo — Vellos

Lote de 12 posts pro Instagram da Vellos: 6 posts estáticos + 6 carrosséis, cobrindo os
principais serviços (Agendamento com Decisores, Inteligência de ICP, Cadência Multicanal,
Qualificação BANT, Pipeline Report Semanal, Consultoria de Oferta) e os temas do blog
(BPO de SDR, BANT, erros de prospecção, SDR interno x terceirizado, cadência multicanal,
humanização x automação).

Identidade visual usada: paleta e tipografia do site (vellosleads.com.br) — fundo escuro
`#0d1f1c`, destaque verde `#00c9a7`, Playfair Display (headlines) + Inter (corpo).

## Estrutura

```
Posts Estáticos/
  01-o-funil-nao-e-o-problema/    post.html -> post.png, legenda.txt
  02-zero-lista-fria/
  03-inteligencia-de-icp/
  04-pipeline-report-semanal/
  05-consultoria-de-oferta/
  06-planos/

Carrosséis/
  01-o-que-e-bpo-de-sdr/           instagram/slide-01.html -> slide-01.png ... , legenda.txt
  02-o-que-e-bant/
  03-5-erros-que-travam-a-prospeccao/
  04-sdr-terceirizado-ou-interno/
  05-cadencia-multicanal/
  06-humanizacao-ou-automacao/
```

Cada post/carrossel já vem com a arte renderizada (`.png`, pronta pra upload) e a legenda
de Instagram (`legenda.txt`, com CTA e hashtags, pronta pra copiar e colar). Pra ajustar
algum slide, edita o `.html` e roda de novo:

```bash
npx playwright screenshot --viewport-size=1080,1350 --wait-for-timeout=150 slide-01.html slide-01.png
```
