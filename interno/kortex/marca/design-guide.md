# Kortex — Design Guide

## Logotipo

### Versões disponíveis

| Arquivo | Uso | Descrição |
|---------|-----|-----------|
| `kortex-logo-completo.svg` | Principal | Símbolo + wordmark "KORTEX" — usar sempre que tiver espaço |
| `kortex-wordmark.svg` | Alternativo | Só o nome "KORTEX" sem o símbolo — usar quando o espaço for limitado ou o símbolo já aparecer separado |
| `kortex-simbolo.svg` | Ícone isolado | Só o símbolo (sem fundo) — redes sociais, ícone de app, marca d'água |
| `kortex-favicon.svg` | Favicon | Símbolo com fundo escuro e cantos arredondados — favicon, thumbnail |

### Regras de uso

- Logo completo é a versão preferencial
- Wordmark sozinho só quando o símbolo já está presente no contexto
- Símbolo sozinho nunca substitui o logo — é complementar
- Área de respiro mínima: altura do símbolo ao redor de todas as bordas

## Cores

### Paleta principal

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde Kortex | `#7DFF00` | Cor primária — destaques, CTAs, acentos, símbolo |
| Preto Kortex | `#171717` | Fundo principal, texto sobre fundo claro, wordmark |

### Paleta de apoio

| Cor | Hex | Uso |
|-----|-----|-----|
| Branco | `#FFFFFF` | Texto sobre fundo escuro, fundos claros |
| Cinza claro | `#F5F5F5` | Fundos secundários, cards |
| Cinza médio | `#A3A3A3` | Texto secundário, labels |
| Cinza escuro | `#404040` | Texto corpo sobre fundo claro |

### Regras de cor

- **Fundo escuro** (#171717) é o padrão — marca dark-first
- Verde (#7DFF00) nunca como fundo de área grande — só destaques, botões, acentos
- Texto sobre fundo escuro: branco ou verde
- Texto sobre fundo claro: #171717 ou #404040
- O acento verde no "X" do wordmark é parte da identidade — manter nas aplicações

## Tipografia

### Hierarquia

| Nível | Uso | Estilo |
|-------|-----|--------|
| Display | Títulos hero, headlines | Sans-serif geométrica, bold/black, caixa alta |
| Heading | Subtítulos, nomes de seção | Sans-serif, semibold |
| Body | Texto corrido, descrições | Sans-serif, regular, 16-18px |
| Caption | Labels, notas, metadata | Sans-serif, regular/medium, 12-14px |

### Fontes sugeridas

- **Primária:** Inter, Satoshi, ou General Sans (clean, geométrica, moderna)
- **Alternativa web-safe:** system-ui, -apple-system, sans-serif

### Regras de tipografia

- Caixa alta para títulos curtos e CTAs
- Caixa normal (sentence case) para texto corrido
- Nunca usar serif — a marca é técnica, não editorial
- Espaçamento entre letras (tracking) positivo em caixa alta: +2% a +5%

## Tom visual

### Direção

- **Dark-first** — fundo escuro como padrão
- **Contraste alto** — verde neon sobre preto cria impacto
- **Limpo e técnico** — sem ornamento, sem gradiente decorativo
- **Espaço** — margens generosas, não encher a tela

### O que fazer

- Usar o contraste verde/preto como assinatura visual
- Manter layouts limpos com bastante respiro
- Fotos e imagens com overlay escuro quando necessário
- Ícones lineares (outline), não preenchidos
- Bordas sutis (1px, rgba branco baixa opacidade) para separar elementos

### O que NÃO fazer

- Gradientes coloridos ou multicoloridos
- Sombras pesadas (drop shadow exagerado)
- Fundos claros como padrão (claro só quando necessário)
- Ilustrações cartoon ou clipart
- Tipografia decorativa, script, ou handwritten

## Aplicações

### Site

- Fundo: #171717
- Header: logo completo, nav com links brancos, CTA verde
- Seções: alternar entre #171717 e #0D0D0D (mais escuro) para criar profundidade
- Botões primários: fundo #7DFF00, texto #171717
- Botões secundários: borda #7DFF00, fundo transparente, texto #7DFF00
- Cards: fundo #222222 ou rgba(255,255,255,0.05), borda sutil

### Redes sociais

- Posts: fundo #171717, texto branco, destaques em #7DFF00
- Avatar/perfil: usar kortex-simbolo.svg ou kortex-favicon.svg
- Stories/reels: manter a paleta escura, texto em caixa alta para headlines

### Propostas e documentos

- Capa: fundo #171717, logo branco, acento verde
- Páginas internas: fundo branco, texto #171717, destaques em #7DFF00
- Headers de seção: barra verde lateral ou underline verde

### Apresentações

- Slides: fundo #171717
- Títulos: branco, caixa alta
- Dados/números: verde #7DFF00
- Texto corpo: branco ou cinza claro
