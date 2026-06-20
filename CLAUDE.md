# Mateus Botelho — Claude Code OS

## O que é esse workspace
Workspace de trabalho do Mateus Botelho. Aqui ficam os clientes (tráfego pago, marketing, comercial, sites/SaaS, copy), a operação interna própria, propostas e conteúdo.

**Estrutura de pastas:**
- `_contexto/` — memória do sistema (não apagar)
- `marca/` — identidade visual e logos (ainda em definição)
- `clientes/` — uma pasta por cliente; `_modelo-cliente/` é o template (briefing.md)
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
- [ ] Google Ads (skill /google-ads-ratos)
- [ ] Meta Ads (skill /meta-ads-ratos)

*(Marcar conforme for instalando os MCPs/skills)*

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
- Propostas de cliente salvar em `clientes/[nome-cliente]/proposta.pdf` (gerada por `/proposta-comercial`)
- Operação interna própria vai em `interno/[area]/`
- Conteúdo vai em `conteudo/`
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
