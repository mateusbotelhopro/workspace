import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  RefreshCw,
  CheckCircle2,
  Undo2,
  StickyNote,
  Loader2,
  Wallet,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro | Gestor Kelvin" },
      { name: "description", content: "Controle mensal de recebíveis." },
    ],
  }),
  component: FinanceiroPage,
});

type PaymentRow = {
  id: string;
  client_id: string | null;
  reference_month: string;
  amount: number;
  due_date: string;
  paid_at: string | null;
  status: "pending" | "paid" | "overdue";
  notes: string | null;
  description: string | null;
  clients: { name: string } | null;
};

const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
};

const monthLabel = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
};

const buildMonthOptions = () => {
  const out: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = -6; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    out.push({ value, label: monthLabel(value) });
  }
  return out;
};

function FinanceiroPage() {
  const monthOptions = useMemo(buildMonthOptions, []);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteRow, setNoteRow] = useState<PaymentRow | null>(null);
  const [noteText, setNoteText] = useState("");
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryDesc, setEntryDesc] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [entryNotes, setEntryNotes] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);
  const [deleteRow, setDeleteRow] = useState<PaymentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteRow) return;
    setDeleting(true);
    const { error } = await supabase.from("payments").delete().eq("id", deleteRow.id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Removido");
    setDeleteRow(null);
    load();
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select(
        "id, client_id, reference_month, amount, due_date, paid_at, status, notes, description, clients(name)",
      )
      .eq("reference_month", month)
      .order("due_date", { ascending: true });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as unknown as PaymentRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const handleGenerate = async () => {
    setGenerating(true);
    const { data, error } = await supabase.rpc("generate_monthly_payments", {
      _reference_month: month,
    });
    setGenerating(false);
    if (error) return toast.error(error.message);
    const created = Array.isArray(data)
      ? ((data[0] as { created_count: number })?.created_count ?? 0)
      : 0;
    toast.success(
      created > 0
        ? `${created} cobrança(s) criada(s) para ${monthLabel(month)}`
        : `Nenhuma nova cobrança a gerar (${monthLabel(month)})`,
    );
    load();
  };

  const markPaid = async (row: PaymentRow) => {
    const { error } = await supabase
      .from("payments")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Marcado como pago");
    load();
  };

  const undoPaid = async (row: PaymentRow) => {
    const today = new Date().toISOString().slice(0, 10);
    const newStatus = row.due_date < today ? "overdue" : "pending";
    const { error } = await supabase
      .from("payments")
      .update({ status: newStatus, paid_at: null })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Pagamento desfeito");
    load();
  };

  const openNote = (row: PaymentRow) => {
    setNoteRow(row);
    setNoteText(row.notes ?? "");
    setNoteOpen(true);
  };

  const saveNote = async () => {
    if (!noteRow) return;
    const { error } = await supabase
      .from("payments")
      .update({ notes: noteText.trim() || null })
      .eq("id", noteRow.id);
    if (error) return toast.error(error.message);
    toast.success("Observação salva");
    setNoteOpen(false);
    load();
  };

  const addEntry = async () => {
    const amt = Number(entryAmount.replace(",", "."));
    if (!entryDesc.trim()) return toast.error("Informe a descrição");
    if (!amt || amt <= 0) return toast.error("Informe um valor válido");
    setSavingEntry(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setSavingEntry(false);
      return toast.error("Sessão expirada");
    }
    const refMonth = entryDate.slice(0, 7) + "-01";
    const { error } = await supabase.from("payments").insert({
      user_id: uid,
      client_id: null,
      reference_month: refMonth,
      amount: amt,
      due_date: entryDate,
      paid_at: new Date(entryDate + "T12:00:00").toISOString(),
      status: "paid",
      description: entryDesc.trim(),
      notes: entryNotes.trim() || null,
    });
    setSavingEntry(false);
    if (error) return toast.error(error.message);
    toast.success("Entrada adicionada");
    setEntryOpen(false);
    setEntryDesc("");
    setEntryAmount("");
    setEntryNotes("");
    setEntryDate(new Date().toISOString().slice(0, 10));
    if (refMonth === month) load();
    else setMonth(refMonth);
  };

  const totals = useMemo(() => {
    const t = { received: 0, pending: 0, overdue: 0, all: 0 };
    rows.forEach((r) => {
      const v = Number(r.amount);
      t.all += v;
      if (r.status === "paid") t.received += v;
      else if (r.status === "overdue") t.overdue += v;
      else t.pending += v;
    });
    return t;
  }, [rows]);

  const statusBadge = (s: PaymentRow["status"]) => {
    if (s === "paid") return <Badge className="bg-emerald-600 hover:bg-emerald-600">Pago</Badge>;
    if (s === "overdue") return <Badge variant="destructive">Vencido</Badge>;
    return <Badge variant="secondary">Pendente</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Gere e acompanhe os recebíveis de cada mês.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
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
            onClick={handleGenerate}
            disabled={generating}
            className="w-full sm:w-auto"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Gerar cobranças
          </Button>
          <Button onClick={() => setEntryOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar entrada
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total do mês</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(totals.all)}</div>
            <p className="text-xs text-muted-foreground">{rows.length} cobrança(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recebido</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatBRL(totals.received)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">A receber</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(totals.pending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatBRL(totals.overdue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="capitalize">Cobranças — {monthLabel(month)}</CardTitle>
          <CardDescription>
            Use "Gerar cobranças" para criar automaticamente os recebíveis dos clientes ativos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma cobrança neste mês. Clique em "Gerar cobranças".
            </div>
          ) : (
            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pago em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        {r.clients?.name ?? r.description ?? "—"}
                        {!r.clients && r.description && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Avulso
                          </Badge>
                        )}
                        {r.notes && (
                          <span className="ml-2 text-xs text-muted-foreground italic">
                            ({r.notes})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(r.due_date)}</TableCell>
                      <TableCell className="text-right">{formatBRL(Number(r.amount))}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.paid_at ? new Date(r.paid_at).toLocaleDateString("pt-BR") : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {r.status === "paid" ? (
                          <Button variant="ghost" size="sm" onClick={() => undoPaid(r)}>
                            <Undo2 className="h-4 w-4 mr-1" /> Desfazer
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => markPaid(r)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Pago
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openNote(r)}>
                          <StickyNote className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteRow(r)}>
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

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Observação</DialogTitle>
            <DialogDescription>
              {noteRow?.clients?.name} — {noteRow && monthLabel(noteRow.reference_month)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="note">Anotação</Label>
            <Textarea
              id="note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Ex: pagou parcialmente, prometeu pagar dia 15..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNote}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={entryOpen} onOpenChange={setEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar entrada</DialogTitle>
            <DialogDescription>
              Registre um recebimento avulso (freela, venda, extra do dia a dia).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="entry-desc">Descrição *</Label>
              <Input
                id="entry-desc"
                value={entryDesc}
                onChange={(e) => setEntryDesc(e.target.value)}
                placeholder="Ex: Freela landing page Studio X"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="entry-amount">Valor (R$) *</Label>
                <Input
                  id="entry-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="entry-date">Data do recebimento</Label>
                <Input
                  id="entry-date"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-notes">Observação (opcional)</Label>
              <Textarea
                id="entry-notes"
                value={entryNotes}
                onChange={(e) => setEntryNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEntryOpen(false)} disabled={savingEntry}>
              Cancelar
            </Button>
            <Button onClick={addEntry} disabled={savingEntry}>
              {savingEntry && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lançamento?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteRow?.clients?.name ?? deleteRow?.description ?? "Este lançamento"} —{" "}
              {deleteRow && formatBRL(Number(deleteRow.amount))}. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
