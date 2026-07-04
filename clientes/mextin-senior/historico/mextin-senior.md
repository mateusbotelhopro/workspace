# Histórico de Otimizações — Mextin Sênior

> Última atualização: 2026-07-03
> Total de ações: 1
> ✅ Confirmadas: 0 | ❌ Refutadas: 0 | ⏳ Pendentes: 1

---

### 2026-07-03 — Negativas geográficas pra estancar vazamento de broad match

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
