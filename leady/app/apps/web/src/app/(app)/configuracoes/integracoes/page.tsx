import { Placeholder } from "@/components/placeholder";

export default function IntegracoesPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Integrações Meta</h1>
      <Placeholder
        title="Configuração por workspace (só admin)"
        items={[
          "Pixel/Dataset ID + token da Conversions API",
          "Conta de anúncio + token da Marketing API",
          "Teste de envio de evento (Test Events do Gerenciador)",
          "Google Ads na Fase 3",
        ]}
      />
    </div>
  );
}
