# Kelvin Ulrich

---

## Quem é esse cliente

- **Nome:** Kelvin Ulrich (Gestor Kelvin)
- **Segmento:** Gestão de tráfego pago — terceiriza demandas para o Mateus
- **Contato principal:** Kelvin Ulrich — (47) 9220-9417
- **Início do trabalho:** junho/2026

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

- [x] Tráfego pago — Google Ads
- [x] Tráfego pago — Meta Ads
- [ ] Marketing / estrutura comercial
- [x] Site / blog / SaaS / aplicativo
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

## Acessos e contas conectadas

**Meta Pixel**
- Pixel ID: `941785775071733`
- CAPI Token: `EAASxZBipMZB98BR9vvEzZB9iiIkxXWjZBDhe0rFbwZBjGjCwsZBuWHy5ZBFqoIABIxIc0riDMfM10PBS4Nzwm4GvLicP5A05dZBRCYDhRvnT4WNbEO2t1ZAPB5lCHNjEciSL1VAOvFrpGvDYSZCJna42EnZA1LikmzcGGLULigsRbbv5jV5kxjhFURUWFCwPBdnK2GCSAZDZD`

**Google Tag Manager**
- GTM ID: `GTM-NT8JZMD8`

## Tom de voz deste cliente

Segue o padrão do sistema.

## Identidade visual

- **Paleta:** fundo escuro (#0a0a0a), acento azul (#38bdf8), texto branco
- **Fonte:** Inter (300–900)
- **Estilo:** dark mode, glows radiais azuis, cards com borda sutil, clean e moderno
- **Marca:** "Gestor Kelvin" (nunca só "Kelvin")
- **Favicon:** iniciais GK em azul sobre fundo escuro

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](tarefas.md).

## Estratégia e histórico

Foco em vendas. Kelvin é gestor de tráfego e terceiriza execução para o Mateus. Demandas incluem:

- Tráfego pago (Google Ads + Meta Ads) para clientes do Kelvin
- Materiais estratégicos: playbooks, planos de ação, guias de sazonalidade
- Projeto web: CRM Gestor Kelvin (crm.gestorkelvin.com.br) — Vite + TanStack + Supabase, criado no Lovable
- Site institucional: gestorkelvin.com.br — landing page estática (HTML puro) em `site/`

### Projetos por cliente do Kelvin

- **Bobina PVC** — plano de tráfego pago para nicho industrial
- **Dublin** — estratégia de tráfego para operação em Dublin
- **Universo Jump** — mapeamento de funil completo

## Estrutura da pasta

```text
kelvin-ulrich/
├── CLAUDE.md          ← este arquivo
├── briefing.md        ← contexto do cliente
├── tarefas.md         ← backlog e entregas
├── materiais/         ← playbooks, planos e guias entregues (HTML + PDF)
├── apresentação/      ← prints de resultados e depoimentos de clientes
├── site/              ← site institucional gestorkelvin.com.br (deploy manual — subir pasta inteira)
│   ├── index.html
│   ├── termos-de-uso.html
│   ├── politica-de-privacidade.html
│   ├── og-image.jpg       ← OG image para redes sociais (1200x630)
│   └── img/               ← assets do site
│       ├── kelvin-hero.jpg / kelvin-polo.jpg
│       ├── favicon.svg / favicon.png / favicon-32.png
│       └── apple-touch-icon.png
└── crm.gestorkelvin.com.br/  ← projeto web CRM (Lovable/Vite)
```

---

## Regras específicas

- Em todo PDF gerado para este cliente, usar o nome **"Gestor Kelvin"** como referência.
- Materiais entregues ficam em `materiais/` (HTML como fonte editável, PDF como versão final).
- Site institucional: domínio **gestorkelvin.com.br**, deploy manual. Pasta `site/` é a raiz do deploy (subir tudo que está dentro).
- Não prometer prazos nem garantia de resultados em nenhum material. Kelvin não gosta disso.

---

## Contexto do sistema principal

Essa pasta vive dentro do Kortex OS (`c:\Users\mateu\Desktop\Kortex OS`). Se for aberta como workspace separado, esses arquivos do sistema principal continuam valendo e devem ser lidos quando relevante:

- `../../_contexto/empresa.md` — quem presta o serviço, como o negócio funciona
- `../../_contexto/preferencias.md` — tom de voz e estilo padrão (a menos que sobrescrito acima)
- `../../_contexto/estrategia.md` — foco atual e prioridades do negócio como um todo
- `../../marca/design-guide.md` — identidade visual padrão pra tarefas visuais
- `../../templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis

## Regras

- Skills disponíveis em `.claude/skills/` ou `.claude/commands/` do sistema principal continuam valendo mesmo abrindo essa pasta separada.
- Não inventar dados de conta, métrica ou histórico — perguntar ou deixar `[a definir]`.
- Atualizar este arquivo quando houver mudança de serviço contratado, conta conectada ou direção estratégica relevante.
