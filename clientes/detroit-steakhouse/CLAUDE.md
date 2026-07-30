# Detroit Steakhouse

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Detroit SteakHouse (marca/franqueadora, parte do GreatTime Group)
- **Segmento:** Steakhouse estilo americano em modelo de franquia — captação de franqueados
- **Contato principal:** [a definir]
- **Início do trabalho:** 2026-07-30

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [ ] Site / blog / SaaS / aplicativo
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [a definir]
- Meta Ads — Ad Account ID: [a definir]
- Instagram/Facebook Page: [a definir]
- Outros: site https://detroitsteakhouse.com.br/, telefone +55 11 94546-0049

## Tom de voz deste cliente

Por padrão segue `_contexto/preferencias.md` do sistema principal.

[a definir — se não houver exceção, deixar "segue o padrão do sistema"]

## Identidade visual

Se o cliente tiver marca própria (logo, cores, fontes), guardar em `marca/` dentro dessa pasta e referenciar aqui. Caso contrário, tarefas visuais (proposta, carrossel, landing page) seguem `marca/design-guide.md` do sistema principal.

## Conteúdo e relatórios

Lotes de conteúdo (roteiros de postagens, scripts) vão em `conteudo/` dentro dessa pasta — tanto o arquivo final quanto a nota de trabalho interna (contagem, distribuição, gap-analysis), separados da raiz do cliente. Relatórios de métricas/performance ficam soltos na raiz, nome kebab-case com data em `AAAA-MM` (ex: `relatorio-instagram-2026-07.html`).

## Tarefas

Tarefas desse cliente ficam em [tarefas/detroit-steakhouse.md](../../tarefas/detroit-steakhouse.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

- 2026-07-30: cliente entrou, objetivo inicial é vender mais franquias.

[a definir]

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
