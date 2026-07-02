# Mateus Botelho — Claude Code OS

## O que é esse workspace
Workspace de trabalho do Mateus Botelho. Aqui ficam os clientes (tráfego pago, marketing, comercial, sites/SaaS, copy), a operação interna própria, propostas e conteúdo.

**Estrutura de pastas:**
- `_contexto/` — memória do sistema (não apagar)
- `marca/` — identidade visual e logos (ainda em definição)
- `clientes/` — uma pasta por cliente; `_modelo-cliente/` é o template (briefing.md, CLAUDE.md, tarefas-modelo.md). Cada cliente tem seu próprio CLAUDE.md porque a pasta às vezes é aberta separada. Inclui `clientes/ip-instituto-coy/` (landing page de lançamento)
- `interno/` — operação própria, organizada por área (`trafego/`, `comercial/`, `marketing/`)
- `conteudo/` — produção de conteúdo (próprio ou de cliente)
- `propostas/` — propostas avulsas antes de virar cliente
- `dados/` — drop zone pra arquivos analisar (CSV, XLSX, TXT, PDF)
- `tarefas/` — gestão de tarefas (substitui o Notion). `tarefas/geral.md` é a operação interna; `tarefas/[nome-cliente].md` é por cliente
- `templates/skills/` — templates de skills prontos pra personalizar com /mapear
- `templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis pra usar em skills

## Sobre o negócio
Mateus presta serviços de gestão de tráfego pago, marketing, estrutura e operação comercial, criação de sites/blogs e SaaS/aplicativos, e copywriting. Atende clientes e também usa o sistema pra gerir sua própria operação. Solo: toca tudo sozinho.

## O que mais fazemos aqui
- Gestão de tráfego pago (Google Ads, Meta Ads)
- Marketing e estrutura/operação comercial
- Criação de sites, blogs, SaaS e aplicativos (código customizado e no-code/low-code, depende do projeto)
- Automação de WhatsApp (ManyChat/n8n) — atendimento e funis de venda, depende do cliente
- Copywriting
- Propostas comerciais

## Clientes e contexto
Atende clientes externos nas áreas acima, e usa o sistema também pra organizar a própria operação. Cada cliente tem sua pasta em `clientes/[nome-cliente]/`. Foco atual: centralizar e organizar a operação dos clientes antes de estruturar a operação interna.

## Tom de voz
Detalhes em `_contexto/preferencias.md`. Evitar excesso de travessão (—) e termos de IA genéricos.

## Ferramentas conectadas

- [ ] Notion

## Skills instaladas

- **Tráfego pago/Analytics:** google-ads-ratos, meta-ads-ratos, ga4-ratos, ads
- **Copy/Marketing:** copywriting, ogilvy-copy, schwartz-copy, marketing-psychology, content-strategy, seo-audit
- **Dev/Web:** frontend-design, web-design-guidelines, vercel-react-best-practices, nextjs-app-router-patterns, webapp-testing, context7-cli, context7-mcp, find-docs
- **Documentos:** docx, pdf, pptx, xlsx
- **Mídia/Visual:** canvas-design, nanobanana-ratos, gpt-image2-ratos, transcribe, yt-transcript
- **Operação própria:** apresentacao-institucional, carrossel, comentario-dm-ratos, onboarding-cliente, proposta-comercial, publicar-instagram, publicar-site, roteiro-post, find-skills
- **Comercial:** contrato-cliente, estrutura-comercial, mapear-funil
- **Listas/Prospecção:** limpar-listas (abre CSV/XLSX/Google Sheets, limpa duplicados e telefones inválidos, exporta CSV + relatório HTML formatado pra WhatsApp)

*(Atualizar essa lista conforme instalar/remover skills)*

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_contexto/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades, o que pode esperar

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` ou `.claude/commands/`.
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível, perguntar se o usuário quer transformar em skill. Não perguntar pra tarefas pontuais.

---

## Regras do sistema

- Cada cliente tem sua pasta em `clientes/[nome-cliente]/` (briefing.md gerado por `/onboarding-cliente`)
- Cada cliente também tem seu próprio `CLAUDE.md` (copiado de `clientes/_modelo-cliente/CLAUDE.md`, gerado junto com o briefing por `/onboarding-cliente`). Isso é necessário porque o Mateus às vezes abre a pasta do cliente sozinha, direto como workspace no Claude Code, sem o resto do BotelhoOS — esse CLAUDE.md do cliente garante que o contexto (negócio, serviços contratados, tom de voz, contas conectadas) não se perca nesse caso. Manter esse arquivo atualizado conforme o cliente evolui (não só o briefing.md)
- Propostas de cliente salvar em `clientes/[nome-cliente]/proposta.pdf` (gerada por `/proposta-comercial`)
- Operação interna própria vai em `interno/[area]/`
- Conteúdo próprio (não de cliente) vai em `conteudo/`
- Lotes de conteúdo/roteiro de um cliente (ex: roteiros de postagens, scripts de vídeo) vão em `clientes/[nome-cliente]/conteudo/` — arquivo final (o que vai pro cliente) e arquivo de trabalho interno (contagem, distribuição, gap-analysis) ficam juntos nessa subpasta, separados do resto da raiz do cliente (CLAUDE.md, briefing.md, tarefas.md, site)
- Tarefas gerais vão em `tarefas/geral.md`; tarefas por cliente vão em `tarefas/[nome-cliente].md` (copiar de `clientes/_modelo-cliente/tarefas-modelo.md`)
- Projetos de automação WhatsApp (ManyChat/n8n) pra cliente seguem o fluxo de `/novo-projeto`, usando as ferramentas do `templates/ferramentas/catalogo.md` (N8N MCP, WhatsApp Cloud API/Z-API) conforme o que o projeto pedir

---

## Aprender com correções

Quando o usuário corrigir algo ou der uma instrução que parece permanente ("na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita..."), perguntar se quer salvar. Se sim:

- **Sobre o negócio** → `_contexto/empresa.md`
- **Preferências e estilo** → `_contexto/preferencias.md`
- **Prioridades e foco atual** → `_contexto/estrategia.md`
- **Regra de comportamento nessa pasta** → este `CLAUDE.md`
- **Mudança visual** → `marca/design-guide.md`

Salvar só a linha nova, sem reformatar o arquivo inteiro.
