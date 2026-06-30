# Juliana do Tráfego — Identidade Visual

## Logo

Não possui logo. Usar o nome "Juliana do Tráfego" em texto estilizado:

- **Fonte:** Playfair Display, peso 600
- **Estilo:** maiúsculas, letter-spacing: 2px
- **Cor:** bordô (#6B2D3E) sobre fundo claro, branco (#FFFFFF) sobre fundo escuro

Para o Grupo Mariano, aplicar o mesmo padrão tipográfico.

---

## Paleta de Cores

| Cor             | Hex       | Uso                                      |
|-----------------|-----------|------------------------------------------|
| Bordô / Vinho   | `#6B2D3E` | Cor principal — títulos, botões, acentos  |
| Vinho profundo  | `#4A1E2B` | Header, footer, hover de botão principal |
| Vinho médio     | `#8C4A5A` | Bordas ativas, hover, foco de inputs     |
| Vinho claro     | `#C48B9A` | Detalhes decorativos, bordas de avatar   |
| Vinho suave     | `#D4A0AD` | Badges, tags, acentos sutis              |
| Rosa fundo      | `#F8F0F2` | Fundos de seção, image break, cards      |
| Dourado         | `#C4A97D` | Acentos especiais (usar com moderação)   |
| Branco          | `#FFFFFF` | Fundo principal, texto sobre escuro      |
| Cinza claro     | `#F9F9F9` | Hover de elementos, fundos alternativos  |
| Cinza bordas    | `#E8E8E8` | Bordas de inputs, divisores              |
| Cinza texto     | `#6B6B6B` | Textos secundários, legendas             |
| Texto principal | `#2D2D2D` | Corpo de texto, títulos menores          |

**Direção geral:** paleta de vinho/bordô, premium e clean. Evitar cores vibrantes ou neon. O vermelho das roupas da Juliana nas fotos complementa naturalmente a paleta.

---

## Tipografia

| Função       | Fonte            | Pesos       | Fallback              |
|--------------|------------------|-------------|-----------------------|
| Display      | Playfair Display | 400–700     | Georgia, serif        |
| Corpo        | Inter            | 300–600     | -apple-system, sans   |

**Hierarquia:**
- H1: Playfair Display, 30px, peso 500
- H2: Playfair Display, 22px, peso 500
- H3: Inter, 14px, peso 600, uppercase, letter-spacing 0.5px
- Body: Inter, 15px, peso 400
- Small/Caption: Inter, 13px, peso 400, cor cinza (#6B6B6B)

---

## Estilo Visual

- **Clean e premium** — bastante espaço em branco, poucos elementos por tela
- **Bordas finas** (1–1.5px) em cinza claro, border-radius 6–8px
- **Sombras:** evitar. Usar bordas e fundos sutis pra criar hierarquia
- **Botão primário:** fundo bordô (#6B2D3E), texto branco, radius 6px, padding generoso
- **Botão secundário:** borda cinza, fundo branco, texto cinza. Hover em vinho
- **Inputs:** borda fina cinza, sem sombra, foco com borda vinho médio e box-shadow sutil
- **Animações:** transições suaves (0.2–0.3s ease), sem efeitos chamativos

---

## Fotos

Arquivos organizados em `fotos/`:

| Arquivo                              | Descrição                                    | Uso recomendado                       |
|--------------------------------------|----------------------------------------------|---------------------------------------|
| `juliana-retrato-janela.jpeg`        | Retrato sorrindo, blazer vermelho, janela    | Hero de site, sobre, redes sociais    |
| `juliana-escritorio-pensativa.jpeg`  | Escritório, mão no queixo, pensativa         | Seções de autoridade, depoimento      |
| `juliana-escritorio-confiante.jpeg`  | Escritório, recostada, expressão confiante   | Seções de serviço, landing page       |
| `juliana-escritorio-gesticulando.jpeg`| Escritório, gesticulando, explicando         | Seções de processo, como funciona     |
| `juliana-selfie-close.jpeg`         | Selfie close up, roupa preta, casual         | Perfil de redes sociais, foto pessoal |

**Orientação de uso:** as fotos de escritório (blazer vermelho) passam autoridade e combinam com a paleta bordô. A selfie close up é mais pessoal, boa pra redes e avatares. Manter consistência — não misturar as duas vibes no mesmo material.

---

## CSS Variables (referência rápida)

```css
:root {
  --wine: #6B2D3E;
  --wine-deep: #4A1E2B;
  --wine-medium: #8C4A5A;
  --wine-light: #C48B9A;
  --wine-soft: #D4A0AD;
  --wine-bg: #F8F0F2;
  --gold: #C4A97D;
  --white: #FFFFFF;
  --gray-100: #F9F9F9;
  --gray-200: #E8E8E8;
  --gray-400: #B0B0B0;
  --gray-600: #6B6B6B;
  --text: #2D2D2D;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
}
```
