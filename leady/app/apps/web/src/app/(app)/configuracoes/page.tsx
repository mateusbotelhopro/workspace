import Link from "next/link";

const secoes = [
  { href: "/configuracoes/canais", title: "Canais", desc: "Números de WhatsApp conectados (Cloud API)" },
  { href: "/configuracoes/funis", title: "Funis e etapas", desc: "Pipelines, etapas e mapeamento etapa → evento CAPI" },
  { href: "/configuracoes/links", title: "Links rastreáveis", desc: "Links /r/:slug pra bio, site e criativos" },
  { href: "/configuracoes/integracoes", title: "Integrações Meta", desc: "Pixel/dataset, token CAPI e conta de anúncio" },
  { href: "/configuracoes/equipe", title: "Equipe", desc: "Usuários, papéis e distribuição de conversas" },
];

export default function ConfiguracoesPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Configurações</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {secoes.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="font-semibold text-slate-900">{s.title}</p>
            <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
