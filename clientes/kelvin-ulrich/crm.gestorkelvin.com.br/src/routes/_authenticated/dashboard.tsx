import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/lib/dashboard.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Loader2,
  CheckSquare,
  Users,
  ArrowRight,
  Activity,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { PushNotificationsCard } from "@/components/push-notifications-card";
import { formatBRL as fmtBRL, buildMonthOptions, currentMonthIso } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Gestor Kelvin" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const monthOptions = useState(() => buildMonthOptions())[0];
  const [month, setMonth] = useState(currentMonthIso);
  const fetchOverview = useServerFn(getDashboardOverview);
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["dashboard-overview", month],
    queryFn: () => fetchOverview({ data: { referenceMonth: month } }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando painel...
      </div>
    );
  }
  if (error || !data) {
    return <div className="text-destructive">Erro ao carregar dashboard.</div>;
  }

  const {
    kpis,
    series,
    forecast,
    overdueCount,
    overdueAmount,
    dueSoonCount,
    dueSoonAmount,
    tasks,
    activities,
    topClients,
  } = data;
  const profitColor = kpis.monthProfit >= 0 ? "text-emerald-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Visão geral</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Tudo que importa do seu negócio em uma tela.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-[200px] capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((m) => (
                <SelectItem key={m.value} value={m.value} className="capitalize">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Atualizar dados"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <PushNotificationsCard />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Faturamento do mês"
          value={fmtBRL(kpis.monthRevenue)}
          icon={<Wallet className="h-4 w-4" />}
          accent="text-emerald-500"
        />
        <KpiCard
          title="A receber este mês"
          value={fmtBRL(kpis.monthReceivable)}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="text-primary"
        />
        <KpiCard
          title="Despesas do mês"
          value={fmtBRL(kpis.monthExpenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          accent="text-red-500"
        />
        <KpiCard
          title="Lucro líquido"
          value={fmtBRL(kpis.monthProfit)}
          icon={<Activity className="h-4 w-4" />}
          accent={profitColor}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs despesa</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-56 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(v: number) => fmtBRL(v)}
                />
                <Legend />
                <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Despesa" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previsão dos próximos 3 meses</CardTitle>
            <CardDescription>Baseado em contratos ativos e despesas recorrentes</CardDescription>
          </CardHeader>
          <CardContent className="h-56 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(v: number) => fmtBRL(v)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Receita prevista"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Lucro previsto"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Inadimplência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{fmtBRL(overdueAmount)}</div>
            <p className="text-xs text-muted-foreground">{overdueCount} cobrança(s) vencida(s)</p>
            <Button asChild variant="link" size="sm" className="px-0 mt-2 text-red-500">
              <Link to="/financeiro">
                Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtBRL(dueSoonAmount)}</div>
            <p className="text-xs text-muted-foreground">{dueSoonCount} cobrança(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              MRR contratado: {fmtBRL(kpis.activeMRR)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks + Top clients */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tarefas críticas
            </CardTitle>
            <CardDescription>Pendentes e em andamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Sem tarefas pendentes 🎉
              </p>
            ) : (
              tasks.slice(0, 6).map((t) => {
                const isOverdue = t.due_date && t.due_date < new Date().toISOString().slice(0, 10);
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${isOverdue ? "text-red-500" : ""}`}
                      >
                        {t.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.due_date
                          ? `Vence ${new Date(t.due_date).toLocaleDateString("pt-BR")}`
                          : "Sem prazo"}
                        {isOverdue && " · Atrasada"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={t.status === "in_progress" ? "bg-slate-400/15" : ""}
                    >
                      {t.status === "in_progress" ? "Em andamento" : "Pendente"}
                    </Badge>
                  </div>
                );
              })
            )}
            <Button asChild variant="link" size="sm" className="px-0">
              <Link to="/tarefas">
                Ver todas <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top clientes por receita</CardTitle>
            <CardDescription>Total recebido até hoje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nenhuma receita ainda.
              </p>
            ) : (
              topClients.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-muted-foreground w-5">#{i + 1}</span>
                    <Link
                      to="/clientes/$id"
                      params={{ id: c.id }}
                      className="text-sm font-medium hover:text-primary truncate"
                    >
                      {c.name}
                    </Link>
                  </div>
                  <span className="text-sm font-semibold text-emerald-500">{fmtBRL(c.total)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Atividade recente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhuma atividade ainda.
            </p>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 py-2 border-b last:border-0 text-sm"
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{a.title}</p>
                  {a.description && (
                    <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(a.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className={accent}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
