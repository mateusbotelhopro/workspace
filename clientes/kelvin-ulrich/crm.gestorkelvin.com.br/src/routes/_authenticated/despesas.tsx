import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listExpenses, saveExpense, deleteExpense } from "@/lib/expenses.functions";
import { formatBRL as fmtBRL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Receipt, Loader2, Repeat } from "lucide-react";

export const Route = createFileRoute("/_authenticated/despesas")({
  head: () => ({
    meta: [
      { title: "Despesas | Gestor Kelvin" },
      { name: "description", content: "Controle de despesas PJ e PF com recorrência mensal." },
    ],
  }),
  component: DespesasPage,
});

// Categorias reais da operação
const CATEGORIES_PJ = [
  { value: "freelancer_trafego", label: "Freelancer de Tráfego" },
  { value: "comissao_sdr", label: "Comissionamento SDR" },
  { value: "das_mei", label: "DAS MEI / Imposto" },
  { value: "ferramentas", label: "Ferramentas / SaaS" },
  { value: "ads", label: "Verba de Mídia" },
  { value: "contador", label: "Contador" },
  { value: "marketing", label: "Marketing / Conteúdo" },
  { value: "servicos_pj", label: "Serviços PJ" },
  { value: "outros_pj", label: "Outros (PJ)" },
];

const CATEGORIES_PF = [
  { value: "aluguel", label: "Aluguel" },
  { value: "mercado", label: "Mercado / Alimentação" },
  { value: "contas_casa", label: "Contas (Luz, Água, Internet)" },
  { value: "transporte", label: "Transporte / Combustível" },
  { value: "saude", label: "Saúde / Plano" },
  { value: "lazer", label: "Lazer" },
  { value: "educacao", label: "Educação" },
  { value: "outros_pf", label: "Outros (PF)" },
];

const ALL_CATEGORIES = [...CATEGORIES_PJ, ...CATEGORIES_PF];
const labelOf = (v: string) => ALL_CATEGORIES.find((c) => c.value === v)?.label ?? v;

type ExpenseRow = {
  id: string;
  description: string;
  category: string;
  entity_type: "pj" | "pf";
  amount: number;
  expense_date: string;
  is_recurring: boolean;
  recurrence_day: number | null;
  notes: string | null;
};

