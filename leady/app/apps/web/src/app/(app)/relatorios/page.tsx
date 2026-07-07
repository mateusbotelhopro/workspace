import { Placeholder } from "@/components/placeholder";

/**
 * Relatórios — o "Tintim" do produto.
 * Fonte: attributions + leads + capi_events + insights (spend).
 */
export default function RelatoriosPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-slate-900">Relatórios</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Placeholder
          title="Tráfego por anúncio"
          items={[
            "Campanha → conjunto → anúncio",
            "Investimento, conversas, leads, vendas, receita",
            "CPL, custo por venda, ROAS real",
          ]}
        />
        <Placeholder
          title="Funil"
          items={[
            "Conversão etapa a etapa",
            "Tempo médio por etapa",
            "Motivos de perda",
          ]}
        />
        <Placeholder
          title="Atendimento"
          items={[
            "Conversas por atendente",
            "Tempo de primeira resposta",
            "Vendas por atendente",
          ]}
        />
        <Placeholder
          title="Eventos CAPI"
          items={[
            "Log de envios pro Meta",
            "Status (enviado/falhou) e match quality",
            "Filtro por evento e período",
          ]}
        />
      </div>
    </div>
  );
}
