import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPainelFinanceiro } from "@/lib/painel-financeiro.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  User,
  Target,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { formatBRL as fmtBRL, buildMonthOptions, currentMonthIso } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/painel-financeiro")({
  head: () => ({
    meta: [
      { title: "Painel Financeiro | Gestor Kelvin" },
      { name: "description", content: "Visão executiva PF/PJ." },
    ],
  }),
  component: PainelFinanceiro,
});

const META_FATURAMENTO = 11500;

function PainelFinanceiro() {
  const [tab, setTab] = useState<"pj" | "pf">("pj");
  const monthOptions = useState(() => buildMonthOptions())[0];
  const [month, setMonth] = useState(currentMonthIso);
  const fetchData = useServerFn(getPainelFinanceiro);
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["painel-financeiro", month],
    queryFn: () => fetchData({ data: { referenceMonth: month } }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando painel...
      </div>
    );
  }
  if (error || !data) {
    return <div className="p-6 text-destructive">Erro ao carregar painel.</div>;
  }

  const stats = {
    pagos: data.pagos,
    aReceber: data.aReceber,
    totalPJ: data.totalPJ,
    totalPF: data.totalPF,
    despesasTotal: data.despesasTotal,
    saldo: data.saldo,
  };
  const ENTRADAS_MES = data.entradasMes;
  const SAIDAS_PJ = data.saidasPJ;
  const SAIDAS_PF = data.saidasPF;
  const EVOLUCAO = data.evolucao;

  const donutData = [
    { name: "Pagos", value: stats.pagos, color: "#005aff" },
    { name: "Inadimplentes", value: stats.aReceber, color: "#3aa1ff" },
  ];

  const progresso = Math.min((stats.pagos / META_FATURAMENTO) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> Painel Financeiro
          </h1>
          <p className="text-sm text-muted-foreground">Visão consolidada PJ + PF</p>
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

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-xs text-muted-foreground font-normal">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-semibold ${stats.saldo >= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {fmtBRL(stats.saldo)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/40">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-xs text-muted-foreground font-normal">
              Faturamento <span className="text-primary">(meta {fmtBRL(META_FATURAMENTO)})</span>
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{fmtBRL(stats.pagos)}</div>
            <Progress value={progresso} className="h-2" />
            <p className="text-xs text-muted-foreground">{progresso.toFixed(0)}% da meta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-xs text-muted-foreground font-normal">A Receber</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-accent">{fmtBRL(stats.aReceber)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {ENTRADAS_MES.filter((e) => e.status === "inadimplente").length} inadimplentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-xs text-muted-foreground font-normal">
              Despesas Totais
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-rose-500">
              {fmtBRL(stats.despesasTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              PJ {fmtBRL(stats.totalPJ)} · PF {fmtBRL(stats.totalPF)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donut + Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entradas: Pagos vs Inadimplentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {donutData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                    formatter={(v: number) => fmtBRL(v)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Evolução: Faturamento × Lucro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EVOLUCAO}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="mes" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "#161616",
                      border: "1px solid rgba(58,161,255,0.25)",
                    }}
                    formatter={(v: number) => fmtBRL(v)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="faturamento"
                    stroke="#005aff"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saídas PJ/PF */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-500" /> Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "pj" | "pf")}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="pj" className="flex-1 sm:flex-none">
                <Building2 className="h-4 w-4 sm:mr-2" />{" "}
                <span className="hidden sm:inline">PJ Operacional</span>
                <span className="sm:hidden ml-1">PJ</span>
              </TabsTrigger>
              <TabsTrigger value="pf" className="flex-1 sm:flex-none">
                <User className="h-4 w-4 sm:mr-2" />{" "}
                <span className="hidden sm:inline">PF Pessoal</span>
                <span className="sm:hidden ml-1">PF</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pj" className="space-y-2 mt-4">
              {SAIDAS_PJ.map((s) => (
                <div
                  key={s.categoria}
                  className="flex items-center justify-between p-3 rounded-md border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      PJ
                    </Badge>
                    <span className="font-medium">{s.categoria}</span>
                  </div>
                  <span className="font-semibold text-rose-500">{fmtBRL(s.valor)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-md bg-secondary mt-3">
                <span className="font-semibold">Total PJ</span>
                <span className="font-semibold">{fmtBRL(stats.totalPJ)}</span>
              </div>
            </TabsContent>

            <TabsContent value="pf" className="space-y-2 mt-4">
              {SAIDAS_PF.map((s) => (
                <div
                  key={s.categoria}
                  className="flex items-center justify-between p-3 rounded-md border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-accent/40 text-accent">
                      PF
                    </Badge>
                    <span className="font-medium">{s.categoria}</span>
                  </div>
                  <span className="font-semibold text-rose-500">{fmtBRL(s.valor)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-md bg-secondary mt-3">
                <span className="font-semibold">Total PF</span>
                <span className="font-semibold">{fmtBRL(stats.totalPF)}</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
