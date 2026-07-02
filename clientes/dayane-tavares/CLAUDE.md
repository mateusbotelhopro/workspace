# Dayane Tavares

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do Kortex OS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Dayane Tavares (ecossistema com 3 empresas — ver abaixo)
- **Segmento:** ecossistema com prospecção B2B (Vellos), captação de contratos fechados (Datameet) e e-commerce de moda feminina (Dayelle)
- **Contato principal:** [a definir]
- **Início do trabalho:** 2026-06-21

### As 3 empresas

- **Vellos** — prospecção B2B pra empresas via LinkedIn, com marcação de reuniões
- **Datameet** — captação de clientes com contratos fechados (contrato geral, não só previdenciário — mesmo modelo do João Ferret)
- **Dayelle** — loja de roupa feminina, Recife, vendas online

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [x] Tráfego pago — Meta Ads — Dayelle (vendas de roupas online)
- [x] Marketing / estrutura comercial — Datameet
- [x] Site / blog / SaaS / aplicativo — Vellos, Datameet e Dayelle (sites e sistemas criados pra todas as 3)
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais
- [x] Operacional / administrativo — Vellos (operacional, edição de contrato, exportação)

### Escopo por empresa

- **Vellos:** serviço técnico — criação de site, operacional, edição de contrato, exportação
- **Datameet:** marketing
- **Dayelle:** tráfego pago pra vendas online

## Organização de arquivos

Pasta organizada por frente de negócio:

```text
clientes/dayane-tavares/
  vellos/                         — prospecção B2B via LinkedIn, site/sistema, operacional/contratos/exportação
    vellosleads.com.br/           — site institucional (landing, onboarding de cliente, política/termos)
    apresentacao-comercial/       — proposta comercial (HTML + PDF) e materiais de capa/avatar do LinkedIn
  datameet/                       — captação de contratos fechados (modelo João Ferret), marketing
  dayelle/                        — loja de roupa feminina (Recife), site/sistema, tráfego pago
    identidade-visual/
      logos/                      — logo completa (wordmark + símbolo + tagline) e símbolo isolado
  _geral/                         — arquivos transversais que não pertencem a uma frente só
```

Pastas criadas em 2026-06-21. Datameet e _geral ainda vazias — popular conforme os arquivos de cada empresa forem recebidos/organizados.

### Site e proposta — Vellos

Recebido em 2026-06-21: site institucional completo (`vellosleads.com.br/`) e apresentação comercial (`apresentacao-comercial/`, HTML + PDF + materiais de capa/avatar do LinkedIn). Organização feita: pasta "Apresentação Comercial" renomeada pra `apresentacao-comercial/`, subpasta "LinkedIn" renomeada pra `linkedin/`.

Auditoria feita em 2026-06-21:

- `robots.txt` apontava o Sitemap pra `chrisdodigital.com.br` (domínio de outro projeto/template) — corrigido pra `www.vellosleads.com.br/sitemap.xml`.
- `sitemap.xml` listava `politica-de-privacidade` e `termos-de-uso` sem `.html`, mas os arquivos reais são `.html` — corrigido (senão dava 404 pra quem acessasse direto pelo sitemap).
- Canonical de `politica-de-privacidade.html` e `termos-de-uso.html` apontavam pra URL sem `.html` (mesmo problema do sitemap) — corrigido nos dois.
- Política de Privacidade tinha a linha "Site:" duplicada na seção de contato/DPO, e mencionava "o e-mail que consta no rodapé do site" — mas o rodapé não tinha nenhum e-mail, só WhatsApp e site. Removida a duplicata. E-mail oficial definido pela Dayane em 2026-06-21: `contato@vellosleads.com.br` — adicionado no rodapé de todas as páginas, nas seções de contato/DPO da Política e dos Termos, e no `contactPoint` do schema.org.
- Formulário de onboarding (`onboarding.html`) envia pro e-mail pessoal `dayaneelizabetee@gmail.com` via FormSubmit — funcional, mas vale confirmar se é esse o e-mail definitivo de recebimento de leads/onboarding.
- Proposta comercial (`apresentacao-comercial/index.html` e o PDF gerado) consistente com o conteúdo do site, sem erros de conteúdo encontrados.
- 2026-07-02: Melhorada a qualidade das imagens do LinkedIn (`vellos/apresentacao-comercial/linkedin/`). A capa com foto (`cover-v2.html` → `vellos-linkedin-capa.png`) usava um duotone verde feito com corte/threshold agressivo, que quebrava a foto em blocos e perdia todo o detalhe. Refeito o duotone com mapeamento de gradiente sobre a escala de cinza (preserva detalhe da foto) e re-renderizadas as 3 imagens (capa com foto, capa v2 com grafo abstrato, foto de perfil) em 3x de resolução via headless browser — antes estavam em 2x. Arquivos antigos substituídos no lugar; imagem-fonte nova é `duotone-handshake-final.jpg`.

### Identidade visual — Dayelle

Recebido em 2026-06-21: 2 arquivos de logo, organizados em `dayelle/identidade-visual/logos/`:

- `dayelle-logo-completa.jpeg` — wordmark "Dayelle" com símbolo (monograma "DD" dourado) acima e tagline "Seu estilo, sua essência"
- `dayelle-simbolo.jpeg` — símbolo isolado (monograma "DD", preto + dourado)

Paleta: preto, dourado/bege, fundo off-white. Estilo elegante/serifado.

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Google Ads — Customer ID: [a definir]
- Meta Ads — Ad Account ID: [a definir]
- Instagram/Facebook Page: [a definir]
- Outros: [a definir]

## Tom de voz deste cliente

Segue o padrão do sistema principal (`_contexto/preferencias.md`).

## Identidade visual

[a definir — aguardando arquivos/materiais existentes do cliente, por empresa]

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](tarefas.md). Manter atualizado: mover entre "A fazer", "Em andamento" e "Feito" conforme o trabalho avança.

## Estratégia e histórico

- 2026-06-21: Onboarding inicial. Ecossistema com 3 frentes mapeado (Vellos, Datameet, Dayelle), cada uma com escopo de serviço diferente.

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
