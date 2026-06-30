# Antunes Martins Ferreira

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do Kortex OS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Antunes Martins Ferreira
- **Segmento:** Escritório de advocacia (trabalhista e previdenciário)
- **Contato principal:** [a definir]
- **Início do trabalho:** 22/06/2026

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [x] Tráfego pago — Google Ads (foco: trabalhista, rescisão indireta/reclamante)
- [x] Tráfego pago — Meta Ads (foco: previdenciário, BPC, captação via formulário)
- [ ] Marketing / estrutura comercial
- [x] Site / blog / SaaS / aplicativo (criação e ajustes de landing pages em WordPress)
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [xxx]
- Meta Ads — Ad Account ID: [xxx]
- Instagram/Facebook Page: [xxx]
- Hostinger — login: rhayane@martinsferreiraadv.com.br (senha em gerenciador de senhas, não aqui)
- Hotjar — login: rhayane@martinsferreiraadv.com.br (senha em gerenciador de senhas, não aqui)
- Outros: [xxx]

## Tom de voz deste cliente

Por padrão segue `_contexto/preferencias.md` do sistema principal. Se esse cliente exigir um tom diferente (mais formal, mais técnico, sem gírias etc.), descrever aqui:

[a definir — se não houver exceção, deixar "segue o padrão do sistema"]

## Identidade visual

Se o cliente tiver marca própria (logo, cores, fontes), guardar em `marca/` dentro dessa pasta e referenciar aqui. Caso contrário, tarefas visuais (proposta, carrossel, landing page) seguem `marca/design-guide.md` do sistema principal.

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](tarefas.md) (gerado a partir de `tarefas-modelo.md`). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Landing pages

- **Trabalhista:** https://antunesmartinsferreira.com.br/trabalhistarj/
- **Previdenciário:** [a definir]

## Criativos

- `criativos/meta-ads/` — 3 peças VPC LOAS (previdenciário): CAPS, benefícios INSS, benefício liberado

## Estratégia e histórico

- Foco geográfico: Rio de Janeiro, capital.
- Investimento inicial: R$350/semana em cada plataforma (Google e Meta).
- Prazo de validação: 7 dias a partir de 22/06/2026 pra avaliar se o público que chega é qualificado.
- Histórico do cliente: já fez tráfego antes sem resultado por falta de qualificação de lead (muito curioso, não problema de comercial). Prioridade da nossa estratégia é filtrar isso na campanha/formulário.
- A pessoa responsável do lado do cliente entende de Ads e prefere poucas palavras-chave, mas seguimos nossa própria estratégia de qualificação.
- Sem concorrentes de referência definidos — vamos testar com estudo próprio.

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
