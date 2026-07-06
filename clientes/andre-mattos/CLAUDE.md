# André Mattos

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** André Mattos (nome completo: André Luiz Rapchan Mattos)
- **CPF:** 097.498.137-07
- **Segmento:** Odontologia — consultório odontológico próprio. Especializando em Cirurgia Facial e Bucomaxilofacial. Também atua com Implantes, Prótese e Facetas em resina
- **Contato principal:** André Luiz Rapchan Mattos (dentista, dono do consultório)
- **Início do trabalho:** 2026-07-02

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [ ] Site / blog / SaaS / aplicativo
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [x] Conteúdo / redes sociais — 3 posts/semana + roteiros e dicas para stories/reels

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [xxx]
- Meta Ads — Ad Account ID: [xxx]
- Instagram: @dr_andremattoss
- Outros: [xxx]

Credenciais (login/senha) ficam em `Acessos.md` (fora do Git), não aqui.

## Tom de voz deste cliente

Por padrão segue `_contexto/preferencias.md` do sistema principal. Se esse cliente exigir um tom diferente (mais formal, mais técnico, sem gírias etc.), descrever aqui:

[a definir — se não houver exceção, deixar "segue o padrão do sistema"]

## Identidade visual

Se o cliente tiver marca própria (logo, cores, fontes), guardar em `marca/` dentro dessa pasta e referenciar aqui. Caso contrário, tarefas visuais (proposta, carrossel, landing page) seguem `marca/design-guide.md` do sistema principal.

## Tarefas

Tarefas desse cliente ficam em [../../tarefas/andre-mattos.md](../../tarefas/andre-mattos.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

Registrar aqui decisões importantes de estratégia, mudanças de direção, ou aprendizados específicos desse cliente que não estão no briefing (ex: "testamos X em [mês/ano] e não funcionou porque Y").

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
