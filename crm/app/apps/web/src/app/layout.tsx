import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM — Tráfego + WhatsApp",
  description: "CRM com atribuição de tráfego pago e eventos pro Meta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
