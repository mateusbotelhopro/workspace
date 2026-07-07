import type { ResolveAdNamesJob } from "@crm/shared";
import { db } from "../lib/supabase";
import { fetchAdHierarchy } from "../integrations/meta/marketing";

/**
 * Resolve nomes de campanha/conjunto/anúncio a partir do ad_id (source_id
 * do referral CTWA) e cacheia em ad_entities.
 */
export async function resolveAdNames(job: ResolveAdNamesJob): Promise<void> {
  const { data: cached } = await db
    .from("ad_entities")
    .select("id, refreshed_at")
    .eq("org_id", job.orgId)
    .eq("ad_id", job.adId)
    .maybeSingle();
  if (cached?.refreshed_at) return; // já resolvido

  const { data: settings } = await db
    .from("integration_settings")
    .select("meta_ads_token_enc")
    .eq("org_id", job.orgId)
    .maybeSingle();
  if (!settings?.meta_ads_token_enc) return; // sem token, fica só o ad_id no relatório

  const hierarchy = await fetchAdHierarchy(job.adId, settings.meta_ads_token_enc);

  await db.from("ad_entities").upsert(
    {
      org_id: job.orgId,
      ad_id: hierarchy.adId,
      ad_name: hierarchy.adName,
      adset_id: hierarchy.adsetId,
      adset_name: hierarchy.adsetName,
      campaign_id: hierarchy.campaignId,
      campaign_name: hierarchy.campaignName,
      ad_account_id: hierarchy.adAccountId,
      refreshed_at: new Date().toISOString(),
    },
    { onConflict: "org_id,ad_id" },
  );
}
