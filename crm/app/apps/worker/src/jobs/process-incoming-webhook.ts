import type { IncomingWebhookJob } from "@crm/shared";
import { TRACKING_CODE_PREFIX, TRACKING_CODE_LENGTH, CAPI_EVENTS } from "@crm/shared";
import type { CtwaReferral } from "@crm/shared";
import { db } from "../lib/supabase";
import { enqueueCapiEvent, enqueueResolveAdNames } from "../queues";

/**
 * Processa o payload bruto do webhook da Cloud API.
 * Fluxo: identifica canal → upsert contato → upsert conversa → grava mensagem
 * → resolve atribuição (CTWA referral > código de link > direto)
 * → cria lead na etapa de entrada se não existir lead aberto
 * → enfileira evento Lead pro CAPI.
 */
export async function processIncomingWebhook(job: IncomingWebhookJob): Promise<void> {
  const body = job.payload as WebhookBody;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const value = change.value;

      // statuses (entregue/lida/falhou) de mensagens enviadas
      for (const status of value.statuses ?? []) {
        await db
          .from("messages")
          .update({ status: mapStatus(status.status) })
          .eq("wamid", status.id);
      }

      // mensagens recebidas
      for (const msg of value.messages ?? []) {
        await handleInboundMessage(value, msg);
      }
    }
  }
}

async function handleInboundMessage(value: WebhookValue, msg: WebhookMessage): Promise<void> {
  // 1. canal pelo phone_number_id
  const { data: channel } = await db
    .from("channels")
    .select("id, org_id")
    .eq("phone_number_id", value.metadata.phone_number_id)
    .single();
  if (!channel) {
    console.warn(`Canal não encontrado pro phone_number_id ${value.metadata.phone_number_id}`);
    return;
  }
  const orgId = channel.org_id;

  // 2. contato
  const profileName = value.contacts?.[0]?.profile?.name ?? null;
  const { data: contact } = await db
    .from("contacts")
    .upsert(
      { org_id: orgId, phone: msg.from, name: profileName },
      { onConflict: "org_id,phone", ignoreDuplicates: false },
    )
    .select("id")
    .single();
  if (!contact) return;

  // 3. conversa aberta (ou cria)
  let conversationId: string;
  const { data: existing } = await db
    .from("conversations")
    .select("id")
    .eq("org_id", orgId)
    .eq("contact_id", contact.id)
    .eq("channel_id", channel.id)
    .neq("status", "resolvida")
    .maybeSingle();

  if (existing) {
    conversationId = existing.id;
  } else {
    const { data: created } = await db
      .from("conversations")
      .insert({ org_id: orgId, channel_id: channel.id, contact_id: contact.id })
      .select("id")
      .single();
    if (!created) return;
    conversationId = created.id;
  }

  const now = new Date().toISOString();
  await db
    .from("conversations")
    .update({ last_inbound_at: now, last_message_at: now })
    .eq("id", conversationId);

  // 4. mensagem (wamid é unique: reentrega do webhook não duplica)
  const bodyText = msg.text?.body ?? null;
  await db.from("messages").insert({
    org_id: orgId,
    conversation_id: conversationId,
    direction: "entrada",
    type: msg.type === "text" ? "texto" : "desconhecido",
    body: bodyText,
    wamid: msg.id,
    status: "entregue",
    meta: msg as unknown as Record<string, unknown>,
  });

  // 5. atribuição — só na primeira interação relevante
  const isFirstMessage = !existing;
  if (isFirstMessage) {
    await resolveAttribution(orgId, contact.id, msg.referral ?? null, bodyText);
  }

  // 6. lead aberto (ou cria na etapa de entrada do funil default)
  await ensureOpenLead(orgId, contact.id);
}

