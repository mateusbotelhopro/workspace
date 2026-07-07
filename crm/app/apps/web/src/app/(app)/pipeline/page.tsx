import { Placeholder } from "@/components/placeholder";

/**
 * Pipeline — kanban de leads por funil.
 * Mover card pra etapa mapeada dispara evento CAPI (via server action
 * que atualiza stage_id e enfileira capi-event quando configurado).
 */
export default function PipelinePage() {
  const etapas = ["Novo lead", "Em conversa", "Qualificado", "Proposta", "Vendido"];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Pipeline</h1>
        <span className="text-sm text-slate-500">seletor de funil + filtros</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {etapas.map((etapa) => (
          <div key={etapa} className="w-64 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-slate-700">{etapa}</span>
              <span className="text-xs text-slate-400">R$ 0</span>
            </div>
            <Placeholder
              title="Cards"
              items={["Contato + valor", "Origem do tráfego", "Responsável", "Drag-and-drop"]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
