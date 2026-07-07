# Arquitetura Técnica

## Stack proposta

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend + API | Next.js (App Router) + TypeScript | Stack que já usamos; SSR pro app, API routes/route handlers pros webhooks |
| Banco | Postgres (Supabase) | Multi-tenant com RLS, auth pronta, realtime nativo pro inbox |
| Realtime | Supabase Realtime (ou WebSocket próprio depois) | Mensagem nova aparece no inbox sem refresh |
| Filas / jobs | BullMQ + Redis (Upstash) | Processar webhook rápido e responder 200; envio CAPI com retry; follow-ups agendados |
| Storage | Supabase Storage ou S3/R2 | Mídia das conversas (áudio, imagem, docs) |
| Hospedagem | Vercel (app) + worker Node em Railway/Render pra filas | Webhook do WhatsApp precisa de resposta rápida e worker sempre de pé |

Decisão em aberto: começar tudo em Next.js/Vercel e só extrair o worker quando o volume pedir, ou já nascer com worker separado. Recomendação: nascer com worker separado, porque retry de CAPI e agendamento de follow-up não combinam com serverless puro.

## Integrações Meta (todas na Graph API)

| API | Uso | Credencial |
|---|---|---|
| WhatsApp Cloud API | Receber/enviar mensagens, templates, mídia | Token do WABA do cliente (embedded signup ou manual) |
| Webhooks | `messages` (inclui `referral` do CTWA), `statuses` (entregue/lido) | App Meta próprio, verify token |
| Conversions API | Enviar Lead / QualifiedLead / Purchase | Dataset (pixel) ID + token CAPI, por workspace |
| Marketing API | Resolver nomes de campanha/conjunto/anúncio a partir do `source_id`; puxar investimento (insights) pro ROAS | Token com `ads_read` da conta de anúncio do cliente |

App Meta único da plataforma, com os produtos WhatsApp, Webhooks e Marketing API. Cada workspace conecta as credenciais do cliente (WABA, pixel, ad account).

## Fluxos críticos

### 1. Lead entra por anúncio CTWA

```
Anúncio Meta (click-to-WhatsApp)
  → usuário manda 1ª mensagem
  → webhook messages chega com referral { ctwa_clid, source_id, source_url, headline }
  → worker: cria/acha contato → cria conversa → cria lead na etapa de entrada
  → guarda atribuição (ctwa_clid + ad_id)
  → job: resolve nomes via Marketing API (ad → adset → campaign) e cacheia
  → job: envia evento Lead pro CAPI com ctwa_clid + telefone hasheado
```

### 2. Lead entra por link rastreável (site, bio, criativo com link)

```
Clique em link.dominio.com/xyz
  → registra clique (utm_*, fbclid, gclid, user agent, timestamp) e gera código curto
  → redireciona pra wa.me/55...?text="Olá! ... [#xyz123]"
  → 1ª mensagem chega com o código no texto
  → casa clique ↔ contato, apaga o código da exibição
  → atribuição por UTM/fbclid; evento CAPI vai com fbc derivado do fbclid
```

Ponto de atenção: usuário pode apagar o código antes de enviar. Mitigações: código curto e discreto, e fallback de correlação por janela de tempo (clique recente + conversa nova sem origem). O fallback é heurístico e fica marcado como "atribuição provável".

### 3. Etapa do funil dispara evento CAPI

```
Card movido pra etapa mapeada (ex: "Vendido")
  → job na fila: monta payload (event_name, event_time, event_id,
     user_data hasheada: ph, fn, external_id + ctwa_clid/fbc/fbp,
     custom_data: value, currency)
  → POST /{dataset_id}/events
  → grava log (payload, resposta, events_received, match quality)
  → retry exponencial em falha; alerta se token expirou
```

### 4. Investimento e ROAS

```
Job diário (e sob demanda no dashboard):
  insights da Marketing API por ad_id (spend, impressions, clicks)
  → cruza com leads/vendas atribuídos por ad_id no período
  → CPL, custo por venda, ROAS = receita atribuída / spend
```

## Modelo de dados (resumo)

```
organizations        (workspace por cliente)
users                / org_members (papel: admin, gestor, atendente)
channels             (número WhatsApp: cloud_api | zapi, credenciais, status)
contacts             (telefone E.164, nome, campos custom, org_id)
conversations        (contact_id, channel_id, status, assignee)
messages             (conversation_id, direção, tipo, corpo, mídia, wamid, status)
clicks               (código, utm_*, fbclid, gclid, ip/ua, created_at)
attributions         (lead_id, tipo: ctwa | link | direto, ctwa_clid, ad_id,
                      adset_id, campaign_id, utm_*, confiança)
ad_entities          (cache de nomes: ad, adset, campaign, ad_account)
pipelines / stages   (funis e etapas, config de evento CAPI por etapa)
leads                (contact_id, pipeline_id, stage_id, valor, responsável,
                      status: aberto | ganho | perdido, motivo_perda)
tasks                (lead_id, descrição, prazo, done)
tags / taggables
quick_replies
automations          (gatilho: etapa | inatividade; ações em JSON)
capi_events          (lead_id, event_name, event_id, payload, status, response)
integr_settings      (por org: dataset_id, capi_token, ad_account_id, tokens)
```

Todas as tabelas de dados carregam `org_id` com RLS por workspace.

## Segurança e conformidade

- Tokens de cliente criptografados em repouso; nunca no frontend.
- Dados pessoais pro CAPI sempre hasheados (SHA-256) antes do envio.
- LGPD: telefone e conversa são dado pessoal; definir retenção, exportação e exclusão por contato. Base legal: legítimo interesse/execução de contrato do cliente do workspace (o cliente é o controlador, a plataforma é operadora).
- Webhook com verificação de assinatura (`X-Hub-Signature-256`).
- Rate limits do Meta: fila com throttle por WABA e por dataset.

## Riscos técnicos principais

1. **Match do link rastreável** (código apagado pelo usuário): mitigado com fallback heurístico; CTWA não tem esse problema.
2. **Janela de 24h da Cloud API:** fora dela só template aprovado. O produto precisa deixar isso claro no inbox (estado "janela fechada" + atalho pra template).
3. **Aprovação do app Meta** (advanced access pra WhatsApp/Marketing API): processo de review demora; começar cedo, usar contas de teste enquanto isso.
4. **Custo por conversa da Cloud API** repassado ao cliente do workspace: exibir estimativa de custo no relatório pra não virar surpresa.
5. **API não-oficial (Z-API/Evolution):** risco de banimento do número é do cliente; deixar contratualmente claro quando esse canal entrar.
