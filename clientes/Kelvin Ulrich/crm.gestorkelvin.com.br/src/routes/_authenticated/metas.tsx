import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMonthlyGoal, saveMonthlyGoalTarget } from "@/lib/goals.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Target, Loader2, RefreshCw, Pencil, Check, PartyPopper } from "lucide-react";
import { buildMonthOptions, currentMonthIso } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/metas")({
  head: () => ({
    meta: [
      { title: "Meta de Fechamento | Gestor Kelvin" },
      { name: "description", content: "Meta mensal de novos clientes fechados." },
    ],
  }),
  component: MetasPage,
});

function MetasPage() {
  const qc = useQueryClient();
  const monthOptions = useState(() => buildMonthOptions())[0];
  const [month, setMonth] = useState(currentMonthIso);
  const fetchGoal = useServerFn(getMonthlyGoal);
  const saveTarget = useServerFn(saveMonthlyGoalTarget);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["monthly-goal", month],
    queryFn: () => fetchGoal({ data: { referenceMonth: month } }),
  });

  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("4");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setTargetInput(String(data.target));
  }, [data]);

  const handleSaveTarget = async () => {
    const value = parseInt(targetInput, 10);
    if (isNaN(value) || value < 1) {
      toast.error("Informe um número válido");
      return;
    }
    setSaving(true);
    try {
      await saveTarget({ data: { referenceMonth: month, target: value } });
      toast.success("Meta atualizada");
      setEditingTarget(false);
      qc.invalidateQueries({ queryKey: ["monthly-goal"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar meta");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando meta...
      </div>
    );
  }
  if (error || !data) {
    return <div className="p-6 text-destructive">Erro ao carregar meta.</div>;
  }

  const progresso = Math.min((data.closedCount / data.target) * 100, 100);
  const atingida = data.closedCount >= data.target;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> Meta de Fechamento
          </h1>
          <p className="text-sm text-muted-foreground">
            Novos clientes fechados no mês, com base na data de início do contrato.
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

      <Card className={atingida ? "border-emerald-500/50" : undefined}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {atingida && <PartyPopper className="h-5 w-5 text-emerald-500" />}
            {data.closedCount} de{" "}
            {editingTarget ? (
              <span className="inline-flex items-center gap-1">
                <Input
                  type="number"
                  min="1"
                  className="h-8 w-20"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                />
                <Button
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSaveTarget}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </Button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                {data.target}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setEditingTarget(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </span>
            )}{" "}
            clientes fechados
          </CardTitle>
          <CardDescription>
            {atingida
              ? "Meta batida neste mês 🎉"
              : `Faltam ${data.target - data.closedCount} para bater a meta`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progresso} className="h-3" />
          <p className="text-xs text-muted-foreground">{progresso.toFixed(0)}% da meta</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clientes fechados neste mês</CardTitle>
          <CardDescription>
            Contabiliza automaticamente todo cliente com início de contrato neste mês.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.closedClients.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhum cliente fechado neste mês ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {data.closedClients.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <Link
                    to="/clientes/$id"
                    params={{ id: c.id }}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {c.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {c.start_date &&
                      new Date(c.start_date + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
