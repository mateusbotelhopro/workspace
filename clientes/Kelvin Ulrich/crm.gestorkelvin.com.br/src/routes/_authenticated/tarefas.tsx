import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Calendar,
  RotateCw,
  Archive,
  ChevronDown,
  Undo2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/tarefas")({
  head: () => ({
    meta: [
      { title: "Tarefas | Gestor Kelvin" },
      { name: "description", content: "Kanban de tarefas por cliente." },
    ],
  }),
  component: TasksPage,
});

type Status = "todo" | "doing" | "done";
type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  due_date: string | null;
  updated_at: string;
  clients: { name: string } | null;
};

type Client = { id: string; name: string };

type FormData = {
  title: string;
  description: string;
  client_id: string;
  status: Status;
  priority: Priority;
  due_date: string;
};

const emptyForm: FormData = {
  title: "",
  description: "",
  client_id: "",
  status: "todo",
  priority: "medium",
  due_date: "",
};

const COLUMNS: { id: Status; title: string; tone: string }[] = [
  { id: "todo", title: "A fazer", tone: "bg-slate-500/10" },
  { id: "doing", title: "Em andamento", tone: "bg-slate-400/15" },
  { id: "done", title: "Concluído", tone: "bg-emerald-500/15" },
];

const isOverdue = (iso: string | null, status: Status) => {
  if (!iso || status === "done") return false;
  const [y, m, d] = iso.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

const NO_CLIENT = "__none__";

const priorityBadge = (p: Priority) => {
  if (p === "high") return <Badge variant="destructive">Alta</Badge>;
  if (p === "low")
    return (
      <Badge variant="secondary" className="text-xs">
        Baixa
      </Badge>
    );
  return <Badge className="text-xs">Média</Badge>;
};

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
};

// Tarefa concluída fora do mês corrente sai do quadro e vai pro arquivo,
// senão "Concluído" acumula pra sempre e vira uma bagunça (pedido do Kelvin).
const isDoneThisMonth = (updatedAt: string) => {
  const d = new Date(updatedAt);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

function TasksPage() {
  const qc = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [tasksRes, clientsRes] = await Promise.all([
      supabase
        .from("tasks")
        .select(
          "id, client_id, title, description, status, priority, due_date, updated_at, clients(name)",
        )
        .order("created_at", { ascending: false }),
      supabase.from("clients").select("id, name").order("name"),
    ]);
    if (tasksRes.error) toast.error(tasksRes.error.message);
    else setTasks((tasksRes.data ?? []) as unknown as Task[]);
    if (clientsRes.error) toast.error(clientsRes.error.message);
    else setClients((clientsRes.data ?? []) as Client[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      filterClient === "all"
        ? tasks
        : filterClient === NO_CLIENT
          ? tasks.filter((t) => !t.client_id)
          : tasks.filter((t) => t.client_id === filterClient),
    [tasks, filterClient],
  );

  const byStatus = (s: Status) =>
    filtered.filter((t) => t.status === s && (s !== "done" || isDoneThisMonth(t.updated_at)));

  const archivedTasks = useMemo(
    () => filtered.filter((t) => t.status === "done" && !isDoneThisMonth(t.updated_at)),
    [filtered],
  );
  const [archivedOpen, setArchivedOpen] = useState(false);

  const openNew = (status: Status = "todo") => {
    setEditing(null);
    setForm({ ...emptyForm, status });
    setDialogOpen(true);
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? "",
      client_id: t.client_id ?? "",
      status: t.status,
      priority: t.priority,
      due_date: t.due_date ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Título obrigatório");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      client_id: form.client_id || null,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
    };
    if (editing) {
      const { error } = await supabase.from("tasks").update(payload).eq("id", editing.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      toast.success("Tarefa atualizada");
    } else {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("Sessão expirada");
        setSaving(false);
        return;
      }
      const { error } = await supabase.from("tasks").insert({ ...payload, user_id: u.user.id });
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      toast.success("Tarefa criada");
    }
    setSaving(false);
    setDialogOpen(false);
    qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
    load();
  };

  const moveTask = async (t: Task, dir: -1 | 1) => {
    const order: Status[] = ["todo", "doing", "done"];
    const idx = order.indexOf(t.status);
    const next = order[idx + dir];
    if (!next) return;
    const { error } = await supabase.from("tasks").update({ status: next }).eq("id", t.id);
    if (error) return toast.error(error.message);
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("tasks").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Tarefa removida");
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      load();
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Organize as entregas e otimizações de cada cliente.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filtrar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              <SelectItem value={NO_CLIENT}>Sem cliente</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
              load();
            }}
            disabled={loading}
            title="Atualizar dados"
          >
            <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => openNew()} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Nova tarefa
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = byStatus(col.id);
            return (
              <div key={col.id} className="space-y-3">
                <div
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${col.tone}`}
                >
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{col.title}</h2>
                    <Badge variant="secondary" className="text-xs">
                      {items.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openNew(col.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
                      Nada por aqui
                    </p>
                  ) : (
                    items.map((t) => (
                      <Card key={t.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm font-medium leading-tight">
                              {t.title}
                            </CardTitle>
                            {priorityBadge(t.priority)}
                          </div>
                          {t.clients?.name && (
                            <p className="text-xs text-muted-foreground">{t.clients.name}</p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {t.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {t.description}
                            </p>
                          )}
                          {t.due_date && (
                            <div
                              className={`flex items-center gap-1 text-xs ${
                                isOverdue(t.due_date, t.status)
                                  ? "text-red-600 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              {formatDate(t.due_date)}
                              {isOverdue(t.due_date, t.status) && <span>· Atrasada</span>}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1 border-t">
                            <div className="flex gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={t.status === "todo"}
                                onClick={() => moveTask(t, -1)}
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={t.status === "done"}
                                onClick={() => moveTask(t, 1)}
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="flex gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => openEdit(t)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setDeleteId(t.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {archivedTasks.length > 0 && (
        <Collapsible open={archivedOpen} onOpenChange={setArchivedOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer select-none flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  Arquivadas
                  <Badge variant="secondary" className="text-xs">
                    {archivedTasks.length}
                  </Badge>
                </CardTitle>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${archivedOpen ? "rotate-180" : ""}`}
                />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground pb-1">
                  Tarefas concluídas em meses anteriores saem do quadro automaticamente e ficam
                  aqui.
                </p>
                {archivedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 py-2 border-b last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.clients?.name ? `${t.clients.name} · ` : ""}
                        Concluída em {new Date(t.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Reabrir tarefa"
                        onClick={() => moveTask(t, -1)}
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeleteId(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
            <DialogDescription>
              {editing ? "Atualize os detalhes." : "Adicione uma nova entrega ao quadro."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Criar 3 criativos novos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Descrição</Label>
              <Textarea
                id="desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detalhes, briefing, links..."
              />
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={form.client_id || NO_CLIENT}
                onValueChange={(v) => setForm({ ...form, client_id: v === NO_CLIENT ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CLIENT}>Sem cliente</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as Status })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">A fazer</SelectItem>
                    <SelectItem value="doing">Em andamento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due">Entrega</Label>
                <Input
                  id="due"
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover tarefa?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
