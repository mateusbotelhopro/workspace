// ════════════════════════════════════════════════════════════
// STUB — WhatsApp Cloud API (integração real entra no final)
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
// ════════════════════════════════════════════════════════════

export interface SendTextParams {
  phoneNumberId: string;
  accessToken: string;
  to: string; // E.164 sem '+'
  body: string;
}

export interface SendTextResult {
  wamid: string;
}

/**
 * Envia mensagem de texto via Cloud API.
 * POST /{phone_number_id}/messages { messaging_product: "whatsapp", to, text: { body } }
 */
export async function sendTextMessage(_params: SendTextParams): Promise<SendTextResult> {
  throw new Error("Integração WhatsApp Cloud API ainda não implementada (fase de integrações)");
}

/**
 * Baixa mídia recebida (webhook manda media id; precisa GET /{media_id} pra URL + GET com token).
 */
export async function downloadMedia(_mediaId: string, _accessToken: string): Promise<Buffer> {
  throw new Error("Integração WhatsApp Cloud API ainda não implementada (fase de integrações)");
}
