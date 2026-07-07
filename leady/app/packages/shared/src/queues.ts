// Contratos das filas BullMQ. Web enfileira, worker consome.
// Qualquer mudança aqui afeta os dois lados.

export const QUEUES = {
  /** Payload bruto do webhook do WhatsApp → processar mensagem/status */
  INCOMING_WEBHOOK: "incoming-webhook",
  /** Enviar mensagem de saída pro WhatsApp */
  OUTBOUND_MESSAGE: "outbound-message",
  /** Enviar evento pro Meta Conversions API */
  CAPI_EVENT: "capi-event",
  /** Resolver nomes de campanha/conjunto/anúncio via Marketing API */
  RESOLVE_AD_NAMES: "resolve-ad-names",
  /** Sincronizar investimento (insights) da Marketing API */
  SYNC_INSIGHTS: "sync-insights",
  /** Follow-ups e automações agendadas (inatividade) */
  AUTOMATION: "automation",
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];

// ── Payloads ────────────────────────────────────────────────

export interface IncomingWebhookJob {
  /** corpo bruto do POST do webhook da Meta */
  payload: unknown;
  receivedAt: string;
}

export interface OutboundMessageJob {
  orgId: string;
  channelId: string;
  conversationId: string;
  messageId: string; // linha já criada em `messages` com status pendente
}

export interface CapiEventJob {
  orgId: string;
  capiEventId: string; // linha em `capi_events` com payload pronto
}

export interface ResolveAdNamesJob {
  orgId: string;
  adId: string;
}

export interface SyncInsightsJob {
  orgId: string;
  /** ISO date (YYYY-MM-DD); default = ontem */
  date?: string;
}

export interface AutomationJob {
  orgId: string;
  automationId: string;
  leadId: string;
}

export interface QueueJobMap {
  [QUEUES.INCOMING_WEBHOOK]: IncomingWebhookJob;
  [QUEUES.OUTBOUND_MESSAGE]: OutboundMessageJob;
  [QUEUES.CAPI_EVENT]: CapiEventJob;
  [QUEUES.RESOLVE_AD_NAMES]: ResolveAdNamesJob;
  [QUEUES.SYNC_INSIGHTS]: SyncInsightsJob;
  [QUEUES.AUTOMATION]: AutomationJob;
}
