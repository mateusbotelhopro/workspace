# Histórico de Otimizações — Mextin Sênior

> Última atualização: 2026-07-21
> Total de ações: 2
> ✅ Confirmadas: 0 | ⚠️ Mistas: 1 | ❌ Refutadas: 0 | ⏳ Pendentes: 1

---

### 2026-07-21 — Novas negativas + pausa do broad "residencial para idosos" e keyword phrase substituta

**Ação:** Na campanha "[SEARCH] [SP] Residencial Geriatrico" (Customer ID 682-001-8995):
1. Adicionadas 4 negativas de campanha: "abrigo" (broad), "condominio" (broad), "apartamento para idosos" (phrase), "apto para idosos" (phrase)
2. Pausada a keyword `residencial para idosos` (BROAD, QS 3, ID 370207420) no ad group "Residencial Geral"
3. Criada a keyword `residencial para idosos em limeira` (PHRASE) no mesmo ad group, como substituta de maior intenção

**Motivo:** A keyword broad "residencial para idosos" sozinha respondia por 49% do gasto da conta (R$586 de R$1.193 em 30 dias) com Quality Score 3 (post-click e CTR previstos BELOW_AVERAGE) — o pior desempenho relativo da conta considerando o volume. A extensa lista de negativas já existente (cidades fora da área + termos de emprego/carreira) era evidência de que esse broad seguia trazendo tráfego disperso mesmo após a limpeza geográfica de 03/07. Termos como "abrigo de idosos" e "apartamento/apto para idosos" apareciam nas buscas recentes sem conversão (perfil de moradia diferente do produto: assistência 24h paga, não abrigo gratuito nem apartamento independente).

**Hipótese:** Pausar o broad de baixo QS e concentrar o tráfego nas keywords phrase (que têm QS 4-7) deve reduzir o CPC médio e o CPA da conta nas próximas semanas, mesmo que o volume de cliques caia no curto prazo.

**Métricas antes (30 dias, 2026-07-21):**
- Impressões: 5.196
- Cliques: 270
- Conversões: 17
- Gasto: R$ 1.193,43
- CPA: R$ 70,20
- CTR: 5,2%
- CPC médio: R$ 4,42
- Impression share (busca): 18,6%
- Keyword "residencial para idosos" (broad): 159 cliques, R$ 586 (49% do gasto), QS 3

**Status:** ⏳ Aguardando resultado (avaliar a partir de 2026-07-28)

---

### 2026-07-03 — Negativas geográficas pra estancar vazamento de broad match

**Avaliação (2026-07-21):** Resultado misto — impression share, CTR e conversões melhoraram bem acima do esperado, mas o CPC médio quase dobrou e o CPA piorou em vez de cair.

**Métricas depois (30 dias, avaliado em 2026-07-21):**
- Impressões: 5.196 (↑71%)
- Cliques: 270 (↑120%)
- Conversões: 17 (↑183%)
- Gasto: R$ 1.193,43 (janela de 30 dias mudou de período, não comparável 1:1)
- CPA: R$ 70,20 (↑37% — hipótese de queda **refutada**)
- CTR: 5,2% (↑28% — confirmado)
- CPC médio: R$ 4,42 (↑77% — pior que o esperado)
- Impression share (busca): 18,6% (↑43% — confirmado, ganhou mais espaço)

**Resultado:** ⚠️ Misto — a limpeza geográfica funcionou pro que se propunha (mais impression share, mais CTR, muito mais conversões em volume absoluto), mas o CPC subiu mais que proporcionalmente e empurrou o CPA pra cima. Prováveis causas: menos cliques "baratos" de tráfego disperso (que inflavam volume mas não convertiam) e mais competição pelas buscas locais de maior intenção.
**Aprendizado:** Negativar tráfego disperso aumenta a qualidade do tráfego restante (mais conversões, mais CTR) mas não necessariamente barateia o CPC — o cliques que sobram são de leilão mais concorrido. Continuar monitorando post-click QS (ainda BELOW_AVERAGE em 100% das keywords) como próxima alavanca, já que a landing page parece ser o gargalo real do CPA, não a segmentação de busca.

**Ação:** Adicionadas 27 negativas de nível de campanha (match phrase) na campanha "[SEARCH] [SP] Residencial Geriatrico" (Customer ID 682-001-8995): Salvador, Pituba, Queimados, Sepetiba, Volta Redonda, Niterói, Angra dos Reis, Casimiro de Abreu, Maringá, Medianeira, Ouro Fino, Uberaba, Campo Grande, Belém, Goiânia, Manaus, São Luís, João Pessoa, São Bernardo do Campo, Nova Iguaçu, Cariacica, Rio Preto, Botucatu, Jaú, Franca, São João da Boa Vista, Araraquara.

**Motivo:** Cliente reportou 3-4 dias sem conversão (0 conversões em 30/06, 01/07 e 02/07). Investigação mostrou queda de ~80% em impressões/cliques a partir de 30/06 e os termos de busca revelaram que a keyword broad match "residencial para idosos" estava captando buscas de todo o Brasil (Salvador, Manaus, Volta Redonda, Maringá, etc.), mesmo com a segmentação geográfica correta (Limeira + Cordeirópolis + Iracemápolis + Santa Bárbara d'Oeste + Engenheiro Coelho, tipo PRESENCE) — o vazamento vinha de pessoas fisicamente nessas 5 cidades pesquisando sobre outras localidades, não de erro de configuração de local.

**Hipótese:** Reduzir o desperdício de impressões/cliques em buscas fora da área de atuação deve concentrar mais do impression share (hoje 13%) e do orçamento (R$50/dia) em buscas locais com chance real de conversão, aumentando a taxa de conversão geral e reduzindo o CPL.

**Métricas antes (30 dias):**
- Impressões: 3.033
- Cliques: 123
- Conversões: 6
- Gasto: R$ 306,45
- CPL: R$ 51,08
- CTR: 4,06%
- CPC médio: R$ 2,49
- Impression share (busca): 13,0%

**Outras descobertas (sem ação necessária):**
- Segmentação geográfica e extensões (4 callouts + 3 sitelinks) já estavam bem configuradas.
- 3 keywords locais (`residencial para idosos limeira`, `casa geriatrica em limeira`, `casa para idosos em limeira`) estão com `system_serving_status: RARELY_SERVED` — baixo volume de busca real em Limeira, não é erro de configuração.
- `post_click_quality_score` está BELOW_AVERAGE em 100% das keywords com dado suficiente, enquanto `creative_quality_score` está AVERAGE/ABOVE_AVERAGE — indica que a página de destino (mextinresidencialsenior.com.br), não os anúncios, é o maior gargalo do Quality Score. 96% do tráfego é mobile, então a experiência mobile da página é o ponto mais provável a revisar.

**Status:** ⏳ Aguardando resultado (avaliar a partir de 2026-07-10)