async function resolveAttribution(
  orgId: string,
  contactId: string,
  referral: CtwaReferral | null,
  bodyText: string | null,
): Promise<void> {
  // a) anúncio CTWA: referral vem no webhook
  if (referral?.source_id) {
    await db.from("attributions").insert({
      org_id: orgId,
      contact_id: contactId,
      type: "ctwa",
      confidence: "exata",
      ctwa_clid: referral.ctwa_clid ?? null,
      ad_id: referral.source_id,
      raw_referral: referral as unknown as Record<string, unknown>,
    });
    await enqueueResolveAdNames({ orgId, adId: referral.source_id });
    return;
  }

  // b) código de link rastreável no texto (ex: "#a1b2c3")
  const code = extractTrackingCode(bodyText);
  if (code) {
    const { data: click } = await db
      .from("clicks")
      .select("id, utm_source, utm_medium, utm_campaign, utm_content, fbclid, gclid")
      .eq("org_id", orgId)
      .eq("code", code)
      .maybeSingle();
    if (click) {
      await db.from("clicks").update({ matched_contact_id: contactId }).eq("id", click.id);
      await db.from("attributions").insert({
        org_id: orgId,
        contact_id: contactId,
        type: "link",
        confidence: "exata",
        click_id: click.id,
        utm_source: click.utm_source,
        utm_medium: click.utm_medium,
        utm_campaign: click.utm_campaign,
        utm_content: click.utm_content,
        fbclid: click.fbclid,
        gclid: click.gclid,
      });
      return;
    }
  }

  // c) TODO fallback heurístico: clique recente sem match dentro de
  //    CLICK_MATCH_WINDOW_MINUTES → atribuição "provavel"

  // d) sem rastro: direto
  await db.from("attributions").insert({
    org_id: orgId,
    contact_id: contactId,
    type: "direto",
    confidence: "exata",
  });
}

async function ensureOpenLead(orgId: string, contactId: string): Promise<void> {
  const { data: openLead } = await db
    .from("leads")
    .select("id")
    .eq("org_id", orgId)
    .eq("contact_id", contactId)
    .eq("status", "aberto")
    .maybeSingle();
  if (openLead) return;

  const { data: pipeline } = await db
    .from("pipelines")
    .select("id")
    .eq("org_id", orgId)
    .eq("is_default", true)
    .maybeSingle();
  if (!pipeline) return;

  const { data: entryStage } = await db
    .from("stages")
    .select("id, capi_event_name")
    .eq("pipeline_id", pipeline.id)
    .eq("is_entry", true)
    .maybeSingle();
  if (!entryStage) return;

  const { data: lead } = await db
    .from("leads")
    .insert({
      org_id: orgId,
      contact_id: contactId,
      pipeline_id: pipeline.id,
      stage_id: entryStage.id,
    })
    .select("id")
    .single();
  if (!lead) return;

  // vincula atribuição mais recente do contato ao lead
  const { data: attribution } = await db
    .from("attributions")
    .select("id")
    .eq("contact_id", contactId)
    .is("lead_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (attribution) {
    await db.from("attributions").update({ lead_id: lead.id }).eq("id", attribution.id);
  }

  // etapa de entrada mapeada → evento Lead pro Meta
  if (entryStage.capi_event_name === CAPI_EVENTS.LEAD) {
    const eventId = `lead_${lead.id}`;
    const { data: capiRow } = await db
      .from("capi_events")
      .insert({
        org_id: orgId,
        lead_id: lead.id,
        event_name: CAPI_EVENTS.LEAD,
        event_id: eventId,
        payload: {}, // montado (com hash) pelo job send-capi-event
      })
      .select("id")
      .single();
    if (capiRow) await enqueueCapiEvent({ orgId, capiEventId: capiRow.id });
  }
}

function extractTrackingCode(text: string | null): string | null {
  if (!text) return null;
  const pattern = new RegExp(
    `\\${TRACKING_CODE_PREFIX}([a-z0-9]{${TRACKING_CODE_LENGTH}})\\b`,
    "i",
  );
  return text.match(pattern)?.[1]?.toLowerCase() ?? null;
}

function mapStatus(s: string): string {
  const map: Record<string, string> = {
    sent: "enviada",
    delivered: "entregue",
    read: "lida",
    failed: "falhou",
  };
  return map[s] ?? "enviada";
}

// ── Tipos do payload do webhook (parcial, só o que usamos) ──

interface WebhookBody {
  entry?: Array<{
    changes?: Array<{ field: string; value: WebhookValue }>;
  }>;
}

interface WebhookValue {
  metadata: { phone_number_id: string; display_phone_number: string };
  contacts?: Array<{ wa_id: string; profile?: { name?: string } }>;
  messages?: WebhookMessage[];
  statuses?: Array<{ id: string; status: string; recipient_id: string }>;
}

interface WebhookMessage {
  id: string; // wamid
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  referral?: CtwaReferral;
}
