# Guia de Design — Mateus Botelho

> Você pode editar esse arquivo a qualquer momento.
> As skills de carrossel, proposta e slide leem este arquivo antes de criar qualquer visual.

---

## Cores

- **Fundo principal:** `#F4F4F2` (off-white)
- **Preto:** `#0A0A0B` — texto principal, bordas, fundos de seção escura (footer, CTA final, "pra quem é")
- **Azul elétrico (cor de destaque/CTA):** `#2438E8`
- **Azul claro (hover/texto sobre fundo escuro):** `#4F6BFF`
- **Azul profundo (fundo de seção escura alternativa):** `#0E1A8C`
- **Branco puro:** `#FFFFFF`
- **Cinza (texto secundário sobre claro):** `#8A8A92`
- **Cinza escuro (texto de apoio/corpo sobre off-white):** `#54545C`
- **Cor proibida:** vermelho, tons pastel — a marca é azul + preto + off-white, alto contraste

---

## Tipografia

- **Títulos de destaque (display):** Bricolage Grotesque peso 800 (Google Fonts) — grotesca contemporânea, uppercase, usada em hero, section-title, prova, CTA final. Substituiu Bomstad Display Black (05/07/2026). É variável (eixos `opsz`+`wght`); nos títulos usa peso 800 pra manter o impacto black da fase anterior
- **Subtítulos/labels/botões:** Archivo Black (Google Fonts) — uppercase, letter-spacing leve
- **Corpo de texto:** Archivo (Google Fonts, pesos 400/500/600/700/800)
- **Destaque editorial (itálico, citações):** Playfair Display itálico (Google Fonts, `ital@1`) — cor azul, usado com moderação em aspas/frases de efeito
- **Google Fonts import:** `https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Playfair+Display:ital@1&display=swap`
- **Sem fontes locais no site:** desde 05/07/2026 o site não hospeda nenhum `.ttf`/`.otf` — toda a tipografia vem do Google Fonts e a pasta `assets/fonts/` do site foi removida
- **Fontes locais legadas (não usar mais):** Bomstad Display (todas as variações, incluindo a Black), Freight Big Pro e Helvetica em `marca/fontes/legado/` — mantidas só como histórico, não refletem a marca atual

---

## Estilo geral

Visual neobrutalista: fundo off-white como base, preto para texto e bordas, azul elétrico como único destaque de cor. Bordas pretas grossas (2px) em cards, botões e frames de foto. Sombras duras e sólidas (não borradas) — deslocadas 4-6px, cor sólida (preto ou azul), sem blur. Border-radius grande (20px cards, 14px elementos menores), mas sempre com borda preta visível, nunca "flutuando" sem contorno. Transições rápidas e diretas (`cubic-bezier(0.16, 1, 0.3, 1)`, ~0.25s). Seções alternam entre fundo off-white e fundo preto/azul-profundo para dar ritmo.

---

## Elementos-chave

- Bordas: `2px solid #0A0A0B` como padrão em cards, botões, frames de foto e tags
- Border-radius: 20px (cards e frames grandes), 14px (cards menores/ícones), 100px (pills, botões, tags)
- Sombras duras (hard shadow), sem blur: `6px 6px 0 #2438E8` (padrão), `6px 6px 0 #0A0A0B` (variante preta), `4px 4px 0` (versão pequena)
- Hover em botões/cards: translada -2px/-3px e aumenta a sombra (`8px 8px 0`) — efeito de "levantar"
- Botões: pill (`border-radius: 100px`), fundo azul `#2438E8`, borda preta 2px, sombra dura preta, texto branco uppercase em Archivo Black
- Tags/badges: pill, borda preta 2px, fundo azul (`tag--blue`) ou branco (`tag--ghost`)
- Ícones em círculo/quadrado: fundo preto, ícone branco, ou fundo azul conforme contexto

---

## O que NUNCA fazer

- Não usar vermelho como destaque — a paleta é azul + preto + off-white
- Não usar sombras borradas/suaves em cards ou botões — sempre sombra dura, sólida, sem blur
- Não deixar cards/botões sem borda preta de 2px — é a assinatura visual do neobrutalismo da marca
- Não usar Bebas Neue — foi substituída por Anton/Archivo Black
- Não usar fundo escuro como base do documento inteiro — o fundo padrão é off-white (`#F4F4F2`), preto é usado em seções de contraste, não como fundo geral

