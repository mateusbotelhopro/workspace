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

- **Títulos de destaque (display):** Bomstad Display Black (fonte local, `marca/fontes/BomstadDisplay-Black.ttf`) — uppercase, usado em hero, section-title, CTA final. Substituiu Anton
- **Subtítulos/labels/botões:** Archivo Black (Google Fonts) — uppercase, letter-spacing leve
- **Corpo de texto:** Archivo (Google Fonts, pesos 400/500/600/700/800)
- **Destaque editorial (itálico, citações):** Playfair Display itálico (Google Fonts, `ital@1`) — cor azul, usado com moderação em aspas/frases de efeito
- **Google Fonts import:** `https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700;800&family=Playfair+Display:ital@1&display=swap`
- **Fonte local ativa:** Bomstad Display Black — arquivo em `marca/fontes/BomstadDisplay-Black.ttf` e replicado em `interno/site/mateusbotelho.com/assets/fonts/` para o `@font-face` do site
- **Fontes locais legadas (não usar mais):** Freight Big Pro e Helvetica em `marca/fontes/legado/` — mantidas só como histórico, não refletem a marca atual. As demais variações de peso do Bomstad Display (Bold, ExtraBold, Light etc.) também seguem em `legado/`, só a Black está ativa

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

Identidade extraída do site institucional atual (`interno/site/mateusbotelho.com/`, `style.css`). Substituiu a fase anterior azul/Freight Big Pro (meados de 2026) e a fase intermediária preto/vermelho/Bebas Neue — nenhuma das duas reflete a marca em uso. Fontes via Google Fonts (Anton + Archivo Black + Archivo + Playfair Display itálico). Atualizado em julho de 2026 para refletir o redesign neobrutalista (azul elétrico + preto + off-white, bordas e sombras duras).

Pasta `marca/` reorganizada em 03/07/2026: logo final em `marca/logo/`, fotos em `marca/fotos/`, fontes em `marca/fontes/` com legadas movidas para `marca/fontes/legado/`. Removidos arquivos de rascunho (previews HTML/PNG de teste, path_extract.txt, ícone.svg duplicado) que não eram mais necessários.

Em 04/07/2026, trocado o font-display do site de Anton para Bomstad Display Black (fonte local, antes classificada como legado). Anton removida do import do Google Fonts.
