"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/inbox", label: "Inbox" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/contatos", label: "Contatos" },
  { href: "/relatorios", label: "Relatórios" },
  { href: "/configuracoes", label: "Configurações" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="px-5 py-5">
        {/* TODO: nome do produto quando definido */}
        <span className="text-lg font-bold text-slate-900">CRM</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 px-5 py-4">
        {/* TODO: seletor de workspace (multi-tenant) + usuário logado */}
        <span className="text-xs text-slate-400">workspace</span>
      </div>
    </aside>
  );
}
