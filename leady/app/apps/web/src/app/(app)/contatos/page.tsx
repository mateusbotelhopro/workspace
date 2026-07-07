import { Placeholder } from "@/components/placeholder";

export default function ContatosPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Contatos</h1>
      <Placeholder
        title="Lista de contatos"
        items={[
          "Busca por nome, telefone, tag, campo customizado",
          "Origem da primeira conversa",
          "Histórico de leads do contato",
          "Exportação CSV",
        ]}
      />
    </div>
  );
}