---

## Logo

- **Tipo:** logotipo textual ("Mateus Botelho" em Anton uppercase), favicon com marca azul sobre fundo off-white arredondado
- **Arquivos:** `marca/logo/`
  - `logo-positiva.svg` / `.png` — versão para fundo claro
  - `logo-negativa.svg` — versão para fundo escuro
  - `favicon.svg` — ícone com cantos arredondados, fundo off-white
  - `icone-mark.svg` — só a marca, sem fundo
- **Variações:** `marca/variacoes-logo/`
  - `quadrado-off-white.svg`, `quadrado-preto.svg`, `quadrado-azul.svg` — variações de fundo para foto de perfil/redes sociais
- **Onde usar:** navbar, footer, slide final do carrossel (CTA), header de propostas e relatórios
- **Tamanho sugerido:** largura entre 120-200px nos HTMLs

---

## Perfil do autor

> Usado no estilo "tweet" do carrossel.

- **Nome:** Mateus Botelho
- **Handle:** @mateusbotelhopro
- **Foto frontal:** `marca/fotos/mateus-botelho-frontal.jpeg`
- **Foto perfil:** `marca/fotos/mateus-botelho-perfil.jpeg`
- **Badge verificado:** não

---

## Observações adicionais

Identidade extraída do site institucional atual (`interno/mateus-botelho/site/mateusbotelho.com/`, `style.css`). Substituiu a fase anterior azul/Freight Big Pro (meados de 2026) e a fase intermediária preto/vermelho/Bebas Neue — nenhuma das duas reflete a marca em uso. Fontes via Google Fonts (Bricolage Grotesque display + Archivo Black + Archivo + Playfair Display itálico). Atualizado em julho de 2026 para refletir o redesign neobrutalista (azul elétrico + preto + off-white, bordas e sombras duras).

Em 05/07/2026, a fonte de display foi trocada de Bomstad Display Black (fonte comercial local, risco de licença de webfont) para Bricolage Grotesque peso 800 (Google Fonts, aberta). Nessa troca o site deixou de hospedar qualquer fonte local: a pasta `assets/fonts/` do site foi removida e o `@font-face` da Bomstad substituído pelo import do Google Fonts. A Bomstad (todas as variações) ficou em `marca/fontes/legado/`. Na mesma data, o banner de compartilhamento (Open Graph) do site — `assets/og-banner.png`, 1200×630 — foi refeito com a Bricolage e o copy realinhado ao posicionamento de advogados ("Mais caso, não curtida" / "dentro das normas da OAB"). O HTML-fonte do banner ficou em `marca/og-banner-source.html` (regenerável: renderizar em 1200×630 via Playwright). Obs.: PNGs são ignorados pelo git (`*.png` no `.gitignore`), então o banner vive só no disco/servidor — a fonte HTML é o que garante regeneração.

Pasta `marca/` reorganizada em 03/07/2026: logo final em `marca/logo/`, fotos em `marca/fotos/`, fontes em `marca/fontes/` com legadas movidas para `marca/fontes/legado/`. Removidos arquivos de rascunho (previews HTML/PNG de teste, path_extract.txt, ícone.svg duplicado) que não eram mais necessários.

Em 04/07/2026, trocado o font-display do site de Anton para Bomstad Display Black (fonte local, antes classificada como legado). Anton removida do import do Google Fonts. Corrigido também o favicon do site, que estava com uma versão improvisada (fundo preto, "M" solto) em vez do arquivo real `marca/logo/favicon.svg` (fundo off-white, marca azul) — arquivo copiado pra `assets/favicon.svg` do site.

Corrigido bug em `logo-positiva.svg`/`logo-negativa.svg`: as cores do texto estavam trocadas (positiva com texto off-white, invisível em fundo claro; negativa com texto preto, invisível em fundo escuro) — provável motivo de o site nunca ter usado os arquivos, só texto puro no navbar/footer. Corrigido (positiva = texto preto, negativa = texto off-white), `logo-positiva.png` regerado a partir do SVG corrigido, e as duas versões agora estão de fato aplicadas no site (`assets/logo-positiva.svg` no navbar, `assets/logo-negativa.svg` no footer).
