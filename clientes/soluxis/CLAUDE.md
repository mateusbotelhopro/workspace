# Soluxis

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Soluxis
- **Segmento:** engenharia de energia solar fotovoltaica (EPC, O&M e comissionamento de usinas) — B2B, geração distribuída
- **Contato principal:** Eduardo Rodrigues (via WhatsApp) — cargo a confirmar
- **Início do trabalho:** 2026-07-27

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [x] Site / blog / SaaS / aplicativo — redesign do site institucional (soluxis.com.br)
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Site institucional: soluxis.com.br
- Login/senha do site: ver `acessos.md` (gitignored, nunca commitar)
- Google Ads — Customer ID: [xxx]
- Meta Ads — Ad Account ID: [xxx]
- Instagram/Facebook Page: [xxx]

## Tom de voz deste cliente

Por padrão segue `_contexto/preferencias.md` do sistema principal. Site institucional B2B de engenharia — tom mais técnico/corporativo, sem gírias.

## Identidade visual

Cor principal em transição: de amarelo pra cinza claro, com detalhes em amarelo (a pedido do cliente, ver briefing). Referência de estilo institucional: bnengenharia.com.br.

## Conteúdo e relatórios

Lotes de conteúdo (roteiros de postagens, scripts) vão em `conteudo/` dentro dessa pasta — tanto o arquivo final quanto a nota de trabalho interna (contagem, distribuição, gap-analysis), separados da raiz do cliente. Relatórios de métricas/performance ficam soltos na raiz, nome kebab-case com data em `AAAA-MM` (ex: `relatorio-instagram-2026-07.html`).

## Tarefas

Tarefas desse cliente ficam em [tarefas/soluxis.md](../../tarefas/soluxis.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

- 2026-07-27: cliente entrou pelo pedido de redesign do site institucional (não é landing page — ver briefing pro escopo detalhado passado pelo Eduardo).

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
