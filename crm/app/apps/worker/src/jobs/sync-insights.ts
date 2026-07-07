import type { SyncInsightsJob } from "@crm/shared";

/**
 * Puxa investimento diário (spend por anúncio) da Marketing API pro ROAS.
 * TODO fase de integrações: implementar com fetchDailyInsights + tabela
 * ad_insights (migration futura). Por ora é um no-op registrado.
 */
export async function syncInsights(job: SyncInsightsJob): Promise<void> {
  console.log(`[sync-insights] org=${job.orgId} date=${job.date ?? "ontem"} — pendente de integração`);
}
