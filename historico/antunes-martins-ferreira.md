# Histórico de Otimizações — Antunes Martins Ferreira

> Última atualização: 2026-07-21
> Total de ações: 3
> ✅ Confirmadas: 1 | ❌ Refutadas: 1 | ⏳ Pendentes: 1

---

## Padrões identificados

1. **PHRASE match em termos de tema jurídico genérico** ("rescisão indireta", "escritório advocacia trabalhista rio de janeiro") atrai uma cauda longa de busca informacional/pesquisa de artigo da CLT — bom pra ganhar volume/impressão, ruim pra CPA. Nessa conta, migrar pra EXACT depois que o termo já validou que converte é mais seguro que deixar em PHRASE indefinidamente.
2. **Ad group "Verbas e Direitos Não Pagos"** (dores específicas: não recebi verbas, atraso no pagamento, FGTS) converte muito melhor (CPA ~R$16-18) que os ad groups de tema genérico ("Rescisão Indireta", CPA R$260+) — mesmo anúncio, mesma landing page. Termos de dor específica > termos de tema jurídico amplo nesse nicho.

---

### 2026-07-03 — Expandiu keywords em PHRASE match (Google Ads)

**Ação:** Adicionou 10 keywords novas em match PHRASE na campanha "[SEARCH] [RJ] Trabalhista" (customer 8646409603):
- Ad group "Rescisão Indireta" (id 196619468326): "rescisão indireta", "direito a rescisão indireta", "como pedir rescisão indireta", "rescisão indireta trabalhista"
- Ad group "Verbas e Direitos Não Pagos" (id 196598811734): "atraso no pagamento da rescisão", "não recebi os 40 do fgts", "pedi demissão e não me pagaram", "minha rescisão está atrasada", "rescisão não paga"
- Ad group "Advogado Trabalhista RJ" (id 197564586909): "advogado trabalhista rj whatsapp"

**Motivo:** Ad group "Rescisão Indireta" — o público-alvo #1 do briefing (reclamante de rescisão indireta) — estava com 0 impressão em 5 dias de veiculação porque as 3 keywords existentes eram todas EXACT/frase muito estreita ("advogado rescisão indireta", "rescisão indireta advogado"). Ad group "Verbas e Direitos Não Pagos" tinha buscas reais qualificadas aparecendo no relatório de termos de busca (ex: "não recebi os 40 do fgts", "pedi demissão e não me pagaram", "minha rescisão está atrasada o que fazer") mas com 0 clique porque nenhuma keyword em EXACT casava com essas variações. Tentei validar volume via Keyword Planner antes de decidir, mas a API retornou 0 buscas/mês pra tudo — inclusive pra "advogado trabalhista rio de janeiro", que sabidamente já converte na conta — então descartei o Keyword Planner como fonte pra essa conta e usei os termos de busca reais já capturados pela própria campanha, que são mais confiáveis.
**Hipótese:** Ad group Rescisão Indireta sai de 0 impressão pra volume mensurável; Verbas e Direitos Não Pagos passa a converter cliques nas buscas de dor que já apareciam nos termos de busca sem keyword correspondente. Não criei anúncio novo — o RSA atual já cobre as duas mensagens com headlines existentes ("Rescisão Indireta", "Seus Direitos Não Pagos?", "Recupere Suas Verbas").
**Métricas antes (5 dias de veiculação, 29/06–03/07):**
- Ad group Rescisão Indireta: 0 impressões, 0 cliques
- Ad group Verbas e Direitos Não Pagos: 236 impressões, 5 cliques, 1 conversão
- Ad group Advogado Trabalhista RJ: 648 impressões, 30 cliques, 1 conversão

**Métricas depois (avaliado em 2026-07-21, 30 dias 22/06–21/07):**
- Ad group Rescisão Indireta: 1497 impressões, 47 cliques, 1 conversão, custo R$260,84 → CPA R$260,84
- Ad group Verbas e Direitos Não Pagos: 757 impressões, 18 cliques, 6 conversões, custo R$98,70 → CPA R$16,45
- Ad group Advogado Trabalhista RJ: 1287 impressões, 57 cliques, 3 conversões, custo R$340,51 → CPA R$113,50
- Keyword "rescisão indireta" (PHRASE) sozinha: 39 cliques, 1 conversão, R$218 (31% do gasto da conta pra 1 lead), Quality Score 3
- Keyword "escritório advocacia trabalhista rio de janeiro" (PHRASE): 45 cliques, 1 conversão, R$268 (38% do gasto), sem QS suficiente pra medir

**Resultado:** ⚠️ Hipótese parcialmente confirmada — Ad group Rescisão Indireta realmente saiu de 0 impressão pra volume real, e Verbas e Direitos Não Pagos passou a converter muito bem (CPA R$16,45, melhor da conta). MAS o PHRASE match nas keywords de tema genérico ("rescisão indireta", "escritório advocacia...") trouxe volume às custas de CPA descontrolado — essas 2 keywords sozinhas consumiram 69% do gasto de 30 dias com só 2 conversões, puxando uma cauda de busca informacional (artigos da CLT, "o que é rescisão indireta", jusbrasil) confirmada no relatório de termos de busca.
**Aprendizado:** Ver "Padrões identificados" no topo do arquivo. Ação corretiva tomada em 2026-07-21 (ver entrada abaixo).

---

### 2026-07-03 — Negativou nomes de concorrentes (Google Ads)

