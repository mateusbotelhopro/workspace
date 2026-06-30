# Fob Advogados

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do Kortex OS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Fob Advogados
- **Segmento:** Escritório de advocacia especializado em Direito Bancário (busca e apreensão de veículos, cobranças bancárias indevidas)
- **Contato principal:** [a definir]
- **Início do trabalho:** 2026-06-21

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [x] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [ ] Site / blog / SaaS / aplicativo
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

**Escopo do trabalho:** somente campanhas de Google Ads com conversão no WhatsApp através da página https://fob.adv.br/direito-bancario/. Não inclui outros serviços por enquanto.

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: 463-298-8258
- Meta Ads — Ad Account ID: não aplicável
- Instagram/Facebook Page: não aplicável
- Outros: [a definir]

## Tom de voz deste cliente

[a definir — segue o padrão do sistema por enquanto]

## Identidade visual

Sem marca própria cadastrada ainda. Tarefas visuais seguem `marca/design-guide.md` do sistema principal, se necessário.

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](tarefas.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Nomenclatura da conta Google Ads

**Campanha:** `[SEARCH] [SP] Direito Bancário` (ID: 23844033245)

**Ad Groups ativos:**
- `01 - Busca e Apreensão` (ID: 199533356827) — melhor performer, CPConv ~R$27
- `02 - Juros Abusivos` (ID: 198101464684) — CPConv ~R$83

**Ad Groups inativos:**
- Cobrança Indevida (pausado 2026-06-23, zero performance)
- Golpe/Pix/Transação (removido)

## Estratégia e histórico

**Otimização 2026-06-23:**
- Pausado ad groups sem performance (Cobrança Indevida, Golpe/Pix)
- 8 negativas adicionadas: consulta, consultar, como saber, o que causa, o que é, ver se, significado, quanto tempo
- Ajuste dispositivo: Mobile +20%, Desktop -30%
- Programação: desligado 0h-6h, lance -50% em 12-14h
- Renomeado campanha e ad groups pro padrão `[TIPO] [GEO]` / `NN - Nome`
- Pendente: cliente precisa melhorar landing page (prova social, FAQ, PageSpeed, schema markup)
- Revisão de performance prevista para ~01/07/2026

---

## Contexto do sistema principal

Essa pasta vive dentro do Kortex OS (`c:\Users\mateu\Desktop\Kortex OS`). Se for aberta como workspace separado, esses arquivos do sistema principal continuam valendo e devem ser lidos quando relevante:

- `../../_contexto/empresa.md` — quem presta o serviço, como o negócio funciona
- `../../_contexto/preferencias.md` — tom de voz e estilo padrão (a menos que sobrescrito acima)
- `../../_contexto/estrategia.md` — foco atual e prioridades do negócio como um todo
- `../../marca/design-guide.md` — identidade visual padrão pra tarefas visuais
- `../../templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis (Google Ads, Meta Ads, WhatsApp, N8N etc.)

Se esses caminhos não existirem (pasta movida ou copiada pra fora do Kortex OS), ignorar e trabalhar só com o que está documentado aqui e em `briefing.md`.

## Regras

- Skills disponíveis em `.claude/skills/` ou `.claude/commands/` do sistema principal continuam valendo mesmo abrindo essa pasta separada, contanto que a estrutura de pastas relativa seja preservada.
- Não inventar dados de conta, métrica ou histórico — perguntar ou deixar `[a definir]`.
- Atualizar este arquivo quando houver mudança de serviço contratado, conta conectada ou direção estratégica relevante.
