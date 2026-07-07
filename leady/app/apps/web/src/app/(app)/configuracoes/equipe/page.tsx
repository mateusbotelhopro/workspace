import { Placeholder } from "@/components/placeholder";

export default function EquipePage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Equipe</h1>
      <Placeholder
        title="Usuários do workspace"
        items={[
          "Convidar por e-mail",
          "Papéis: admin, gestor, atendente",
          "Distribuição automática de conversas (round-robin, Fase 2)",
        ]}
      />
    </div>
  );
}
