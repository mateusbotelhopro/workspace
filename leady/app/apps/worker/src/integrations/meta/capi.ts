// ════════════════════════════════════════════════════════════
// STUB — Meta Conversions API (integração real entra no final)
// Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
// POST /{dataset_id}/events
// ════════════════════════════════════════════════════════════

/**
 * user_data JÁ HASHEADA (sha256) onde exigido. Montagem/hash acontece
 * no job send-capi-event antes de gravar em capi_events.payload.
 */
export interface CapiUserData {
  ph?: string[]; // telefones hasheados
  fn?: string[]; // primeiro nome hasheado
  external_id?: string[];
  ctwa_clid?: string;
  fbc?: string; // derivado do fbclid: fb.1.{timestamp}.{fbclid}
  fbp?: string;
}

export interface CapiEventPayload {
  event_name: string;
  event_time: number; // unix seconds
  event_id: string; // dedup com pixel
  action_source: "chat" | "website" | "system_generated";
  user_data: CapiUserData;
  custom_data?: {
    value?: number;
    currency?: string;
    [key: string]: unknown;
  };
}

export interface CapiSendResult {
  events_received: number;
  fbtrace_id: string;
}

export async function sendCapiEvents(
  _datasetId: string,
  _accessToken: string,
  _events: CapiEventPayload[],
): Promise<CapiSendResult> {
  throw new Error("Integração Conversions API ainda não implementada (fase de integrações)");
}