function DespesasPage() {
  const qc = useQueryClient();
  const list = useServerFn(listExpenses);
  const save = useServerFn(saveExpense);
  const del = useServerFn(deleteExpense);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => list(),
  });

  const [tab, setTab] = useState<"all" | "pj" | "pf">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    description: "",
    category: "freelancer_trafego",
    entity_type: "pj" as "pj" | "pf",
    amount: "",
    expense_date: new Date().toISOString().slice(0, 10),
    is_recurring: false,
    recurrence_day: "",
    notes: "",
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      description: "",
      category: "freelancer_trafego",
      entity_type: "pj",
      amount: "",
      expense_date: new Date().toISOString().slice(0, 10),
      is_recurring: false,
      recurrence_day: "",
      notes: "",
    });
    setOpen(true);
  };

  const openEdit = (e: ExpenseRow) => {
    setEditing(e);
    setForm({
      description: e.description,
      category: e.category,
      entity_type: e.entity_type,
      amount: String(e.amount),
      expense_date: e.expense_date,
      is_recurring: e.is_recurring,
      recurrence_day: e.recurrence_day ? String(e.recurrence_day) : "",
      notes: e.notes ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.description.trim() || !form.amount) {
      toast.error("Preencha descrição e valor");
      return;
    }
    setSaving(true);
    try {
      await save({
        data: {
          id: editing?.id ?? null,
          data: {
            description: form.description.trim(),
            category: form.category,
            entity_type: form.entity_type,
            amount: Number(form.amount),
            expense_date: form.expense_date,
            is_recurring: form.is_recurring,
            recurrence_day:
              form.is_recurring && form.recurrence_day ? Number(form.recurrence_day) : null,
            notes: form.notes.trim() || null,
          },
        },
      });
      toast.success(editing ? "Despesa atualizada" : "Despesa adicionada");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      qc.invalidateQueries({ queryKey: ["painel-financeiro"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await del({ data: { id: deleteId } });
      toast.success("Despesa removida");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      qc.invalidateQueries({ queryKey: ["painel-financeiro"] });
      setDeleteId(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const rows = useMemo(
    () => (expenses as ExpenseRow[]).filter((e) => (tab === "all" ? true : e.entity_type === tab)),
    [expenses, tab],
  );

  const totals = useMemo(() => {
    const pj = (expenses as ExpenseRow[])
      .filter((e) => e.entity_type === "pj")
      .reduce((s, e) => s + Number(e.amount), 0);
    const pf = (expenses as ExpenseRow[])
      .filter((e) => e.entity_type === "pf")
      .reduce((s, e) => s + Number(e.amount), 0);
    const recurring = (expenses as ExpenseRow[])
      .filter((e) => e.is_recurring)
      .reduce((s, e) => s + Number(e.amount), 0);
    return { pj, pf, recurring, total: pj + pf };
  }, [expenses]);

  const categoryOptions = form.entity_type === "pj" ? CATEGORIES_PJ : CATEGORIES_PF;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Despesas
          </h1>
          <p className="text-sm text-muted-foreground">
            Custos PJ (operação) e PF (pessoais), com recorrência mensal
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Nova despesa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar despesa" : "Nova despesa"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Tipo</Label>
                <Tabs
                  value={form.entity_type}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      entity_type: v as "pj" | "pf",
                      category: v === "pj" ? "freelancer_trafego" : "aluguel",
                    })
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pj">PJ — Operação</TabsTrigger>
                    <TabsTrigger value="pf">PF — Pessoal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={
                    form.entity_type === "pj"
                      ? "Ex: Freelancer Tráfego — Outubro"
                      : "Ex: Aluguel apartamento Blumenau"
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.expense_date}
                  onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" /> Despesa recorrente
                  </Label>
                  <p className="text-xs text-muted-foreground">Considerada na previsão mensal</p>
                </div>
                <Switch
                  checked={form.is_recurring}
                  onCheckedChange={(v) => setForm({ ...form, is_recurring: v })}
                />
              </div>
              {form.is_recurring && (
                <div>
                  <Label>Dia do mês (vencimento)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    inputMode="numeric"
                    value={form.recurrence_day}
                    onChange={(e) => setForm({ ...form, recurrence_day: e.target.value })}
                    placeholder="Ex: 5"
                  />
                </div>
              )}
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{fmtBRL(totals.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PJ — Operação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-primary">{fmtBRL(totals.pj)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PF — Pessoal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{fmtBRL(totals.pf)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Recorrentes/mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{fmtBRL(totals.recurring)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Lançamentos</CardTitle>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                Todas
              </TabsTrigger>
              <TabsTrigger value="pj" className="flex-1 sm:flex-none">
                PJ
              </TabsTrigger>
              <TabsTrigger value="pf" className="flex-1 sm:flex-none">
                PF
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Carregando...
            </div>
          ) : rows.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma despesa neste filtro
            </div>
          ) : (
            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead></TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{new Date(e.expense_date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="font-medium">{e.description}</TableCell>
                      <TableCell>
                        <Badge variant={e.entity_type === "pj" ? "default" : "secondary"}>
                          {e.entity_type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{labelOf(e.category)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{fmtBRL(Number(e.amount))}</TableCell>
                      <TableCell>
                        {e.is_recurring && (
                          <Badge variant="outline" className="gap-1">
                            <Repeat className="h-3 w-3" />
                            {e.recurrence_day ? `Dia ${e.recurrence_day}` : "Mensal"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(e)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteId(e.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
