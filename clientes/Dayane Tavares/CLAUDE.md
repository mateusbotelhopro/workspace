# Dayane Tavares

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Dayane Tavares (ecossistema com 2 empresas — ver abaixo)
- **Segmento:** ecossistema com captação de contratos fechados (Datameet) e e-commerce de moda feminina (Dayelle)
- **Contato principal:** [a definir]
- **Início do trabalho:** 2026-06-21

> ⚠️ **2026-07-24:** o Vellos (3ª frente original) foi separado e virou cliente próprio em `clientes/Vellos/`. Todo o histórico de trabalho abaixo referente ao Vellos é anterior à separação — pra tarefas novas do Vellos, usar `clientes/Vellos/CLAUDE.md` e `clientes/Vellos/briefing.md`.

### As empresas

- **Datameet** — captação de clientes com contratos fechados (contrato geral, não só previdenciário — mesmo modelo do João Ferret)
- **Dayelle** — loja de roupa feminina, Recife, vendas online

Detalhes completos do negócio, objetivo, público e histórico estão em [briefing.md](briefing.md). Ler antes de qualquer trabalho de estratégia.

## Serviços contratados

*(marcar o que está ativo)*

- [ ] Tráfego pago — Google Ads
- [x] Tráfego pago — Meta Ads — Dayelle (vendas de roupas online)
- [x] Marketing / estrutura comercial — Datameet
- [x] Site / blog / SaaS / aplicativo — Datameet e Dayelle (sites e sistemas criados pra ambas)
- [ ] Automação WhatsApp (ManyChat/n8n)
- [ ] Copywriting
- [ ] Conteúdo / redes sociais

### Escopo por empresa

- **Datameet:** marketing
- **Dayelle:** tráfego pago pra vendas online

## Organização de arquivos

Pasta organizada por frente de negócio:

```text
clientes/Dayane Tavares/
  Datameet/                       — captação de contratos fechados (modelo João Ferret), marketing
    Clientes/                     — todo cliente com contrato fechado, organizado por cliente (ativo ou em distrato) — contrato original e distrato ficam juntos, dentro da pasta do próprio cliente (não numa pasta "Contratos" separada)
      Modelo Distrato.html/pdf     — template genérico pra gerar novos distratos
      Situações.md                 — visão geral de todos os clientes (status, telefone)
      [Nome do Cliente]/           — Contrato [Nome].pdf (sempre) + Resumo do Caso.md (sempre) + Soluções.md e o Distrato [Nome].html/pdf (só se entrar em distrato)
    Minuta Contrato/               — minuta genérica de contrato (HTML + PDF), sem dados de cliente — usar como base pra cada novo fechamento
    Prospecção/                    — script de geração de material de prospecção (generate_prospect_html.py)
  Dayelle/                        — loja de roupa feminina (Recife), site/sistema, tráfego pago
    Identidade Visual/
      Logos/                      — logo completa (wordmark + símbolo + tagline) e símbolo isolado
  _geral/                         — arquivos transversais que não pertencem a uma frente só
```

Pastas criadas em 2026-06-21. _geral ainda vazia — popular conforme os arquivos de cada empresa forem recebidos/organizados.

### Site e proposta — Vellos (histórico anterior à separação de 2026-07-24)

Recebido em 2026-06-21: site institucional completo (`vellosleads.com.br/`) e apresentação comercial (`Apresentação Comercial/`, HTML + PDF + materiais de capa/avatar do LinkedIn).

2026-07-09: pastas e arquivos deste cliente renomeados de kebab/snake_case pra Title Case sem hífen (ex: `apresentacao-comercial/` → `Apresentação Comercial/`, `linkedin/` → `LinkedIn/`, `datameet/` → `Datameet/`, `prospeccao/` → `Prospecção/`), a pedido da Dayane. Exceções: `vellosleads.com.br/` (espelha URLs reais do site no ar), `_geral/` (convenção de prefixo do sistema principal) e `generate_prospect_html.py` (script Python, segue convenção snake_case da linguagem).

