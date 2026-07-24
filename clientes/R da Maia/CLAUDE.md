# R da Maia Construtora & Imobiliária

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** R da Maia Construtora & Imobiliária
- **Segmento:** Imobiliária completa (residencial, comercial, aluguel) — apartamentos, casas, terrenos, lojas, galpões, pontos comerciais, sítios e chácaras. Região de Blumenau/SC e litoral vizinho (Itapema, Penha, Porto Belo, Bombinhas, Balneário Camboriú). CRECI 06676 J.
- **Contato principal:** [a definir]
- **Início do trabalho:** 2026-07-01

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [ ] Site / blog / SaaS / aplicativo
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [x] Conteúdo / redes sociais — posts estáticos e carrossel

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [xxx]
- Meta Ads — Ad Account ID: [xxx]
- Instagram/Facebook Page: [xxx]
- Site: rdamaia.com.br
- Telefones de contato: (47) 98864-8604 e (47) 99600-6227
- Outros: [xxx]

## Tom de voz deste cliente

Por padrão segue `_contexto/preferencias.md` do sistema principal. Se esse cliente exigir um tom diferente (mais formal, mais técnico, sem gírias etc.), descrever aqui:

[a definir — se não houver exceção, deixar "segue o padrão do sistema"]

## Identidade visual

Marca própria, arquivos em [marca/](marca/):
- `rda-maia-logo-positivo.png` — logo (assinatura + wordmark "rdamaia") em preto sobre fundo claro
- `rda-maia-logo-negativo.png` — mesma logo em branco sobre fundo preto

**Paleta:** preto/branco (contraste principal) + dourado/bege (detalhe no "da" do wordmark)
**Estilo da marca:** assinatura em pincelada (brush stroke) acima do wordmark, tipografia sans-serif fina e minimalista — visual sofisticado/alto padrão, condizente com imobiliária.

Tarefas visuais (posts, carrossel, proposta) devem usar essas logos e paleta como referência.

## Tarefas

Tarefas desse cliente ficam em `tarefas/rda-maia.md` (na raiz do BotelhoOS). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

Registrar aqui decisões importantes de estratégia, mudanças de direção, ou aprendizados específicos desse cliente que não estão no briefing (ex: "testamos X em [mês/ano] e não funcionou porque Y").

- 2026-07-01: início do trabalho com foco em social media — construir os primeiros posts (estáticos e carrossel) já, como prioridade.

---

## Contexto do sistema principal

Essa pasta vive dentro do BotelhoOS (`c:\Users\mateu\Desktop\BotelhoOS`). Se for aberta como workspace separado, esses arquivos do sistema principal continuam valendo e devem ser lidos quando relevante:

- `../../_contexto/empresa.md` — quem presta o serviço, como o negócio funciona
- `../../_contexto/preferencias.md` — tom de voz e estilo padrão (a menos que sobrescrito acima)
- `../../_contexto/estrategia.md` — foco atual e prioridades do negócio como um todo
- `../../marca/design-guide.md` — identidade visual padrão pra tarefas visuais
- `../../templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis (Google Ads, Meta Ads, WhatsApp, N8N etc.)

Se esses caminhos não existirem (pasta movida ou copiada pra fora do BotelhoOS), ignorar e trabalhar só com o que está documentado aqui e em `briefing.md`.

## Regras

- Skills disponíveis em `.claude/skills/` ou `.claude/commands/` do sistema principal continuam valendo mesmo abrindo essa pasta separada, contanto que a estrutura de pastas relativa seja preservada.
- Não inventar dados de conta, métrica ou histórico — perguntar ou deixar `[a definir]`.
- Atualizar este arquivo quando houver mudança de serviço contratado, conta conectada ou direção estratégica relevante.
