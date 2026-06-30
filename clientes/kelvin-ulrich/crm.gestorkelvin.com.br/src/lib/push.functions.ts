import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import webpush from "web-push";
import { VAPID_PUBLIC_KEY, VAPID_SUBJECT } from "./push-config";

function configureWebPush() {
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!priv) throw new Error("VAPID_PRIVATE_KEY não configurada");
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, priv);
}

const SubInput = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
  user_agent: z.string().max(500).optional().nullable(),
});

export const savePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => SubInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // upsert manual: deleta existente com mesmo endpoint, insere
    await supabase.from("push_subscriptions").delete().eq("endpoint", data.endpoint);
    const { error } = await supabase.from("push_subscriptions").insert({
      user_id: userId,
      endpoint: data.endpoint,
      p256dh: data.p256dh,
      auth: data.auth,
      user_agent: data.user_agent ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendTestPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    configureWebPush();
    const { data: subs, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    if (!subs || subs.length === 0) {
      return { sent: 0, message: "Nenhum dispositivo inscrito" };
    }
    let sent = 0;
    for (const s of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({
            title: "Gestor Kelvin",
            body: "Notificações ativas! ✅",
            url: "/dashboard",
          }),
        );
        sent++;
      } catch (e: unknown) {
        const err = e as { statusCode?: number };
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabaseAdmin.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    }
    return { sent, message: `Push enviado para ${sent} dispositivo(s)` };
  });

export const getPushStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { count } = await supabase
      .from("push_subscriptions")
      .select("*", { count: "exact", head: true });
    return { devices: count ?? 0 };
  });
