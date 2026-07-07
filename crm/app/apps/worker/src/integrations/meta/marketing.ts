// ════════════════════════════════════════════════════════════
// STUB — Meta Marketing API (integração real entra no final)
// Usos: resolver nomes de anúncio a partir do ad_id (CTWA manda
// source_id) e puxar investimento diário pro ROAS.
// ════════════════════════════════════════════════════════════

export interface AdHierarchy {
  adId: string;
  adName: string;
  adsetId: string;
  adsetName: string;
  campaignId: string;
  campaignName: string;
  adAccountId: string;
}

/**
 * GET /{ad_id}?fields=name,adset{id,name},campaign{id,name},account_id
 */
export async function fetchAdHierarchy(
  _adId: string,
  _accessToken: string,
): Promise<AdHierarchy> {
  throw new Error("Integração Marketing API ainda não implementada (fase de integrações)");
}

export interface AdInsight {
  adId: string;
  date: string; // YYYY-MM-DD
  spendCents: number;
  impressions: number;
  clicks: number;
}

/**
 * GET /act_{ad_account_id}/insights?level=ad&time_range=...
 */
export async function fetchDailyInsights(
  _adAccountId: string,
  _accessToken: string,
  _date: string,
): Promise<AdInsight[]> {
  throw new Error("Integração Marketing API ainda não implementada (fase de integrações)");
}
