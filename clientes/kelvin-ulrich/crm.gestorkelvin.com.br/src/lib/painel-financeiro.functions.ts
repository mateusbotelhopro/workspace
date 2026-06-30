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

export const getPainelFinanceiro = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const today = new Date();
    const monthStart = startOfMonth(today);
    const nextMonth = addMonths(monthStart, 1);
    const sixMonthsAgo = addMonths(monthStart, -5);

    const [paymentsRes, expensesRes] = await Promise.all([
      supabase
        .from("payments")
        .select("id, amount, status, due_date, paid_at, client_id, reference_month, clients(name)")
        .gte("reference_month", ymd(sixMonthsAgo)),
      supabase
        .from("expenses")
        .select("id, amount, expense_date, category, description, entity_type")
        .gte("expense_date", ymd(sixMonthsAgo)),
    ]);

    type PaymentRow = {
      id: string;
      amount: string | number;
      status: string;
      reference_month: string;
      paid_at: string | null;
      client_id: string | null;
      clients: { name: string } | null;
    };
    type ExpenseRow = {
      id: string;
      amount: string | number;
      expense_date: string;
      category: string | null;
      description: string | null;
      entity_type: string | null;
    };
    const payments = (paymentsRes.data ?? []) as PaymentRow[];
    const expenses = (expensesRes.data ?? []) as ExpenseRow[];

    const inMonth = (date: string) => date >= ymd(monthStart) && date < ymd(nextMonth);

    const entradasMes = payments
      .filter((p) => inMonth(p.reference_month))
      .map((p) => ({
        cliente: p.clients?.name ?? "—",
        valor: Number(p.amount),
        status: p.status === "paid" ? "pago" : "inadimplente",
      }));

    const pagos = entradasMes.filter((e) => e.status === "pago").reduce((s, e) => s + e.valor, 0);
    const aReceber = entradasMes
      .filter((e) => e.status === "inadimplente")
      .reduce((s, e) => s + e.valor, 0);

    // Group expenses of the current month by category, separated by entity_type
    const expensesMonth = expenses.filter((e) => inMonth(e.expense_date));

    const groupByCategory = (entity: "pj" | "pf") => {
      const map = new Map<string, number>();
      expensesMonth
        .filter((e) => e.entity_type === entity)
        .forEach((e) => {
          const key = e.category || "outros";
          map.set(key, (map.get(key) ?? 0) + Number(e.amount));
        });
      return Array.from(map.entries())
        .map(([categoria, valor]) => ({ categoria, valor }))
        .sort((a, b) => b.valor - a.valor);
    };

    const saidasPJ = groupByCategory("pj");
    const saidasPF = groupByCategory("pf");
    const totalPJ = saidasPJ.reduce((s, e) => s + e.valor, 0);
    const totalPF = saidasPF.reduce((s, e) => s + e.valor, 0);

    // 6-month evolution
    const evolucao: { mes: string; faturamento: number; lucro: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = addMonths(monthStart, -i);
      const next = addMonths(m, 1);
      const label = m.toLocaleDateString("pt-BR", { month: "short" });
      const fat = payments
        .filter(
          (p) =>
            p.status === "paid" &&
            p.paid_at &&
            p.paid_at.slice(0, 10) >= ymd(m) &&
            p.paid_at.slice(0, 10) < ymd(next),
        )
        .reduce((s, p) => s + Number(p.amount), 0);
      const desp = expenses
        .filter((e) => e.expense_date >= ymd(m) && e.expense_date < ymd(next))
        .reduce((s, e) => s + Number(e.amount), 0);
      evolucao.push({ mes: label, faturamento: fat, lucro: fat - desp });
    }

    return {
      entradasMes,
      pagos,
      aReceber,
      saidasPJ,
      saidasPF,
      totalPJ,
      totalPF,
      despesasTotal: totalPJ + totalPF,
      saldo: pagos - (totalPJ + totalPF),
      evolucao,
    };
  });
