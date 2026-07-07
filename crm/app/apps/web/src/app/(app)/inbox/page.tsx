import { Placeholder } from "@/components/placeholder";

/**
 * Inbox — atendimento WhatsApp em tempo real.
 * Layout alvo: 3 colunas (lista de conversas | conversa | painel do lead).
 * Realtime via Supabase Realtime na tabela messages.
 */
export default function InboxPage() {
  return (
    <div className="flex h-full">
      <section className="w-80 shrink-0 border-r border-slate-200 bg-white p-4">
        <h1 className="mb-4 text-base font-bold text-slate-900">Conversas</h1>
        <Placeholder
          title="Lista de conversas"
          items={[
            "Filtros: status, atendente, tag, funil",
            "Badge de não lidas",
            "Indicador de origem (campanha/anúncio)",
            "Estado da janela de 24h",
          ]}
        />
      </section>
      <section className="flex-1 p-4">
        <Placeholder
          title="Conversa"
          items={[
            "Mensagens (texto, áudio, imagem, doc)",
            "Notas internas (não vão pro cliente)",
            "Mensagens rápidas (/atalho)",
            "Envio de template fora da janela de 24h",
          ]}
        />
      </section>
      <section className="w-72 shrink-0 border-l border-slate-200 bg-white p-4">
        <Placeholder
          title="Painel do lead"
          items={[
            "Origem: campanha → conjunto → anúncio",
            "Etapa do funil + valor",
            "Campos customizados e tags",
            "Tarefas / follow-up",
          ]}
        />
      </section>
    </div>
  );
}
