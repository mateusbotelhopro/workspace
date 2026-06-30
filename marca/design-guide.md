# Guia de Design — Mateus Botelho

> Você pode editar esse arquivo a qualquer momento.
> As skills de carrossel, proposta e slide leem este arquivo antes de criar qualquer visual.

---

## Cores

- **Fundo principal:** `#0A0A0A` (preto)
- **Fundo principal alternativo:** `#050505` (preto profundo)
- **Fundo seções alternadas:** `#080808` (cinza quase preto)
- **Cor de destaque / CTA:** `#E50914` (vermelho vibrante)
- **Cor de destaque hover:** `#FF2D36` (vermelho mais claro)
- **Gradiente CTA:** `linear-gradient(135deg, #E50914 0%, #B20710 100%)`
- **Texto principal:** `#E8E8E8` (cinza claro)
- **Texto branco puro:** `#FFFFFF` (títulos e destaques)
- **Texto secundário / apoio:** `#818181` (cinza médio)
- **Texto terciário:** `#666666` (cinza escuro)
- **Fundo alternativo / cards:** `rgba(10, 10, 10, 0.80)` (preto translúcido)
- **Borda padrão:** `rgba(255, 255, 255, 0.06)` (branco bem sutil)
- **Borda destaque:** `rgba(229, 9, 20, 0.15)` (vermelho sutil)
- **Cor proibida:** tons pastel, fundos claros como base — a marca é escura, contrastante, vermelho como único destaque

---

## Tipografia

- **Títulos e destaques:** Bebas Neue (Google Fonts) — fallback Arial, sans-serif
- **Corpo, subtítulos e botões:** Inter (Google Fonts, pesos 400/500/600/700) — fallback Arial, sans-serif
- **Fontes locais disponíveis:** Freight Big Pro (`marca/fontes/`) e Helvetica (`marca/fontes/Helvetica.ttf`) — usar apenas como fallback ou em peças que peçam explicitamente
- **Peso do título:** 400 (Bebas Neue já é bold por natureza), uppercase, letter-spacing 1-2px
- **Google Fonts import:** `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap`

---

## Estilo geral

Visual escuro, bold, alto contraste. Fundo preto (`#0A0A0A`) com vermelho (`#E50914`) como única cor de destaque. Títulos em Bebas Neue uppercase com presença forte. Cards com fundo translúcido escuro e bordas vermelhas sutis. Transições suaves (`cubic-bezier(0.16, 1, 0.3, 1)`, 0.4s). Sombras com glow vermelho nos elementos de destaque (`box-shadow: 0 10px 24px rgba(229, 9, 20, 0.18)`).

---

## Elementos-chave

- Bordas: `rgba(255, 255, 255, 0.06)` padrão, `rgba(229, 9, 20, 0.15)` em cards com destaque
- Border-radius: 14-16px (cards), 8px (botões e elementos menores), 100px (pills/badges)
- Botões: border-radius 8px, gradiente vermelho (`linear-gradient(135deg, #E50914 0%, #B20710 100%)`), borda dourada sutil (`rgba(226, 201, 126, 0.3)`), sombra com glow vermelho (`box-shadow: 0 10px 24px rgba(229, 9, 20, 0.18)`)
- Badges/pills: border-radius 100px, fundo `rgba(255, 255, 255, 0.04)`, borda sutil branca
- Sombras: pretas suaves em cards (`0 18px 38px rgba(0, 0, 0, 0.24)`) e vermelhas em elementos de destaque/hover

---

## O que NUNCA fazer

- Não usar fundos claros como base — a marca é escura por padrão
- Não usar bordas grossas ou chapadas — sempre sutis e translúcidas
- Não usar cores além do vermelho como destaque (nada de azul, verde, laranja, amarelo)
- Não usar tons pastel ou cores suaves — a marca é de alto contraste
- Não usar Bebas Neue no corpo de texto — ela é só pra títulos/destaques (uppercase)

---

## Logo

- **Tipo:** logotipo textual ("Mateus Botelho" em Bebas Neue), sem símbolo/ícone separado até o momento
- **Onde usar:** slide final do carrossel (CTA), header de propostas, slides de apresentação
- **Tamanho sugerido:** largura entre 120-200px nos HTMLs

---

## Perfil do autor

> Usado no estilo "tweet" do carrossel.

- **Nome:** Mateus Botelho
- **Handle:** @mateusbotelhopro
- **Foto frontal:** `marca/mateus-botelho-frontal.jpeg`
- **Foto perfil:** `marca/mateus-botelho-perfil.jpeg`
- **Badge verificado:** não

---

## Observações adicionais

Identidade extraída do site institucional (`interno/site/mateusbotelho.com/`). Fontes via Google Fonts (Bebas Neue + Inter). Fontes locais legadas (Freight Big Pro, Helvetica) em `marca/fontes/`. Atualizado em junho de 2026 para refletir o redesign do site (de azul/Freight para vermelho/Bebas Neue).
