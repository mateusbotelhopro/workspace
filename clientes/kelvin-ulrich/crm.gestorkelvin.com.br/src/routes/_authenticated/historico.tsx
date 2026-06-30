import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  UserPlus,
  UserMinus,
  RefreshCw,
  Receipt,
  CheckCircle2,
  ListTodo,
  ArrowRightLeft,
  History,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/historico")({
  component: HistoricoPage,
});

type Activity = {
  id: string;
  entity_type: string;
  entity_id: string | null;
  event_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const EVENT_META: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  client_created: { icon: UserPlus, color: "bg-emerald-500/10 text-emerald-600", label: "Cliente" },
  client_deleted: { icon: UserMinus, color: "bg-red-500/10 text-red-600", label: "Cliente" },
  client_status_changed: {
    icon: RefreshCw,
    color: "bg-blue-500/10 text-blue-600",
    label: "Cliente",
  },
  payment_created: { icon: Receipt, color: "bg-amber-500/10 text-amber-600", label: "Financeiro" },
  payment_received: {
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-600",
    label: "Financeiro",
  },
  payment_status_changed: {
    icon: ArrowRightLeft,
    color: "bg-blue-500/10 text-blue-600",
    label: "Financeiro",
  },
  task_created: { icon: ListTodo, color: "bg-violet-500/10 text-violet-600", label: "Tarefa" },
  task_completed: {
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-600",
    label: "Tarefa",
  },
  task_status_changed: {
    icon: ArrowRightLeft,
    color: "bg-blue-500/10 text-blue-600",
    label: "Tarefa",
  },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function groupByDay(items: Activity[]) {
  const groups = new Map<string, Activity[]>();
  for (const item of items) {
    const day = new Date(item.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(item);
  }
  return Array.from(groups.entries());
}

function HistoricoPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    else setActivities((data ?? []) as Activity[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return activities;
    return activities.filter((a) => a.entity_type === filter);
  }, [activities, filter]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <History className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Histórico de Atividades
          </h1>
          <p className="text-sm text-muted-foreground">Linha do tempo dos eventos do seu painel.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as atividades</SelectItem>
              <SelectItem value="client">Clientes</SelectItem>
              <SelectItem value="payment">Financeiro</SelectItem>
              <SelectItem value="task">Tarefas</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Carregando...
          </CardContent>
        </Card>
      ) : grouped.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma atividade ainda. Crie clientes, pagamentos ou tarefas para ver o histórico aqui.
          </CardContent>
        </Card>
      ) : (
        grouped.map(([day, items]) => (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => {
                const meta = EVENT_META[item.event_type] ?? {
                  icon: History,
                  color: "bg-muted text-foreground",
                  label: item.entity_type,
                };
                const Icon = meta.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{item.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {meta.label}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDateTime(item.created_at).split(" ")[1]}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
