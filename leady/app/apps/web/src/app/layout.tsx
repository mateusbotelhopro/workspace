import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leady",
  description:
    "CRM de tráfego pago + WhatsApp: atribuição por anúncio e eventos de conversão pro Meta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
