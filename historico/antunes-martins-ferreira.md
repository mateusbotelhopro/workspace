# Histórico de Otimizações — Antunes Martins Ferreira

> Última atualização: 2026-07-03
> Total de ações: 2
> ✅ Confirmadas: 0 | ❌ Refutadas: 0 | ⏳ Pendentes: 2

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

**Status:** ⏳ Aguardando resultado — reavaliar junto com o fechamento dos 7 dias de validação

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

**Status:** ⏳ Aguardando resultado — reavaliar junto com o fechamento dos 7 dias de validação (a partir de 29/06, não 22/06 — campanha ficou sem veicular na primeira semana do contrato)

---
