import { Placeholder } from "@/components/placeholder";

export default function CanaisPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Canais</h1>
      <Placeholder
        title="Números de WhatsApp"
        items={[
          "Conectar via Cloud API (token + phone_number_id; embedded signup na Fase 3)",
          "Status da conexão + alerta de queda",
          "Vários números por workspace",
        ]}
      />
    </div>
  );
}
