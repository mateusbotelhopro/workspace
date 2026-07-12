import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import webpush from "web-push";
import { normalizeVapidPrivateKey, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from "@/lib/push-config";

type Sub = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

async function sendToUser(
  userId: string,
  payload: { title: string; body: string; url?: string; tag?: string },
) {
  const { data: subs } = await supabaseAdmin
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);
  if (!subs || subs.length === 0) return 0;
  let sent = 0;
  for (const s of subs as Sub[]) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
      );
      sent++;
    } catch (e: unknown) {
      const err = e as { statusCode?: number };
      if (err.statusCode === 404 || err.statusCode === 410) {
        await supabaseAdmin.from("push_subscriptions").delete().eq("id", s.id);
      }
    }
  }
  return sent;
}

export const Route = createFileRoute("/api/public/cron/notify-daily")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Auth via apikey (anon) — pg_cron envia esse header.
        const apikey = request.headers.get("apikey") || request.headers.get("x-apikey");
        if (!apikey || apikey !== process.env.SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Unauthorized", { status: 401 });
        }

        const priv = normalizeVapidPrivateKey(process.env.VAPID_PRIVATE_KEY);
        webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, priv);

        const today = new Date().toISOString().slice(0, 10);
        const in3 = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

        // Coleta por usuário
        type Bucket = { overdue: number; due3: number; contracts30: number; tasksLate: number };
        const byUser = new Map<string, Bucket>();
        const bump = (uid: string, key: keyof Bucket) => {
          const b = byUser.get(uid) ?? { overdue: 0, due3: 0, contracts30: 0, tasksLate: 0 };
          b[key]++;
          byUser.set(uid, b);
        };

        const errors: string[] = [];

        // Cobranças vencidas (status pending/overdue, due_date < hoje)
        const { data: overdue, error: e1 } = await supabaseAdmin
          .from("payments")
          .select("user_id")
          .in("status", ["pending", "overdue"])
          .lt("due_date", today);
        if (e1) errors.push(`overdue: ${e1.message}`);
        overdue?.forEach((p) => bump(p.user_id, "overdue"));

        // Cobranças vencendo nos próximos 3 dias
        const { data: due3, error: e2 } = await supabaseAdmin
          .from("payments")
          .select("user_id")
          .in("status", ["pending", "overdue"])
          .gte("due_date", today)
          .lte("due_date", in3);
        if (e2) errors.push(`due3: ${e2.message}`);
        due3?.forEach((p) => bump(p.user_id, "due3"));

        // Contratos vencendo em ~30 dias (start_date + contract_months entre hoje e +30)
        const { data: clients, error: e3 } = await supabaseAdmin
          .from("clients")
          .select("user_id, start_date, contract_months, status")
          .eq("status", "active")
          .not("start_date", "is", null)
          .not("contract_months", "is", null);
        if (e3) errors.push(`clients: ${e3.message}`);
        const now = new Date();
        clients?.forEach((c) => {
          if (!c.start_date || !c.contract_months) return;
          const end = new Date(c.start_date);
          end.setMonth(end.getMonth() + c.contract_months);
          const diff = (end.getTime() - now.getTime()) / 86400000;
          if (diff >= 0 && diff <= 30) bump(c.user_id, "contracts30");
        });

        // Tarefas atrasadas
        const { data: tasksLate, error: e4 } = await supabaseAdmin
          .from("tasks")
          .select("user_id")
          .neq("status", "done")
          .lt("due_date", today);
        if (e4) errors.push(`tasksLate: ${e4.message}`);
        tasksLate?.forEach((t) => bump(t.user_id, "tasksLate"));

        if (errors.length) console.error("[cron notify-daily] errors:", errors);

        let totalSent = 0;
        for (const [userId, b] of byUser.entries()) {
          const parts: string[] = [];
          if (b.overdue) parts.push(`${b.overdue} cobrança(s) vencida(s)`);
          if (b.due3) parts.push(`${b.due3} vence(m) em 3 dias`);
          if (b.contracts30) parts.push(`${b.contracts30} contrato(s) vencendo em 30 dias`);
          if (b.tasksLate) parts.push(`${b.tasksLate} tarefa(s) atrasada(s)`);
          if (parts.length === 0) continue;
          totalSent += await sendToUser(userId, {
            title: "Resumo do dia — Gestor Kelvin",
            body: parts.join(" • "),
            url: "/dashboard",
            tag: "daily-summary",
          });
        }

        return Response.json({ ok: errors.length === 0, users: byUser.size, sent: totalSent, errors });
      },
    },
  },
});
