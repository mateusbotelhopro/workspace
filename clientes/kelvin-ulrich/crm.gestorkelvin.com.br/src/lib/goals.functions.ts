import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

const DEFAULT_TARGET = 4;

export const getMonthlyGoal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        referenceMonth: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const monthStart = data.referenceMonth
      ? startOfMonth(new Date(data.referenceMonth + "T00:00:00"))
      : startOfMonth(new Date());
    const nextMonth = addMonths(monthStart, 1);
    const monthStartStr = ymd(monthStart);

    const [goalRes, clientsRes] = await Promise.all([
      supabase.from("client_goals").select("target").eq("month_start", monthStartStr).maybeSingle(),
      supabase
        .from("clients")
        .select("id, name, start_date")
        .gte("start_date", monthStartStr)
        .lt("start_date", ymd(nextMonth))
        .order("start_date", { ascending: true }),
    ]);

    if (clientsRes.error) throw new Error(clientsRes.error.message);

    const target = goalRes.data?.target ?? DEFAULT_TARGET;
    const closedClients = clientsRes.data ?? [];

    return {
      monthStart: monthStartStr,
      target,
      closedCount: closedClients.length,
      closedClients,
    };
  });

export const saveMonthlyGoalTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        referenceMonth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        target: z.number().int().min(1).max(999),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const monthStart = ymd(startOfMonth(new Date(data.referenceMonth + "T00:00:00")));
    const { error } = await supabase
      .from("client_goals")
      .upsert(
        { user_id: userId, month_start: monthStart, target: data.target },
        { onConflict: "user_id,month_start" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
