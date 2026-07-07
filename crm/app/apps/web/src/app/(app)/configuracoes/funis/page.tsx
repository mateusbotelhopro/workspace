import { Placeholder } from "@/components/placeholder";

export default function FunisPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Funis e etapas</h1>
      <Placeholder
        title="Configuração de funil"
        items={[
          "Etapas com nome, cor e ordem",
          "Marcar etapa de entrada, ganho e perda",
          "Mapeamento etapa → evento CAPI (Lead / QualifiedLead / Purchase)",
          "Motivos de perda",
        ]}
      />
    </div>
  );
}
