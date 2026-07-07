import type { OutboundMessageJob } from "@leady/shared";
import { db } from "../lib/supabase";
import { sendTextMessage } from "../integrations/meta/whatsapp";

/**
 * Envia mensagem de saída (linha já criada em `messages` com status pendente).
 */
export async function sendOutboundMessage(job: OutboundMessageJob): Promise<void> {
  const { data: message } = await db
    .from("messages")
    .select("id, org_id, body, conversation_id, conversations(contact_id, contacts(phone))")
    .eq("id", job.messageId)
    .single();
  if (!message || message.org_id !== job.orgId || !message.body) return;

  const { data: channel } = await db
    .from("channels")
    .select("phone_number_id, access_token_enc")
    .eq("id", job.channelId)
    .single();
  if (!channel?.phone_number_id || !channel.access_token_enc) {
    await db.from("messages").update({ status: "falhou" }).eq("id", message.id);
    return;
  }

  const conversation = message.conversations as unknown as {
    contacts: { phone: string };
  };

  try {
    const result = await sendTextMessage({
      phoneNumberId: channel.phone_number_id,
      accessToken: channel.access_token_enc, // TODO descriptografar na fase de integrações
      to: conversation.contacts.phone.replace(/\D/g, ""),
      body: message.body,
    });
    await db
      .from("messages")
      .update({ wamid: result.wamid, status: "enviada" })
      .eq("id", message.id);
  } catch (err) {
    await db.from("messages").update({ status: "falhou" }).eq("id", message.id);
    throw err;
  }
}
