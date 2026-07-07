import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { TRACKING_CODE_PREFIX, TRACKING_CODE_LENGTH } from "@crm/shared";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Redirecionador de link rastreável: /r/:slug
 * 1. Acha o tracking_link pelo slug
 * 2. Registra o clique (UTMs, fbclid, gclid, referrer, UA) com código único
 * 3. Redireciona pro wa.me com o código injetado no texto da 1ª mensagem
 * Quando a mensagem chegar com o código, o worker casa clique ↔ contato.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const db = createAdminClient();

  const { data: link } = await db
    .from("tracking_links")
    .select("id, org_id, default_text, channels(phone_number)")
    .eq("slug", slug)
    .maybeSingle();

  if (!link) {
    return new NextResponse("Link não encontrado", { status: 404 });
  }

  const channel = link.channels as unknown as { phone_number: string | null };
  if (!channel?.phone_number) {
    return new NextResponse("Canal sem número conectado", { status: 404 });
  }

  const search = req.nextUrl.searchParams;
  const code = generateCode();

  await db.from("clicks").insert({
    org_id: link.org_id,
    tracking_link_id: link.id,
    code,
    utm_source: search.get("utm_source"),
    utm_medium: search.get("utm_medium"),
    utm_campaign: search.get("utm_campaign"),
    utm_content: search.get("utm_content"),
    utm_term: search.get("utm_term"),
    fbclid: search.get("fbclid"),
    gclid: search.get("gclid"),
    referrer: req.headers.get("referer"),
    user_agent: req.headers.get("user-agent"),
  });

  const baseText = link.default_text?.trim() || "Olá! Vim pelo site.";
  const text = `${baseText} ${TRACKING_CODE_PREFIX}${code}`;
  const phone = channel.phone_number.replace(/\D/g, "");
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return NextResponse.redirect(waUrl, 302);
}

function generateCode(): string {
  // alfabeto sem ambiguidade (sem 0/o, 1/l/i)
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(TRACKING_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < TRACKING_CODE_LENGTH; i++) {
    code += alphabet[(bytes[i] ?? 0) % alphabet.length];
  }
  return code;
}
