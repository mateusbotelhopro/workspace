export type NormalizedUnipileMessage = {
  unipileMessageId: string;
  texto: string;
  leadName?: string;
  linkedinProfileUrl?: string;
  unipileChatId?: string;
  direction: string;
  receivedAt: Date;
};

function cleanName(value: any): string | undefined {
  if (!value) return undefined;
  const name = String(value).trim();
  if (!name) return undefined;
  if (name.startsWith('ACo') || name.startsWith('ACw')) return undefined;
  if (name.length > 80) return undefined;
  return name;
}

export function normalizeUnipileMessage(payload: any): NormalizedUnipileMessage {
  const unipileMessageId =
    payload?.message_id || payload?.id || payload?.message?.id ||
    payload?.data?.message_id || payload?.data?.id || `manual-${Date.now()}`;

  const texto =
    payload?.text || payload?.message?.text || payload?.data?.text ||
    payload?.data?.message || '';

  const leadName =
    cleanName(payload?.lead_name) || cleanName(payload?.sender_name) ||
    cleanName(payload?.sender?.name) || cleanName(payload?.from?.name) ||
    cleanName(payload?.data?.lead_name) || cleanName(payload?.data?.sender_name) ||
    cleanName(payload?.data?.sender?.name) || cleanName(payload?.data?.from?.name) ||
    undefined;

  const linkedinProfileUrl =
    payload?.linkedin_profile_url || payload?.profile_url ||
    payload?.sender?.linkedin_profile_url || payload?.sender?.profile_url ||
    payload?.data?.linkedin_profile_url || payload?.data?.sender?.profile_url ||
    undefined;

  const unipileChatId =
    payload?.chat_id || payload?.conversation_id || payload?.message?.chat_id ||
    payload?.data?.chat_id || payload?.data?.conversation_id || undefined;

  const direction =
    payload?.direction || payload?.message?.direction || payload?.data?.direction || 'inbound';

  const receivedAtRaw =
    payload?.received_at || payload?.timestamp || payload?.message?.timestamp ||
    payload?.data?.received_at || payload?.data?.timestamp || null;

  return {
    unipileMessageId: String(unipileMessageId),
    texto: String(texto),
    leadName,
    linkedinProfileUrl,
    unipileChatId,
    direction: String(direction),
    receivedAt: receivedAtRaw ? new Date(receivedAtRaw) : new Date(),
  };
}
