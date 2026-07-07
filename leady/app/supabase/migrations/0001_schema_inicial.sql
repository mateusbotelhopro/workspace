-- ============================================================
-- CRM Tráfego + WhatsApp — schema inicial
-- Multi-tenant: toda tabela de dados carrega org_id com RLS.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────

create type org_role as enum ('admin', 'gestor', 'atendente');
create type channel_provider as enum ('cloud_api', 'zapi', 'evolution');
create type channel_status as enum ('conectado', 'desconectado', 'erro');
create type conversation_status as enum ('aberta', 'pendente', 'resolvida');
create type message_direction as enum ('entrada', 'saida');
create type message_type as enum ('texto', 'imagem', 'audio', 'video', 'documento', 'sticker', 'template', 'interativo', 'desconhecido');
create type message_status as enum ('pendente', 'enviada', 'entregue', 'lida', 'falhou');
create type attribution_type as enum ('ctwa', 'link', 'utm', 'direto');
create type attribution_confidence as enum ('exata', 'provavel');
create type lead_status as enum ('aberto', 'ganho', 'perdido');
create type capi_event_status as enum ('pendente', 'enviado', 'falhou');
create type automation_trigger as enum ('entrada_etapa', 'inatividade');
create type task_status as enum ('pendente', 'concluida');

-- ── Organizações e usuários ─────────────────────────────────

create table organizations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- Perfil espelha auth.users do Supabase
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null,
  created_at  timestamptz not null default now()
);

