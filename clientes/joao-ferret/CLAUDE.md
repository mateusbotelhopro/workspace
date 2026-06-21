# João Ferret

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do Kortex OS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** João Ferret (ecossistema com 3 frentes — ver abaixo)
- **Segmento:** Captação e gestão de contratos previdenciários (BPC, Auxílio-Doença/Boas, Salário Maternidade) pra escritórios de advocacia
- **Contato principal:** [a definir]
- **Início do trabalho:** 2026-06-21

### As 3 frentes

- **João Ferret** — capta e entrega contratos previdenciários fechados pra advogados (média 10/20/30 contratos por pacote)
- **Elo Jurídico** — versão premium do João Ferret (mesmo serviço, reposicionamento em andamento)
- **Benefícios na Mão** — canal de captação do cliente final que quer BPC/Auxílio/Salário Maternidade
- **Advogaja** — sistema/SaaS onde o advogado acessa o contrato fechado com as informações do cliente

Fluxo: cliente final entra pela Benefícios na Mão → fecha com advogado via Elo Jurídico/João Ferret → contrato passado pro advogado via Advogaja.

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [x] Tráfego pago — Meta Ads (campanha atual pausada, em revisão)
- [ ] Tráfego pago — Google Ads
- [x] Marketing / estrutura comercial — organização de processos de captação e entrega (NÃO inclui o comercial de fechamento da Elo Jurídico/João Ferret — isso é com o time interno deles: closer/SDR)
- [ ] Site / blog / SaaS / aplicativo
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [xxx]
- Meta Ads — Ad Account ID: [xxx]
- Instagram/Facebook Page: [xxx]
- Google Sheets — fonte atual dos leads do formulário: [link a definir]
- Outros: [xxx]

## Equipe da operação (cliente)

- Closer
- SDR
- Social media
- Comercial

## Tom de voz deste cliente

Segue o padrão do sistema principal (`_contexto/preferencias.md`).

## Identidade visual

[a definir — aguardando arquivos/materiais existentes do cliente]

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](tarefas.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

- 2026-06-21: Onboarding inicial. Escopo definido: tráfego pago, exportar/importar leads pro sistema (hoje Google Sheets), organizar clientes/arquivos/contratos, organizar processos de captação. Fora do escopo: comercial de fechamento da Elo Jurídico/João Ferret.
- Aguardando recebimento de arquivos de campanhas e sites já existentes pra integrar nessa pasta.

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
- O comercial de fechamento (closer/SDR) da Elo Jurídico/João Ferret está fora do escopo de atuação — não propor mudanças nesse processo, só na captação/tráfego/organização de arquivos.
