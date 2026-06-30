import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/lib/dashboard.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/previsao")({
  head: () => ({
    meta: [
      { title: "Previsão | Gestor Kelvin" },
      { name: "description", content: "Previsibilidade de receita, despesas e lucro." },
    ],
  }),
  component: PrevisaoPage,
});

const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function PrevisaoPage() {
  const fetchOverview = useServerFn(getDashboardOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchOverview(),
  });

  if (isLoading || !data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Carregando...
      </div>
    );
  }

  const combined = [
    ...data.series.map((s) => ({
      month: s.month,
      receita: s.revenue,
      despesa: s.expense,
      lucro: s.revenue - s.expense,
      tipo: "Realizado",
    })),
    ...data.forecast.map((f) => ({
      month: f.month,
      receita: f.revenue,
      despesa: f.expense,
      lucro: f.profit,
      tipo: "Previsto",
    })),
  ];

  const totalForecastRevenue = data.forecast.reduce((s, f) => s + f.revenue, 0);
  const totalForecastExpense = data.forecast.reduce((s, f) => s + f.expense, 0);
  const totalForecastProfit = data.forecast.reduce((s, f) => s + f.profit, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> Previsibilidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Projeção baseada nos contratos ativos e despesas recorrentes
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">MRR ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{fmtBRL(data.kpis.activeMRR)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Receita prevista (3m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-emerald-500">
              {fmtBRL(totalForecastRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Despesa prevista (3m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-rose-500">
              {fmtBRL(totalForecastExpense)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lucro previsto (3m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-primary">{fmtBRL(totalForecastProfit)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência: realizado + previsto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combined}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(v: number) => fmtBRL(v)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="despesa" stroke="#f43f5e" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos 3 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Receita prevista</TableHead>
                  <TableHead className="text-right">Despesa recorrente</TableHead>
                  <TableHead className="text-right">Lucro esperado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.forecast.map((f) => (
                  <TableRow key={f.month}>
                    <TableCell className="font-medium">{f.month}</TableCell>
                    <TableCell className="text-right text-emerald-500">
                      {fmtBRL(f.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-rose-500">{fmtBRL(f.expense)}</TableCell>
                    <TableCell className="text-right font-semibold">{fmtBRL(f.profit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