create table org_members (
  org_id      uuid not null references organizations(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  role        org_role not null default 'atendente',
  created_at  timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- ── Canais (números de WhatsApp) ─────────────────────────────

create table channels (
  id                uuid primary key default uuid_generate_v4(),
  org_id            uuid not null references organizations(id) on delete cascade,
  name              text not null,
  provider          channel_provider not null default 'cloud_api',
  status            channel_status not null default 'desconectado',
  phone_number      text,                -- E.164 do número conectado
  -- Cloud API
  waba_id           text,
  phone_number_id   text,
  access_token_enc  text,                -- token criptografado, nunca exposto no front
  created_at        timestamptz not null default now()
);

create index channels_org_idx on channels (org_id);
create index channels_phone_number_id_idx on channels (phone_number_id);

-- ── Contatos, conversas e mensagens ──────────────────────────

create table contacts (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  phone         text not null,           -- E.164
  name          text,
  custom_fields jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  unique (org_id, phone)
);

create index contacts_org_idx on contacts (org_id);

create table conversations (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  channel_id    uuid not null references channels(id) on delete cascade,
  contact_id    uuid not null references contacts(id) on delete cascade,
  status        conversation_status not null default 'aberta',
  assignee_id   uuid references profiles(id) on delete set null,
  -- controle da janela de 24h da Cloud API
  last_inbound_at   timestamptz,
  last_message_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index conversations_org_status_idx on conversations (org_id, status, last_message_at desc);
create index conversations_contact_idx on conversations (contact_id);

create table messages (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction     message_direction not null,
  type          message_type not null default 'texto',
  body          text,
  media_url     text,
  wamid         text,                    -- id da mensagem no WhatsApp (dedup + status)
  status        message_status not null default 'pendente',
  sender_id     uuid references profiles(id) on delete set null,  -- atendente, se saída
  is_internal_note boolean not null default false,
  meta          jsonb not null default '{}',  -- payload bruto/extra do provedor
  created_at    timestamptz not null default now()
);

create unique index messages_wamid_idx on messages (wamid) where wamid is not null;
create index messages_conversation_idx on messages (conversation_id, created_at);

-- ── Rastreamento: cliques e atribuição ───────────────────────

-- clique num link rastreável (redirecionador /r/:code)
create table clicks (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  tracking_link_id uuid,                 -- fk adicionada abaixo
  code          text not null unique,    -- código único injetado na 1ª mensagem
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  fbclid        text,
  gclid         text,
  referrer      text,
  user_agent    text,
  matched_contact_id uuid references contacts(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index clicks_org_idx on clicks (org_id, created_at desc);

-- link rastreável configurado pelo usuário (ex: bio, site, criativo)
create table tracking_links (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  channel_id    uuid not null references channels(id) on delete cascade,
  name          text not null,
  slug          text not null,           -- /r/:slug
  default_text  text,                    -- texto pré-preenchido da 1ª mensagem
  created_at    timestamptz not null default now(),
  unique (org_id, slug)
);

alter table clicks
  add constraint clicks_tracking_link_fk
  foreign key (tracking_link_id) references tracking_links(id) on delete set null;

-- cache de nomes de entidades de anúncio (Marketing API)
create table ad_entities (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  ad_id         text not null,
  ad_name       text,
  adset_id      text,
  adset_name    text,
  campaign_id   text,
  campaign_name text,
  ad_account_id text,
  refreshed_at  timestamptz,
  unique (org_id, ad_id)
);

create table attributions (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  lead_id       uuid,                    -- fk adicionada após leads
  contact_id    uuid not null references contacts(id) on delete cascade,
  type          attribution_type not null,
  confidence    attribution_confidence not null default 'exata',
  ctwa_clid     text,
  ad_id         text,
  click_id      uuid references clicks(id) on delete set null,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  fbclid        text,
  gclid         text,
  raw_referral  jsonb,                   -- objeto referral bruto do webhook
  created_at    timestamptz not null default now()
);

create index attributions_org_idx on attributions (org_id);
create index attributions_contact_idx on attributions (contact_id);

-- ── Funis e leads ────────────────────────────────────────────

create table pipelines (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  name          text not null,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);

create table stages (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  pipeline_id   uuid not null references pipelines(id) on delete cascade,
  name          text not null,
  color         text not null default '#64748b',
  position      integer not null default 0,
  is_entry      boolean not null default false,  -- etapa onde lead novo entra
  is_won        boolean not null default false,
  is_lost       boolean not null default false,
  -- mapeamento etapa → evento CAPI (null = não dispara)
  capi_event_name text,                  -- 'Lead' | 'QualifiedLead' | 'Purchase' | custom
  created_at    timestamptz not null default now()
);

create index stages_pipeline_idx on stages (pipeline_id, position);

create table leads (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  contact_id    uuid not null references contacts(id) on delete cascade,
  pipeline_id   uuid not null references pipelines(id) on delete cascade,
  stage_id      uuid not null references stages(id),
  status        lead_status not null default 'aberto',
  value_cents   bigint,                  -- valor em centavos (BRL)
  currency      text not null default 'BRL',
  owner_id      uuid references profiles(id) on delete set null,
  lost_reason   text,
  custom_fields jsonb not null default '{}',
  stage_entered_at timestamptz not null default now(),
  won_at        timestamptz,
  lost_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index leads_org_pipeline_idx on leads (org_id, pipeline_id, stage_id);
create index leads_contact_idx on leads (contact_id);

alter table attributions
  add constraint attributions_lead_fk
  foreign key (lead_id) references leads(id) on delete set null;

create table lost_reasons (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  label         text not null,
  position      integer not null default 0
);

-- ── Tarefas, tags, mensagens rápidas ─────────────────────────

create table tasks (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  lead_id       uuid not null references leads(id) on delete cascade,
  assignee_id   uuid references profiles(id) on delete set null,
  description   text not null,
  due_at        timestamptz,
  status        task_status not null default 'pendente',
  created_at    timestamptz not null default now()
);

create index tasks_org_assignee_idx on tasks (org_id, assignee_id, status, due_at);

create table tags (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  label         text not null,
  color         text not null default '#64748b',
  unique (org_id, label)
);

-- polimórfico simples: tag em contato, conversa ou lead
create table taggables (
  tag_id        uuid not null references tags(id) on delete cascade,
  org_id        uuid not null references organizations(id) on delete cascade,
  entity_type   text not null check (entity_type in ('contact', 'conversation', 'lead')),
  entity_id     uuid not null,
  primary key (tag_id, entity_type, entity_id)
);

create table quick_replies (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  shortcut      text not null,           -- ex: /pix
  body          text not null,
  user_id       uuid references profiles(id) on delete cascade,  -- null = do workspace
  unique (org_id, shortcut, user_id)
);

-- ── Automações ───────────────────────────────────────────────

create table automations (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  name          text not null,
  trigger       automation_trigger not null,
  stage_id      uuid references stages(id) on delete cascade,  -- se entrada_etapa
  inactivity_hours integer,                                     -- se inatividade
  -- lista de ações executadas em ordem:
  -- [{ type: 'enviar_mensagem'|'marcar_tag'|'atribuir'|'criar_tarefa'|'webhook'|'evento_capi', ... }]
  actions       jsonb not null default '[]',
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── Eventos CAPI (log de envios) ─────────────────────────────

create table capi_events (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references organizations(id) on delete cascade,
  lead_id       uuid references leads(id) on delete set null,
  event_name    text not null,
  event_id      text not null,           -- pra deduplicação com pixel
  status        capi_event_status not null default 'pendente',
  attempts      integer not null default 0,
  payload       jsonb not null,          -- payload enviado (dados já hasheados)
  response      jsonb,                   -- resposta do Meta
  error         text,
  sent_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index capi_events_org_idx on capi_events (org_id, created_at desc);
create unique index capi_events_event_id_idx on capi_events (org_id, event_id);

-- ── Configurações de integração por workspace ────────────────

create table integration_settings (
  org_id            uuid primary key references organizations(id) on delete cascade,
  -- Meta CAPI
  meta_dataset_id   text,                -- pixel/dataset id
  meta_capi_token_enc text,
  -- Marketing API
  meta_ad_account_id text,
  meta_ads_token_enc text,
  -- Google (fase 3)
  google_ads_customer_id text,
  updated_at        timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────

-- helper: orgs do usuário logado
create or replace function auth_org_ids()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select org_id from org_members where user_id = auth.uid()
$$;

-- habilita RLS em tudo que tem org_id
do $$
declare t text;
begin
  for t in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'org_id'
      -- integration_settings guarda tokens: policy própria (só admin), fora do loop
      and table_name <> 'integration_settings'
    group by table_name
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy org_isolation on %I for all using (org_id in (select auth_org_ids()))',
      t
    );
  end loop;
end $$;

alter table organizations enable row level security;
create policy org_member_read on organizations
  for select using (id in (select auth_org_ids()));

alter table profiles enable row level security;
create policy profiles_self on profiles
  for all using (id = auth.uid());
create policy profiles_same_org_read on profiles
  for select using (
    id in (select user_id from org_members where org_id in (select auth_org_ids()))
  );

alter table integration_settings enable row level security;
create policy integration_settings_admin on integration_settings
  for all using (
    org_id in (
      select org_id from org_members
      where user_id = auth.uid() and role = 'admin'
    )
  );