2026-07-10: reorganizado `Vellos/Apresentação Comercial/LinkedIn/` — raiz agora tem só os 3 arquivos finais prontos pra subir (`Vellos LinkedIn Foto Perfil.png`, `Vellos LinkedIn Capa.png`, `Vellos LinkedIn Capa V2.png`, ambas as capas mantidas ativas). Arquivos-fonte (`Avatar.html`, `Cover.html`, `Cover V2.html`, `Stock Handshake.jpg`, `Duotone Handshake Final.jpg`) movidos pra subpasta `Fontes/`. Não há fotos de grupo/equipe nesta pasta ainda — só existirão quando a Dayane enviar.

Auditoria feita em 2026-06-21:

- `robots.txt` apontava o Sitemap pra `chrisdodigital.com.br` (domínio de outro projeto/template) — corrigido pra `www.vellosleads.com.br/sitemap.xml`.
- `sitemap.xml` listava `politica-de-privacidade` e `termos-de-uso` sem `.html`, mas os arquivos reais são `.html` — corrigido (senão dava 404 pra quem acessasse direto pelo sitemap).
- Canonical de `politica-de-privacidade.html` e `termos-de-uso.html` apontavam pra URL sem `.html` (mesmo problema do sitemap) — corrigido nos dois.
- Política de Privacidade tinha a linha "Site:" duplicada na seção de contato/DPO, e mencionava "o e-mail que consta no rodapé do site" — mas o rodapé não tinha nenhum e-mail, só WhatsApp e site. Removida a duplicata. E-mail oficial definido pela Dayane em 2026-06-21: `contato@vellosleads.com.br` — adicionado no rodapé de todas as páginas, nas seções de contato/DPO da Política e dos Termos, e no `contactPoint` do schema.org.
- Formulário de onboarding (`onboarding.html`) envia pro e-mail pessoal `dayaneelizabetee@gmail.com` via FormSubmit — funcional, mas vale confirmar se é esse o e-mail definitivo de recebimento de leads/onboarding.
- Proposta comercial (`Apresentação Comercial/index.html` e o PDF gerado) consistente com o conteúdo do site, sem erros de conteúdo encontrados.
- 2026-07-02: Melhorada a qualidade das imagens do LinkedIn (`Vellos/Apresentação Comercial/LinkedIn/`). A capa com foto (`Cover V2.html` → `Vellos LinkedIn Capa.png`) usava um duotone verde feito com corte/threshold agressivo, que quebrava a foto em blocos e perdia todo o detalhe. Refeito o duotone com mapeamento de gradiente sobre a escala de cinza (preserva detalhe da foto) e re-renderizadas as 3 imagens (capa com foto, capa v2 com grafo abstrato, foto de perfil) em 3x de resolução via headless browser — antes estavam em 2x. Arquivos antigos substituídos no lugar; imagem-fonte nova é `Duotone Handshake Final.jpg`.

### Casos de clientes (distrato) — Datameet

2026-07-09: reorganizado `Datameet/Distrato/` → `Datameet/Clientes/`, a pedido da Dayane — a pasta não é mais organizada só pelo documento de distrato, e sim por cliente. Cada cliente tem sua própria pasta com `Resumo do Caso.md` (contexto e status), `Soluções.md` (o que foi/será feito) e o `Distrato [Nome].html/pdf` quando aplicável. `Situações.md` no topo de `Clientes/` dá a visão geral de todos os casos. Casos existentes até agora: Ana Paula Zarpelon, George Christopher Rocio e Sinval Andrade (resolvidos, distrato gerado) e Marcos Pimentel (aguardando dados — CNPJ, data do contrato, valor a restituir e prazo). A Dayane vai passando os dados de cada caso aos poucos; atualizar as pastas conforme chegam.

### Minuta de contrato — Datameet

2026-07-02: gerada `Datameet/Minuta Contrato/Minuta do Contrato.html` (+ PDF) a partir do contrato real fechado com o Dr. Sinval Andrade (Sinval Andrade Sociedade de Advogados, direito previdenciário/BPC-LOAS, 15/05/2026). Removidos todos os dados pessoais do contratante e os termos específicos daquele fechamento (área de atuação, quantidade de contratos, valor, forma de pagamento) — viraram placeholders. Mantidos os dados fixos da Data Meet Soluções (CNPJ, endereço, contato) e a estrutura jurídica das 10 cláusulas, pra reaproveitar em qualquer novo fechamento (não só previdenciário). Arquivo original do Sinval e a lista/views de prospecção de WhatsApp (`Lista_...xlsx`, `prospeccao_whatsapp_lista_*.html`) foram excluídos a pedido — o script `Prospecção/generate_prospect_html.py` foi mantido pra gerar novas views quando precisar.