**Ação:** Adicionou 4 negativas de campanha (match BROAD) na campanha "[SEARCH] [RJ] Trabalhista" (Google Ads, customer 8646409603): "solon tepedino", "sarruf advocacia", "robson caetano", "jorge lopes"
**Motivo:** Relatório de termos de busca dos últimos 5 dias (campanha só começou a veicular em 29/06/2026) mostrou cliques e impressões vindos de buscas pelo nome de outros escritórios de advocacia trabalhista no RJ (ex: "solon tepedino advogados caxias", "escritório solon tepedino" — R$7,19 gasto, 0 conversão). Esse é exatamente o tipo de tráfego curioso/não qualificado que o cliente pediu pra filtrar desde o início (histórico de campanhas anteriores com lead curioso demais). Já existia precedente: negativa "antonia ximenes advocacia trabalhista previdenciário rj comentários" adicionada antes desta ação (57 impr, R$6,64, 0 conversão).
**Hipótese:** Reduzir gasto desperdiçado em buscas de pesquisa de reputação de concorrente sem afetar volume de tráfego qualificado — deve liberar ~R$5-10/dia de budget pros termos certos
**Métricas antes (5 dias de veiculação, 29/06–03/07):**
- Gasto: R$240,11 total (~R$48/dia)
- Cliques: 36 | Impressões: 914 | CTR: 3,94%
- Conversões: 2 | CPA: ~R$120
- Search impression share: 54,26%
- Termos de concorrente identificados: "solon tepedino" (R$7,19, 0 conv), "antonia ximenes...comentários" (R$6,64, 0 conv, já negativado antes desta ação), "sarruf advocacia" e "robson caetano" (sem custo ainda, só impressão)

**Métricas depois (avaliado em 2026-07-21, 30 dias 22/06–21/07):**
- Gasto: R$700 total (~R$23/dia, bem abaixo do teto de R$50/dia)
- Cliques: 122 | Impressões: 3541 | CTR: 3,44%
- Conversões: 10 | CPA: R$70
- Search impression share: 45,5% (perda por Ad Rank, não por orçamento — sobrou budget)
- "solon tepedino" ainda apareceu no relatório de termos de busca com 1 clique/R$7,19 após a negativa — provavelmente clique anterior à aplicação da negativa (negativas só bloqueiam a partir do momento em que são criadas, não retroagem)

**Resultado:** ✅ Hipótese confirmada — não houve mais gasto novo em nomes de concorrentes já negativados no período avaliado. Mas apareceu vazamento NOVO não coberto por essa lista: "jb miranda advocacia trabalhista" (concorrente) e buscas fora do foco geográfico RJ capital (Duque de Caxias, São Gonçalo, Nilópolis, Niterói) — corrigido na ação de 2026-07-21 abaixo.
**Aprendizado:** Negativar concorrentes é um trabalho contínuo, não uma tarefa única — cada leitura do relatório de termos de busca tende a revelar 1-2 nomes novos de escritórios concorrentes.

---

### 2026-07-21 — Correção de PHRASE→EXACT, negativas de vazamento e pausa de keywords fracas (Google Ads)

**Ação:** Três mudanças na campanha "[SEARCH] [RJ] Trabalhista" (customer 8646409603):
1. Negativas de campanha novas (match BROAD): "jb miranda", "jusbrasil", "duque de caxias", "sao goncalo", "nilopolis", "niteroi"
2. Troca de match type PHRASE → EXACT (criada nova keyword EXACT + removida a PHRASE antiga): "rescisão indireta" (ad group Rescisão Indireta, id 196619468326) e "escritório advocacia trabalhista rio de janeiro" (ad group Advogado Trabalhista RJ, id 197564586909)
3. Pausadas (ENABLED → PAUSED) no ad group Rescisão Indireta: "direito a rescisão indireta" (QS 2, criterion 2371944790700) e "como pedir rescisão indireta" (QS 2, criterion 334176471080)
**Motivo:** Continuação direta do aprendizado da entrada de 2026-07-03 (expansão PHRASE) — essas 2 keywords em PHRASE consumiam 69% do gasto de 30 dias (R$486 de R$700) com só 2 das 10 conversões, puxando cauda de busca informacional (artigos da CLT, "o que é rescisão indireta", jusbrasil) e vazamento geográfico fora do foco RJ capital (Baixada Fluminense e Niterói). As 2 keywords pausadas tinham Quality Score 2 e zero conversão em R$42,65 gastos.
**Hipótese:** CPA da conta deve cair abaixo de R$70 (média atual) nos próximos dias, puxado principalmente pela redução de gasto desperdiçado no ad group Rescisão Indireta (CPA R$260,84 → deve cair pra perto do CPA do keyword EXACT "rescisão indireta" sozinho, que hoje é melhor que a média do PHRASE por não pegar a cauda informacional). Impression share não deve cair, já que a conta está gastando bem abaixo do teto diário.
**Métricas antes (30 dias, 22/06–21/07):**
- Conta: R$700 gasto, 122 cliques, 10 conversões, CPA R$70, impression share 45,5%
- Ad group Rescisão Indireta: 47 cliques, 1 conversão, R$260,84, CPA R$260,84
- Ad group Verbas e Direitos Não Pagos: 18 cliques, 6 conversões, R$98,70, CPA R$16,45
- Ad group Advogado Trabalhista RJ: 57 cliques, 3 conversões, R$340,51, CPA R$113,50

**Status:** ⏳ Aguardando resultado — reavaliar a partir de 2026-07-28 (mínimo 7 dias)

---
