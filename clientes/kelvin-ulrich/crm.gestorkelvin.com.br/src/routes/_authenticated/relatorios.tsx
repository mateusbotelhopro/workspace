import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, DollarSign, Users, Target } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | Gestor Kelvin" },
      { name: "description", content: "Visão analítica da operação." },
    ],
  }),
  component: ReportsPage,
});

type Payment = {
  id: string;
  client_id: string;
  reference_month: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  paid_at: string | null;
  clients: { name: string } | null;
};

type Task = { status: "todo" | "doing" | "done"; updated_at: string };

const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const formatBRLShort = (v: number) => {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
  return `R$ ${v.toFixed(0)}`;
};

const monthShort = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });
};

function ReportsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeClients, setActiveClients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // últimos 12 meses
      const start = new Date();
      start.setMonth(start.getMonth() - 11);
      start.setDate(1);
      const startIso = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-01`;

      const [pRes, tRes, cRes] = await Promise.all([
        supabase
          .from("payments")
          .select("id, client_id, reference_month, amount, status, paid_at, clients(name)")
          .gte("reference_month", startIso),
        supabase.from("tasks").select("status, updated_at"),
        supabase
          .from("clients")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
      ]);
      if (pRes.data) setPayments(pRes.data as unknown as Payment[]);
      if (tRes.data) setTasks(tRes.data as unknown as Task[]);
      setActiveClients(cRes.count ?? 0);
      setLoading(false);
    };
    load();
  }, []);

  // Série mensal: recebido x a receber x vencido
  const monthlySeries = useMemo(() => {
    const now = new Date();
    const buckets: Record<
      string,
      { month: string; recebido: number; pendente: number; vencido: number }
    > = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
      buckets[key] = { month: monthShort(key), recebido: 0, pendente: 0, vencido: 0 };
    }
    payments.forEach((p) => {
      const b = buckets[p.reference_month];
      if (!b) return;
      const v = Number(p.amount);
      if (p.status === "paid") b.recebido += v;
      else if (p.status === "overdue") b.vencido += v;
      else b.pendente += v;
    });
    return Object.values(buckets);
  }, [payments]);

  // Status do mês atual (pie)
  const currentMonthIso = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }, []);

  const statusPie = useMemo(() => {
    const cur = payments.filter((p) => p.reference_month === currentMonthIso);
    const acc = { Pago: 0, Pendente: 0, Vencido: 0 };
    cur.forEach((p) => {
      const v = Number(p.amount);
      if (p.status === "paid") acc.Pago += v;
      else if (p.status === "overdue") acc.Vencido += v;
      else acc.Pendente += v;
    });
    return [
      { name: "Pago", value: acc.Pago, color: "hsl(var(--chart-1, 142 76% 36%))" },
      { name: "Pendente", value: acc.Pendente, color: "hsl(var(--chart-2, 220 14% 60%))" },
      { name: "Vencido", value: acc.Vencido, color: "hsl(var(--chart-3, 0 72% 51%))" },
    ].filter((s) => s.value > 0);
  }, [payments, currentMonthIso]);

  // Top 5 clientes por receita acumulada (paga)
  const topClients = useMemo(() => {
    const map = new Map<string, { name: string; total: number }>();
    payments
      .filter((p) => p.status === "paid")
      .forEach((p) => {
        const name = p.clients?.name ?? "Sem nome";
        const cur = map.get(p.client_id) ?? { name, total: 0 };
        cur.total += Number(p.amount);
        map.set(p.client_id, cur);
      });
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [payments]);

  // Tarefas
  const taskStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    let doneThisMonth = 0;
    const status = { todo: 0, doing: 0, done: 0 };
    tasks.forEach((t) => {
      status[t.status]++;
      if (t.status === "done" && new Date(t.updated_at) >= monthStart) doneThisMonth++;
    });
    return { ...status, doneThisMonth, total: tasks.length };
  }, [tasks]);

  // KPIs
  const kpis = useMemo(() => {
    const cur = payments.filter((p) => p.reference_month === currentMonthIso);
    const received = cur
      .filter((p) => p.status === "paid")
      .reduce((s, p) => s + Number(p.amount), 0);
    const expected = cur.reduce((s, p) => s + Number(p.amount), 0);
    const last3 = monthlySeries.slice(-3);
    const avg = last3.length ? last3.reduce((s, m) => s + m.recebido, 0) / last3.length : 0;
    return { received, expected, avg };
  }, [payments, currentMonthIso, monthlySeries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando relatórios...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Visão analítica dos últimos 12 meses da operação.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Clientes ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recebido (mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatBRL(kpis.received)}</div>
            <p className="text-xs text-muted-foreground">de {formatBRL(kpis.expected)} previstos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Média 3 meses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(kpis.avg)}</div>
            <p className="text-xs text-muted-foreground">recebimento mensal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tarefas concluídas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.doneThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.doing} em andamento · {taskStats.todo} pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita mensal</CardTitle>
            <CardDescription>Recebido x pendente x vencido — últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatBRLShort}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="recebido" stackId="a" fill="#10b981" name="Recebido" />
                <Bar dataKey="pendente" stackId="a" fill="#94a3b8" name="Pendente" />
                <Bar dataKey="vencido" stackId="a" fill="#ef4444" name="Vencido" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência de recebimentos</CardTitle>
            <CardDescription>Evolução do valor recebido por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatBRLShort}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="recebido"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Recebido"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do mês atual</CardTitle>
            <CardDescription>Distribuição das cobranças do mês</CardDescription>
          </CardHeader>
          <CardContent>
            {statusPie.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma cobrança neste mês.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusPie.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatBRL(v)}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 clientes</CardTitle>
            <CardDescription>Receita acumulada (12 meses)</CardDescription>
          </CardHeader>
          <CardContent>
            {topClients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Sem pagamentos registrados ainda.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topClients} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    tickFormatter={formatBRLShort}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v: number) => formatBRL(v)}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    name="Recebido"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
