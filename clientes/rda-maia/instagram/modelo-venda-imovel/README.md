# Modelos — Posts de Venda de Imóvel (Rdamaia)

Dois modelos/templates de post único, no padrão visual do Rdamaia (preto/branco/dourado, mesma fonte e estilo dos posts do Blumenau Hill Residence).

## 1. `post-modelo.html` — Venda com preço

Foto principal + selo + preço riscado + preço novo + endereço + grade de 3 fotos. Baseado no formato que o Mateus já usava antes, redesenhado na identidade visual atual.

## 2. `post-modelo-prelancamento.html` — Teaser de pré-lançamento

Fundo escurecido (foto da portaria do Blumenau Hill Residence) + logo em dourado (`assets/logo-dourado.png`, gerada via script Python/PIL a partir da logo transparente) + "ATENÇÃO / PRÉ-LANÇAMENTO" + textos de chamada + telefones com ícone de WhatsApp. Baseado numa referência que o cliente mandou, adaptado com o fundo do Blumenau Hill Residence.

## Como reutilizar pra um imóvel novo

1. Duplique a pasta `modelo-venda-imovel/` com o nome do imóvel/endereço.
2. Troque as imagens em `assets/`: `hero.jpg` (foto principal, fachada) e `grid-1.jpg`, `grid-2.jpg`, `grid-3.jpg` (fotos internas/externas).
3. Edite no `post-modelo.html`: headline, preço antigo/novo, telefone, endereço e validade da condição.
4. Renderize com Playwright (mesmo processo dos outros posts) pra gerar o PNG final em 1080x1350.

**Nota:** as fotos usadas aqui (portaria, terrenos, piscina, floresta) são só placeholder do Blumenau Hill Residence, pra mostrar o layout funcionando. Preço, telefone e endereço vieram de um post antigo do Mateus, usados como exemplo. Trocar tudo pelos dados reais do imóvel antes de publicar.