2026-07-09: Recebida nova lista (`Lista_202679101038820.xlsx`, 666 empresas). Script atualizado pra apontar pro novo arquivo e rodado — 538 com WhatsApp válido (128 excluídas por falta de número), dividida em `Prospecção SDR Lista 1.html` e `Prospecção SDR Lista 2.html` (269 cada), prontas pra SDR chamar direto no WhatsApp (botão `wa.me` por número).

### Contratos fechados — Datameet

2026-07-10: 8 contratos assinados foram recebidos soltos na raiz de `Datameet/` (nomes de arquivo inconsistentes, ex: "Braga contrato prestação de serviços .pdf", "contrato_rodrigues_santos01.pdf"). Lidos, organizados e renomeados com o nome real do contratante extraído do próprio contrato. Inicialmente criada uma pasta `Contratos/[Nome]/` separada de `Clientes/[Nome]/`, mas a pedido da Dayane essa estrutura foi consolidada no mesmo dia: **o contrato do cliente vive dentro da própria pasta em `Clientes/[Nome do Cliente]/Contrato [Nome do Cliente].pdf`**, junto com `Resumo do Caso.md` e (se aplicável) o distrato — não existe mais pasta `Contratos/` separada:

- **Dias Braga Advocacia** (CNPJ 27.666.344/0001-90) — previdenciário/auxílio-acidente, 5 contratos, R$ 2.000,00 (cartão), assinado 10/04/2026.
- **Maira Durval dos Santos** (pessoa física, advogada) — full service, 5 contratos, R$ 1.800,00 (R$ 360 de entrada + resto por entrega), assinado 20/05/2026. Foro Unaí/MG (domicílio da contratante, não Petrolina/PE como os demais).
- **Roberto Barbosa Leal Advocacia** (CNPJ 29.139.187/0001-90) — direito médico/negativa de cirurgia reparadora, 5 contratos, R$ 2.200,00 (50% PIX + 50% na entrega), assinado 15/04/2026.
- **Rosana Cristiny Soares de Farias** (pessoa física, advogada) — RCT + Redução de Passivo Tributário + Direito Médico (2+1+2 contratos), 5 no total, R$ 1.400,00 em 7 parcelas no cartão, assinado 01/05/2026. Contrato tem inconsistência interna: Cláusula 3ª define 5 contratos mas Cláusula 8.1 menciona "10 (dez) contratos" (erro de cópia de outro modelo) — vale confirmar com a Dayane qual é a meta real antes de cobrar da cliente.
- **E R Magalhães Fernandes Advocacia** (CNPJ 28.847.106/0001-44) — previdenciário genérico, 5 contratos, R$ 2.000,00 (cartão), assinado 17/04/2026.
- **Gomes de Oliveira Advogados Associados** (CNPJ 08.778.996/0001-72) — previdenciário genérico, 5 contratos, R$ 2.000,00 (50% PIX + 50% na entrega), assinado 16/04/2026.
- **Jose Eduardo Kotwica Jardim** (CNPJ 34.998.589/0001-80) — o arquivo original se chamava "MK Advogados contrato prestação de serviços .pdf..pdf", mas o conteúdo do contrato é de outro cliente (José Eduardo Kotwica Jardim, Curitiba/PR); renomeado pelo nome real. Vale confirmar com a Dayane se "MK Advogados" é só um apelido interno ou se o arquivo errado foi anexado. Modelo de serviço diferente dos demais: banca/defesa em busca e apreensão de veículos, exige conversão efetiva (mínimo 10 contratos fechados e assinados pelos leads, com comprovante de pagamento de honorários), não só entrega de lead qualificado — maior responsabilidade operacional da Datameet. R$ 3.700,00 (50%+50%, parcelável em até 3x sem juros), assinado 04/05/2026.
- **Rodrigues dos Santos e Bemfica Advogados Associados** (CNPJ 36.162.904/0001-60) — previdenciário, 10 contratos (maior pacote), R$ 3.800,00 (50% PIX + 50% na entrega), assinado 19/05/2026.

Total dessa leva: R$ 18.900,00 contratados, 55 contratos previstos de entrega. Nenhum desses 8 clientes tinha pasta prévia em `Contratos/`.

