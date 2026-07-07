// Tipos de domínio. Espelham o schema do banco (supabase/migrations).

export type OrgRole = "admin" | "gestor" | "atendente";
export type ChannelProvider = "cloud_api" | "zapi" | "evolution";
export type ChannelStatus = "conectado" | "desconectado" | "erro";
export type ConversationStatus = "aberta" | "pendente" | "resolvida";
export type MessageDirection = "entrada" | "saida";
export type MessageType =
  | "texto"
  | "imagem"
  | "audio"
  | "video"
  | "documento"
  | "sticker"
  | "template"
  | "interativo"
  | "desconhecido";
export type MessageStatus = "pendente" | "enviada" | "entregue" | "lida" | "falhou";
export type AttributionType = "ctwa" | "link" | "utm" | "direto";
export type AttributionConfidence = "exata" | "provavel";
export type LeadStatus = "aberto" | "ganho" | "perdido";
export type CapiEventStatus = "pendente" | "enviado" | "falhou";

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Channel {
  id: string;
  org_id: string;
  name: string;
  provider: ChannelProvider;
  status: ChannelStatus;
  phone_number: string | null;
  waba_id: string | null;
  phone_number_id: string | null;
}

export interface Contact {
  id: string;
  org_id: string;
  phone: string;
  name: string | null;
  custom_fields: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  org_id: string;
  channel_id: string;
  contact_id: string;
  status: ConversationStatus;
  assignee_id: string | null;
  last_inbound_at: string | null;
  last_message_at: string | null;
}

export interface Message {
  id: string;
  org_id: string;
  conversation_id: string;
  direction: MessageDirection;
  type: MessageType;
  body: string | null;
  media_url: string | null;
  wamid: string | null;
  status: MessageStatus;
  sender_id: string | null;
  is_internal_note: boolean;
}

export interface Pipeline {
  id: string;
  org_id: string;
  name: string;
  is_default: boolean;
}

export interface Stage {
  id: string;
  org_id: string;
  pipeline_id: string;
  name: string;
  color: string;
  position: number;
  is_entry: boolean;
  is_won: boolean;
  is_lost: boolean;
  capi_event_name: string | null;
}

export interface Lead {
  id: string;
  org_id: string;
  contact_id: string;
  pipeline_id: string;
  stage_id: string;
  status: LeadStatus;
  value_cents: number | null;
  currency: string;
  owner_id: string | null;
  lost_reason: string | null;
  custom_fields: Record<string, unknown>;
}

export interface Attribution {
  id: string;
  org_id: string;
  lead_id: string | null;
  contact_id: string;
  type: AttributionType;
  confidence: AttributionConfidence;
  ctwa_clid: string | null;
  ad_id: string | null;
  click_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  fbclid: string | null;
  gclid: string | null;
}

/** Objeto `referral` que a Cloud API manda na 1ª mensagem vinda de anúncio CTWA */
export interface CtwaReferral {
  source_url: string;
  source_id: string; // ad id
  source_type: "ad" | "post";
  headline?: string;
  body?: string;
  media_type?: string;
  image_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  ctwa_clid?: string;
}
