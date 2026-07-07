# Escopo Funcional — Módulos

Referência cruzada: visão e benchmark em `01-visao.md`, arquitetura em `03-arquitetura.md`, priorização em `04-roadmap.md`.

## 1. Conexão WhatsApp (canais)

- Conectar número via **WhatsApp Cloud API** (oficial, Meta): fluxo de embedded signup ou cadastro manual de token + phone_number_id.
- Suporte futuro a **API não-oficial** (Z-API / Evolution API) pra cliente que quer usar o número comum sem migrar pra Cloud API. Entra depois do MVP; a arquitetura já prevê canal como abstração.
- Vários números por workspace (ex: comercial e suporte).
- Status de conexão visível, alerta quando cair.

## 2. Inbox (atendimento)

- Lista de conversas em tempo real, com filtro por status (aberta, pendente, resolvida), atendente, tag e funil.
- Janela de conversa: texto, áudio, imagem, vídeo, documento, resposta a mensagem.
- **Atribuição de atendente** (manual e distribuição automática round-robin).
- **Notas internas** na conversa (não vão pro cliente).
- **Mensagens rápidas** com atalho (ex: `/pix`, `/endereco`), por workspace e por usuário.
- **Templates aprovados** (HSM) pra iniciar conversa fora da janela de 24h da Cloud API.
- Tags na conversa e no contato.
- Indicador de origem do lead direto no topo da conversa (campanha / anúncio / link).

## 3. Rastreamento e atribuição

Coração do produto, o que o Tintim faz:

- **CTWA (click-to-WhatsApp):** anúncio do Meta que abre o WhatsApp manda no webhook da primeira mensagem o objeto `referral` com `ctwa_clid`, `source_id` (id do anúncio), headline e mídia. Capturar, guardar e resolver nomes (campanha/conjunto/anúncio) via Marketing API.
- **Links rastreáveis:** redirecionador próprio (`link.dominio.com/xyz`) que registra o clique (UTMs, fbclid, gclid, referrer, device) e abre o `wa.me` com um **código único no texto da primeira mensagem**. Quando a mensagem chega com o código, casa o clique com o contato.
- **Botão de site / landing page:** mesmo mecanismo do link rastreável, com UTMs da página preservadas.
- **Origem orgânica/direta:** contato sem rastro identificado fica marcado como "direto", nunca some do relatório.
- Atribuição fica gravada no lead (primeira origem) e no histórico (origens subsequentes, pra re-engajamento).

## 4. CRM / Pipeline

- **Kanban** com múltiplos funis por workspace, etapas configuráveis com cor e ordem.
- **Card de lead:** contato vinculado, valor estimado/fechado, responsável, campos customizados (texto, número, seleção, data), tags, origem de tráfego, histórico de atividades.
- Criação automática de lead na primeira mensagem (funil e etapa de entrada configuráveis).
- **Motivos de perda** configuráveis; lead perdido sai do kanban mas fica no relatório.
- **Tarefas / follow-up:** tarefa com prazo vinculada a lead, visão "minhas tarefas do dia", alerta de lead sem interação há X dias.
- Busca global (nome, telefone, tag, campo customizado).

## 5. Eventos pro Meta (Conversions API)

O que fecha o ciclo, o outro pilar do Tintim:

- **Mapeamento etapa → evento:** cada funil configura quais etapas disparam eventos e qual evento (padrão: entrada = `Lead`, etapa de qualificação = evento custom `QualifiedLead`, etapa vendido = `Purchase` com valor e moeda do card).
- Envio com o máximo de parâmetros de match: `ctwa_clid`, `fbclid`/`fbc`, `fbp` (quando veio de link próprio), telefone e nome **hasheados (SHA-256)**, external_id.
- **Deduplicação** com pixel do site via `event_id` quando o evento também é disparado no navegador.
- **Log de envios:** cada evento com status, resposta do Meta e match quality, visível pra debug.
- Configuração por workspace: pixel/dataset ID + token da CAPI do cliente.
- Futuro: Google Ads (enhanced conversions for leads / offline conversion import via `gclid`).

