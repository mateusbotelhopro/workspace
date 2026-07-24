# Vellos

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Vellos (Vellos Leads — vellosleads.com.br)
- **Segmento:** BPO de SDR e prospecção B2B — agendamento de reuniões qualificadas com decisores via LinkedIn, e-mail e WhatsApp
- **CNPJ:** 67.975.430/0001-08 (Fortaleza/CE)
- **Contato principal:** [a definir]
- **Início do trabalho:** até 2026-07-24 era tratado como frente do cliente Dayane Tavares; virou cliente próprio nessa data

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [ ] Tráfego pago — Meta Ads
- [x] Marketing / estrutura comercial — propostas, contratos e apresentações comerciais
- [x] Site / blog / SaaS / aplicativo — site institucional (vellosleads.com.br)
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [x] Conteúdo / redes sociais — carrosséis e posts estáticos pro Instagram
- [x] Operacional / administrativo — gestão de contratos/distratos, propostas e organização de listas de prospecção

## Organização de arquivos

```text
clientes/Vellos/
  vellosleads.com.br/           — site institucional (landing, onboarding, blog, ferramentas, política/termos)
  Apresentação Comercial/       — apresentação institucional, pitch rápido e materiais de LinkedIn
  Proposta Comercial/           — propostas comerciais enviadas a prospects (ex: Neodiniz)
  Contratos/                    — contrato fechado por cliente da Vellos (ex: Ext Contabilidade)
  Minuta Contrato/               — minuta genérica de contrato, sem dados de cliente — base pra novos fechamentos
  Prospecção/                    — fluxo de listas de prospecção (A Processar/ → Processadas/), controle em planilha e script de processamento de CNPJ
  Conteúdo/                      — lotes de posts/carrosséis pro Instagram (Posts Estáticos/, Carrosséis/)
  Marca/                         — identidade visual (logo)
  arquivo-antigo/                — workspace antigo e independente do Vellos (era um Claude Code OS próprio, feito antes da consolidação dentro do BotelhoOS) — mantido só como referência histórica, não usar como fonte ativa
```

Nomes de pasta em Title Case com espaço (não kebab-case), seguindo o padrão já usado nas pastas do Vellos. Exceção: `vellosleads.com.br/` (espelha as URLs reais do site no ar).

### Histórico

- **2026-07-24:** Vellos separado do cliente Dayane Tavares e promovido a cliente próprio — pasta movida de `clientes/Dayane Tavares/Vellos/` pra `clientes/Vellos/`. Histórico de trabalho anterior a essa data (auditoria do site, geração de propostas, ajustes de LinkedIn) está registrado em `clientes/Dayane Tavares/CLAUDE.md`.

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [a definir]
- Meta Ads — Ad Account ID: [a definir]
- Instagram/Facebook Page: [a definir]
- Outros: e-mail comercial@vellosleads.com.br, WhatsApp +55 85 99216-4191

## Tom de voz deste cliente

Direto ao ponto, sem enrolação. Nada de emoji, nada de travessão, bullet points só quando necessário.

## Identidade visual

Logo em `Marca/` dentro dessa pasta. Site usa fundo escuro `#0d1f1c`, destaque verde `#00c9a7`, Playfair Display (headlines) + Inter (corpo).

## Conteúdo e relatórios

Lotes de conteúdo (carrosséis, posts estáticos) ficam em `Conteúdo/` dentro dessa pasta, com README próprio explicando a estrutura e como regerar as artes.

## Tarefas

Tarefas desse cliente ficam em [tarefas/Vellos.md](../../tarefas/Vellos.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

- 2026-07-24: separado do cliente Dayane Tavares, virou cliente próprio (ver seção "Histórico" acima).

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
