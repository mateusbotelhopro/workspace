import type { AutomationJob } from "@leady/shared";
import { db } from "../lib/supabase";

interface AutomationAction {
  type: "enviar_mensagem" | "marcar_tag" | "atribuir" | "criar_tarefa" | "webhook" | "evento_capi";
  [key: string]: unknown;
}

/**
 * Executa as ações de uma automação pra um lead (disparo por etapa ou inatividade).
 * Estrutura pronta; ações implementadas na Fase 2 do roadmap.
 */
export async function runAutomation(job: AutomationJob): Promise<void> {
  const { data: automation } = await db
    .from("automations")
    .select("id, org_id, actions, active")
    .eq("id", job.automationId)
    .single();
  if (!automation || !automation.active || automation.org_id !== job.orgId) return;

  const actions = (automation.actions ?? []) as AutomationAction[];
  for (const action of actions) {
    switch (action.type) {
      case "enviar_mensagem":
      case "marcar_tag":
      case "atribuir":
      case "criar_tarefa":
      case "webhook":
      case "evento_capi":
        console.log(`[automation] ação ${action.type} pendente de implementação (Fase 2)`);
        break;
    }
  }
}
