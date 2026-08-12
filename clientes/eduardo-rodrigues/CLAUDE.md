# Eduardo Rodrigues

> Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Eduardo Rodrigues
- **Segmento:** [a definir]
- **Contato principal:** Eduardo Rodrigues
- **Início do trabalho:** 2026-08-06

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [x] Site / blog / SaaS / aplicativo — landing page de captação de leads
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [xxx]
- Meta Ads — Ad Account ID: [xxx]
- Instagram/Facebook Page: [xxx]
- **Hostinger** (hospedagem da landing page) — login: `midiafoxcontato@gmail.com` — senha: `@Rodrigues001` ou `@Rodrigues002`
  - ⚠️ Repositório `workspace` no GitHub é público — essa credencial fica exposta publicamente ao sincronizar. Salvo aqui por decisão explícita do Mateus em 2026-08-06.
- **Google Drive** (fotos para a LP): https://drive.google.com/drive/folders/1N34xFSrHZJKI434y7xIQ8zWFn-k4swiR
- Outros: [xxx]

## Tom de voz deste cliente

Por padrão segue `_contexto/preferencias.md` do sistema principal. Se esse cliente exigir um tom diferente (mais formal, mais técnico, sem gírias etc.), descrever aqui:

[a definir — se não houver exceção, deixar "segue o padrão do sistema"]

## Identidade visual

Se o cliente tiver marca própria (logo, cores, fontes), guardar em `marca/` dentro dessa pasta e referenciar aqui. Caso contrário, tarefas visuais (proposta, carrossel, landing page) seguem `marca/design-guide.md` do sistema principal.

## Conteúdo e relatórios

Lotes de conteúdo (roteiros de postagens, scripts) vão em `conteudo/` dentro dessa pasta — tanto o arquivo final quanto a nota de trabalho interna (contagem, distribuição, gap-analysis), separados da raiz do cliente. Relatórios de métricas/performance ficam soltos na raiz, nome kebab-case com data em `AAAA-MM` (ex: `relatorio-instagram-2026-07.html`).

## Tarefas

Tarefas desse cliente ficam em [tarefas/eduardo-rodrigues.md](../../tarefas/eduardo-rodrigues.md) (gerado a partir de `tarefas-modelo.md`). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

Registrar aqui decisões importantes de estratégia, mudanças de direção, ou aprendizados específicos desse cliente que não estão no briefing (ex: "testamos X em [mês/ano] e não funcionou porque Y").

Ambiente parceiro — onboarding padrão não rodado. Briefing montado a partir dos arquivos enviados pelo Eduardo (Blueprint do funil, Organograma, VSL).

**2026-08-06 — LP01 (primeira versão):** montada em `landing-page/index.html`, seguindo o padrão técnico do workspace (HTML estático, CSS inline, sem framework — mesmo padrão de `clientes/juliana-do-trafego/site-captacao/`). Estrutura adaptada do modelo metodofas.com.br: hero → identificação → quebra de crença → 4 pilares → método (8 módulos) → público-alvo → credibilidade do Eduardo → prova de "liberdade" (fotos de viagem) → formulário de captação → FAQ → CTA final. Fotos do Drive processadas em `landing-page/fotos/` (HEIC convertido pra JPG, redimensionado pra web). Pendências antes de publicar: WhatsApp real, backend do formulário — ver `tarefas/eduardo-rodrigues.md`.

**2026-08-09 — domínio, paleta e fluxo de conversão:** domínio definitivo definido como `lp.metodofas.com.br` (ainda não resolve DNS — confirmar apontamento antes do deploy na Hostinger). Paleta trocada de dourado (`#D9A34A`) pra azul (`#3E7BFA`/`#7BAAFF`) a pedido do Eduardo — cor de acento inteira (CTA, ícones, eyebrow, hover) usa azul agora, não só um detalhe secundário. Fluxo de conversão mudou: não é mais formulário de captação (nome/whatsapp/email) — os CTAs levam direto pra uma página de checkout externa, e depois do checkout tem outra página (obrigado/onboarding). A seção de lead-form foi removida e virou uma seção simples de CTA (`#checkout`) com botão único; todos os CTAs do site apontam pra `href="#"` até o Eduardo passar o link real do checkout.

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