## 6. Automações

- **Por etapa (digital pipeline):** ao entrar na etapa X, executar ações: enviar mensagem/template, marcar tag, atribuir atendente, criar tarefa, disparar webhook, enviar evento CAPI.
- **Por inatividade:** lead parado há X horas/dias na etapa dispara follow-up automático ou tarefa.
- **Webhooks de saída + endpoint de entrada** pra integrar com n8n/Make (aproveita o serviço de automação que a agência já vende).
- Fase avançada: **chatbot de triagem** (menu de opções, coleta de dados, direcionamento de funil), estilo salesbot do Kommo/ManyChat.

## 7. Relatórios

- **Dashboard de tráfego:** por período e por campanha/conjunto/anúncio: investimento (Marketing API insights), cliques rastreados, conversas iniciadas, leads, leads qualificados, vendas, receita, CPL, custo por venda, **ROAS real**.
- **Funil:** conversão etapa a etapa, tempo médio em cada etapa, motivos de perda.
- **Atendimento:** conversas por atendente, tempo de primeira resposta, vendas por atendente.
- Exportação CSV.
- **Notificação de venda** (estilo Tintim): aviso no WhatsApp/e-mail do gestor quando um card entra em "Vendido", com origem e valor.

## 8. Vendas via checkout (rastreamento web — o que a Utmify faz)

Pro cliente que também vende fora do WhatsApp (landing page com checkout, infoproduto, e-commerce):

- **Pixel Leady (`px.js`):** snippet instalado no site/landing page. Captura UTMs, fbclid e gclid, persiste no navegador (last-touch), reporta a sessão pro Leady e **decora os links de checkout** com os parâmetros + `sck` (id da sessão).
- **Webhooks de plataformas de checkout:** Kiwify, Hotmart, Kirvano, Eduzz, Monetizze, Perfect Pay, Braip, Cakto, Yampi + payload genérico. Cada conexão gera uma URL de webhook própria (`/api/webhooks/checkout/:token`). Eventos: pix/boleto gerado, aprovada, recusada, reembolsada, chargeback, carrinho abandonado.
- **Atribuição da venda:** `sck` devolvido pela plataforma casa a venda com a sessão do pixel (e as UTMs dela); UTMs no próprio payload têm prioridade. Comprador com telefone que já é contato do WhatsApp vincula venda ↔ lead (funil híbrido: conversa no WhatsApp, paga no checkout).
- **Purchase server-side:** venda aprovada dispara Purchase pro Meta via CAPI com email/telefone/nome hasheados e fbc derivado do fbclid da sessão. Reembolso/chargeback ficam registrados pro relatório de lucro real.
- **Tela de Vendas:** lista com status, plataforma, origem (campanha › conjunto › anúncio), valor e vínculo com lead; KPIs de aprovadas, receita, pix gerado → pago e reembolsos.
- Futuro: taxa da plataforma e custo do produto pra lucro líquido por anúncio; carrinho abandonado disparando automação de recuperação via WhatsApp (diferencial que a Utmify não tem).

## 9. Contas, workspaces e permissões

- **Multi-tenant:** organização (workspace) por cliente da agência; usuário pode pertencer a vários workspaces (caso do Mateus e de agências).
- Papéis: admin (tudo), gestor (relatórios + configuração de funil), atendente (inbox e seus leads).
- Visão agência (fase futura): painel consolidado dos workspaces.

## Fora de escopo (por enquanto)

- Outros canais além de WhatsApp (Instagram DM, Telegram, e-mail).
- Disparo em massa / broadcast (risco de banimento e de virar ferramenta de spam; reavaliar com Cloud API + templates).
- App mobile nativo (web responsivo primeiro).
- Telefonia/VoIP, emissão de cobrança, contratos.