2026-07-10 (2ª leva, mesmo dia): mais 6 PDFs recebidos na raiz com nome em UUID do ZapSign (ex: `5e59cd3b-025a-48cd-83d7-f0db633a4da7.pdf`). Identificados pelo conteúdo e organizados em `Clientes/[Nome]/`:

- **Guilherme Fernandes Cardoso** (CPF, advogado, Cachoeirinha/RS) — ⚠️ modelo diferente: **Contrato de Parceria Comercial**, não venda de leads por valor fixo. Investimento diário de tráfego pago dividido 50/50 (R$75 + R$75), remuneração da Datameet é 50% dos honorários recebidos pelo parceiro por contrato executado, meta de 10 contratos/mês, vigência de 3 meses. Assinado 19-20/05/2026.
- **Ciro Freitas** (CNPJ 49.282.606/0001-56, Recife/PE) — direito bancário, 10 contratos, R$ 4.000,00 (50%+50% PIX), assinado 12-14/05/2026.
- **Candido Parente** (CNPJ 54.882.252/0001-10, Sobral/CE) — previdenciário, 10 contratos, R$ 2.000,00 (100% no ato PIX), assinado 12/05/2026.
- **Elias Nunes** (CNPJ 65.852.229/0001-08, Campo Grande/MS) — direito bancário, 10 contratos, R$ 2.500,00 (R$2.000 cartão + R$500 PIX na entrega), assinado 12-13/05/2026. Foro Campo Grande/MS (não Recife/PE). Contrato mais detalhado, com cláusulas de conformidade ética (OAB) e aprovação prévia de material comercial.
- **Marcos Pimentel Sociedade de Advogados** (CNPJ 27.850.175/0001-44, Vitória/ES) — este cliente já existia em `Clientes/` aguardando dados (caso de distrato em aberto sem contrato localizado); o contrato apareceu nessa leva e foi anexado à pasta já existente. Previdenciário, **50 contratos** (maior pacote de todos), R$ 9.500,00 (entrada R$2.500 + saldo R$7.000), assinado 18-19/05/2026. Pendência antiga (minuta de distrato com campos em aberto) precisa ser reconfirmada com a Dayane agora que o contrato existe.
- **Maira Durval dos Santos** — o 6º arquivo era uma cópia do contrato dela já processado na 1ª leva, mas com o relatório de assinaturas do ZapSign mostrando status "Em-Curso" (só a Datameet assinou; a assinatura da cliente consta pendente). Guardado como `Contrato Maira Durval dos Santos (assinatura pendente - ZapSign).pdf` na pasta dela, e o `Resumo do Caso.md` dela atualizado com alerta — o contrato pode não estar validamente fechado. Também identificado nesse contrato um erro de cópia: Cláusula 3ª define meta de 5 contratos, mas Cláusula 8.1 menciona "50 (cinquenta) contratos" (mesmo padrão de erro do contrato da Rosana Cristiny, ali era "10").

2026-07-10: a pedido da Dayane, criada também a pasta correspondente de cada um desses 8 clientes em `Datameet/Clientes/` (com `Resumo do Caso.md` documentando dados do contrato e status "Ativo — contrato em execução"), mesmo sem caso de distrato — `Clientes/` deixou de ser só pra casos de cancelamento e passou a cobrir todo cliente com contrato fechado. `Situações.md` atualizado com os 8 novos.

O Castro e Silveira enviou também, nesse mesmo dia, o modelo de contrato de honorários que usa com os próprios clientes finais (pra Datameet usar ao formalizar cada entrega) — guardado em `Clientes/Castro e Silveira Advogados/Modelo de Entrega/Modelo Contrato de Honorários Castro e Silveira.docx` (subpasta criada a pedido da Dayane pra não misturar com os arquivos de caso).

2026-07-10 (3ª leva, mesmo dia): mais 3 PDFs com nome UUID do ZapSign na raiz:

