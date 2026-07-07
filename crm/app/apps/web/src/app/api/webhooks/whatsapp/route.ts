import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { enqueueIncomingWebhook } from "@/lib/queue";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

/**
 * GET — verificação do webhook (feita uma vez, ao cadastrar no painel da Meta).
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token === serverEnv.metaWebhookVerifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * POST — eventos do WhatsApp (mensagens, statuses).
 * Regra de ouro: validar assinatura, enfileirar e responder 200 rápido.
 * Todo o processamento pesado acontece no worker.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!isValidSignature(rawBody, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  await enqueueIncomingWebhook({ payload, receivedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}

function isValidSignature(rawBody: string, header: string | null): boolean {
  // Sem app secret configurado (dev local), aceita sem validar.
  if (!serverEnv.metaAppSecret) return true;
  if (!header?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", serverEnv.metaAppSecret).update(rawBody).digest("hex");
  const received = header.slice("sha256=".length);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
}
