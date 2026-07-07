import { createHash } from "node:crypto";
import type { CapiEventJob } from "@leady/shared";
import { db } from "../lib/supabase";
import { sendCapiEvents, type CapiEventPayload } from "../integrations/meta/capi";

/**
 * Monta o payload final (hash de dados pessoais + parâmetros de match)
 * e envia pro Conversions API. Retry fica por conta do BullMQ.
 */
export async function sendCapiEventJob(job: CapiEventJob): Promise<void> {
  const { data: event } = await db
    .from("capi_events")
    .select("id, org_id, lead_id, event_name, event_id, attempts")
    .eq("id", job.capiEventId)
    .single();
  if (!event || event.org_id !== job.orgId) return;

  const { data: settings } = await db
    .from("integration_settings")
    .select("meta_dataset_id, meta_capi_token_enc")
    .eq("org_id", event.org_id)
    .maybeSingle();
  if (!settings?.meta_dataset_id || !settings.meta_capi_token_enc) {
    await db
      .from("capi_events")
      .update({ status: "falhou", error: "CAPI não configurada no workspace" })
      .eq("id", event.id);
    return;
  }

  // dados do lead + contato + atribuição pro match
  const { data: lead } = await db
    .from("leads")
    .select("id, value_cents, currency, contact_id, contacts(phone, name)")
    .eq("id", event.lead_id)
    .single();
  if (!lead) return;

  const contact = lead.contacts as unknown as { phone: string; name: string | null };

  const { data: attribution } = await db
    .from("attributions")
    .select("ctwa_clid, fbclid")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload: CapiEventPayload = {
    event_name: event.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event.event_id,
    action_source: "chat",
    user_data: {
      ph: [sha256(normalizePhone(contact.phone))],
      ...(contact.name ? { fn: [sha256(firstName(contact.name))] } : {}),
      external_id: [sha256(lead.contact_id)],
      ...(attribution?.ctwa_clid ? { ctwa_clid: attribution.ctwa_clid } : {}),
      ...(attribution?.fbclid ? { fbc: toFbc(attribution.fbclid) } : {}),
    },
    ...(event.event_name === "Purchase" && lead.value_cents != null
      ? {
          custom_data: {
            value: lead.value_cents / 100,
            currency: lead.currency ?? "BRL",
          },
        }
      : {}),
  };

  await db
    .from("capi_events")
    .update({ payload, attempts: event.attempts + 1 })
    .eq("id", event.id);

  try {
    // TODO fase de integrações: descriptografar token (hoje coluna *_enc é placeholder)
    const result = await sendCapiEvents(settings.meta_dataset_id, settings.meta_capi_token_enc, [
      payload,
    ]);
    await db
      .from("capi_events")
      .update({ status: "enviado", response: result, sent_at: new Date().toISOString() })
      .eq("id", event.id);
  } catch (err) {
    await db
      .from("capi_events")
      .update({ status: "falhou", error: err instanceof Error ? err.message : String(err) })
      .eq("id", event.id);
    throw err; // deixa o BullMQ agendar retry
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Meta espera telefone só com dígitos, com DDI, sem '+' */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function firstName(name: string): string {
  return name.split(/\s+/)[0] ?? name;
}

/** fbc no formato fb.1.{timestamp_ms}.{fbclid} */
function toFbc(fbclid: string): string {
  return `fb.1.${Date.now()}.${fbclid}`;
}