- **Roberto Barbosa Leal Advocacia** — duplicado do cliente já processado, mas essa versão trazia o relatório de assinaturas do ZapSign confirmando "2 de 2 Assinaturas" (Datameet 15/04 14:47, cliente 15/04 15:21) — contrato validamente fechado, sem o problema visto no caso da Maira. Guardado como segunda cópia (`... (com assinatura ZapSign).pdf`) na pasta já existente.
- **Elder Ruiz Dias Ribeiro Amaral** (CPF, pessoa física, Santa Maria/RS) — previdenciário, 5 contratos, R$ 1.499,00 (PIX único), assinado 29/04-04/05/2026. Cliente novo.
- **Thiago Cantarelli Sociedade Individual de Advocacia** (CNPJ 26.191.013/0001-89, Recife/PE) — previdenciário, 5 contratos + 2 bônus sem custo (7 no total), R$ 2.000,00 (PIX no ato), assinado 07-14/04/2026. Cliente novo.

### Padronização de distratos — Datameet (2026-07-16)

A pedido do Mateus, gerado (ou corrigido) o distrato de **todos os clientes com dados suficientes** em `Datameet/Clientes/`, inclusive clientes ativos sem qualquer pedido de rescisão — tratado como documento padrão pronto pra uso a qualquer momento, não como indicação de cancelamento real. Prazo de restituição uniformizado em **30 (trinta) dias úteis** em todos os distratos, substituindo os prazos anteriores que variavam entre 20 dias úteis e 90 dias corridos conforme o caso. Também atualizado o `Modelo Distrato.html` (template) pra já nascer com 30 dias úteis em novos casos.

- **Corrigidos** (já tinham distrato gerado): Ana Paula Zarpelon, George Christopher Rocio, Sinval Andrade, Elias Nunes, Elder Ruiz Dias Ribeiro Amaral, Jose Eduardo Kotwica Jardim, Ciro Freitas.
- **Completado** (tinha minuta com campos em aberto): Marcos Pimentel — preenchidos CNPJ, endereço e valor a partir do contrato já localizado; valor a restituir R$ 2.500,00 (entrada).
- **Criados do zero**: Candido Parente (R$ 2.000,00 integral), Castro e Silveira Advogados (R$ 1.500,00, 50%), Dias Braga Advocacia (R$ 2.000,00 integral), E R Magalhães Fernandes Advocacia (R$ 2.000,00 integral), Gomes de Oliveira Advogados Associados (R$ 1.000,00, 50%), Roberto Barbosa Leal Advocacia (R$ 1.100,00, 50%), Rodrigues dos Santos e Bemfica Advogados Associados (R$ 1.900,00, 50%), Thiago Cantarelli (R$ 2.000,00 integral). Valor a restituir sempre calculado como o montante já pago até o momento (entrada ou integral, quando não há entrega de contrato ainda).
- **Casos especiais**:
  - **Guilherme Fernandes Cardoso** — modelo de parceria comercial (participação de 50% nos honorários, sem taxa fixa), não cabe o valor fixo de restituição do modelo padrão. Distrato customizado: sem valor fixo, apenas repasse de honorários pendentes (se houver) em até 30 dias úteis, e encerramento do investimento diário compartilhado em tráfego pago.
  - **Maira Durval dos Santos** — distrato gerado normalmente (R$ 360,00, entrada), mas com alerta mantido no Resumo do Caso.md: confirmar com a Dayane se a assinatura da cliente no contrato original (status "Em-Curso" no ZapSign) já foi regularizada antes de considerar o distrato exigível.
  - **Rosana Cristiny Soares de Farias** — pagamento parcelado em 7x no cartão, sem registro de quantas parcelas já foram pagas até o momento. Distrato gerado com placeholder vermelho no campo do valor a restituir — não enviar pra assinatura sem confirmar com a Dayane quantas parcelas entraram.
- **Fora do escopo**: RSB Advogados e Rafael Nunes continuam sem CNPJ, contrato ou valor registrados — não há dados mínimos pra gerar um distrato, mesmo que padrão.

Todos os distratos gerados/corrigidos foram exportados em HTML + PDF (via `gerar-pdf.js`, Playwright) e os respectivos `Resumo do Caso.md` e `Situações.md` foram atualizados com a seção de Distrato e o status de cada cliente.

### Identidade visual — Dayelle

Recebido em 2026-06-21: 2 arquivos de logo, organizados em `Dayelle/Identidade Visual/Logos/`:

- `Dayelle Logo Completa.jpeg` — wordmark "Dayelle" com símbolo (monograma "DD" dourado) acima e tagline "Seu estilo, sua essência"
- `Dayelle Símbolo.jpeg` — símbolo isolado (monograma "DD", preto + dourado)

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
