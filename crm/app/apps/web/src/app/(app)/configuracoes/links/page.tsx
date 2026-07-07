import { Placeholder } from "@/components/placeholder";

export default function LinksPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Links rastreáveis</h1>
      <Placeholder
        title="Links /r/:slug"
        items={[
          "Criar link com canal, texto padrão e slug",
          "Cliques registrados (UTM, fbclid, gclid)",
          "Taxa de match clique → conversa",
        ]}
      />
    </div>
  );
}
