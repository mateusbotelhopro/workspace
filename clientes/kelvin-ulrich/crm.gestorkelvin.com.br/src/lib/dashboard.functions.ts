import { createServerFn } from "@tanstack/react-start";
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

export const getDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date();
    const monthStart = startOfMonth(today);
    const nextMonth = addMonths(monthStart, 1);
    const sixMonthsAgo = addMonths(monthStart, -5);

    const [paymentsRes, expensesRes, clientsRes, tasksRes, activitiesRes] = await Promise.all([
      supabase
        .from("payments")
        .select("id, amount, status, due_date, paid_at, client_id, reference_month")
        .gte("reference_month", ymd(sixMonthsAgo)),
      supabase
        .from("expenses")
        .select("id, amount, expense_date, category, is_recurring")
        .gte("expense_date", ymd(sixMonthsAgo)),
      supabase.from("clients").select("id, name, contract_value, status").eq("status", "active"),
      supabase
        .from("tasks")
        .select("id, title, due_date, status, priority")
        .neq("status", "done")
        .order("due_date", { ascending: true })
        .limit(10),
      supabase
        .from("activities")
        .select("id, title, description, event_type, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const payments = paymentsRes.data ?? [];
    const expenses = expensesRes.data ?? [];
    const clients = clientsRes.data ?? [];

    const inMonth = (date: string) => date >= ymd(monthStart) && date < ymd(nextMonth);

    const monthRevenue = payments
      .filter((p) => p.status === "paid" && p.paid_at && inMonth(p.paid_at.slice(0, 10)))
      .reduce((s, p) => s + Number(p.amount), 0);

    const monthReceivable = payments
      .filter(
        (p) => (p.status === "pending" || p.status === "overdue") && inMonth(p.reference_month),
      )
      .reduce((s, p) => s + Number(p.amount), 0);

    const monthExpenses = expenses
      .filter((e) => inMonth(e.expense_date))
      .reduce((s, e) => s + Number(e.amount), 0);

    const monthProfit = monthRevenue - monthExpenses;

    // 6-month series
    const series: { month: string; revenue: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = addMonths(monthStart, -i);
      const next = addMonths(m, 1);
      const label = m.toLocaleDateString("pt-BR", { month: "short" });
      const rev = payments
        .filter(
          (p) =>
            p.status === "paid" &&
            p.paid_at &&
            p.paid_at.slice(0, 10) >= ymd(m) &&
            p.paid_at.slice(0, 10) < ymd(next),
        )
        .reduce((s, p) => s + Number(p.amount), 0);
      const exp = expenses
        .filter((e) => e.expense_date >= ymd(m) && e.expense_date < ymd(next))
        .reduce((s, e) => s + Number(e.amount), 0);
      series.push({ month: label, revenue: rev, expense: exp });
    }

    // Forecast next 3 months from active contracts + recurring expenses
    const activeMRR = clients.reduce((s, c) => s + Number(c.contract_value), 0);
    const recurringExpense = expenses
      .filter((e) => e.is_recurring)
      .reduce((sum, e, _i, arr) => sum + Number(e.amount) / Math.max(arr.length, 1), 0);
    // simpler: use unique recurring monthly average
    const recurringTotal = expenses
      .filter((e) => e.is_recurring && inMonth(e.expense_date))
      .reduce((s, e) => s + Number(e.amount), 0);

    const forecast = [0, 1, 2].map((i) => {
      const m = addMonths(monthStart, i + 1);
      return {
        month: m.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
        revenue: activeMRR,
        expense: recurringTotal,
        profit: activeMRR - recurringTotal,
      };
    });

    // Overdue / coming due
    const todayStr = ymd(today);
    const in7 = ymd(new Date(today.getTime() + 7 * 86400000));
    const overdue = payments.filter((p) => p.status !== "paid" && p.due_date < todayStr);
    const dueSoon = payments.filter(
      (p) => p.status !== "paid" && p.due_date >= todayStr && p.due_date <= in7,
    );

    // Top clients
    const revenueByClient = new Map<string, number>();
    payments
      .filter((p) => p.status === "paid" && p.client_id)
      .forEach((p) =>
        revenueByClient.set(
          p.client_id as string,
          (revenueByClient.get(p.client_id as string) ?? 0) + Number(p.amount),
        ),
      );
    const topClients = clients
      .map((c) => ({ id: c.id, name: c.name, total: revenueByClient.get(c.id) ?? 0 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      kpis: {
        monthRevenue,
        monthReceivable,
        monthExpenses,
        monthProfit,
        activeClients: clients.length,
        activeMRR,
      },
      series,
      forecast,
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((s, p) => s + Number(p.amount), 0),
      dueSoonCount: dueSoon.length,
      dueSoonAmount: dueSoon.reduce((s, p) => s + Number(p.amount), 0),
      tasks: tasksRes.data ?? [],
      activities: activitiesRes.data ?? [],
      topClients,
    };
  });
