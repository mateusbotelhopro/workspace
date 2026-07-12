import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { deleteClient } from "@/lib/clients.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, ExternalLink, Loader2, Search, AlertTriangle, Trash2, RotateCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatBRL as fmtBRL } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({ meta: [{ title: "Clientes | Gestor Kelvin" }] }),
  component: ClientsPage,
});

type Client = {
  id: string;
  name: string;
  trade_name: string | null;
  document: string | null;
  client_type: string;
  phone: string | null;
  email: string | null;
  contract_value: number;
  due_day: number;
  status: "active" | "inactive";
  start_date: string | null;
  contract_months: number | null;
};

function contractInfo(start: string | null, months: number | null) {
  if (!start || !months) return null;
  const startD = new Date(start + "T00:00:00");
  const end = new Date(startD);
  end.setMonth(end.getMonth() + months);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  return { end, daysLeft };
}

function ClientsPage() {
  const qc = useQueryClient();
  const removeClient = useServerFn(deleteClient);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    trade_name: "",
    document: "",
    client_type: "pj",
    phone: "",
    email: "",
    contract_value: "",
    due_day: "10",
    status: "active",
    start_date: new Date().toISOString().slice(0, 10),
    contract_months: "12",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select(
        "id, name, trade_name, document, client_type, phone, email, contract_value, due_day, status, start_date, contract_months",
      )
      .order("name");
    if (error) toast.error(error.message);
    else setClients((data ?? []) as Client[]);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error("Nome obrigatório");
    const value = parseFloat(form.contract_value.replace(",", ".") || "0");
    const day = parseInt(form.due_day, 10);
    if (isNaN(day) || day < 1 || day > 31) return toast.error("Dia inválido");
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setSaving(false);
      return toast.error("Sessão expirada");
    }
    const { error } = await supabase.from("clients").insert({
      user_id: u.user.id,
      name: form.name.trim(),
      trade_name: form.trade_name.trim() || null,
      document: form.document.trim() || null,
      client_type: form.client_type,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      contract_value: value,
      due_day: day,
      status: form.status,
      start_date: form.start_date || null,
      contract_months: form.contract_months ? parseInt(form.contract_months, 10) : null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cliente cadastrado");
    qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
    qc.invalidateQueries({ queryKey: ["painel-financeiro"] });
    qc.invalidateQueries({ queryKey: ["monthly-goal"] });
    setOpen(false);
    setForm({
      name: "",
      trade_name: "",
      document: "",
      client_type: "pj",
      phone: "",
      email: "",
      contract_value: "",
      due_day: "10",
      status: "active",
      start_date: new Date().toISOString().slice(0, 10),
      contract_months: "12",
    });
    load();
  };

  const handleDelete = async (clientId: string) => {
    try {
      await removeClient({ data: { clientId } });
      toast.success("Cliente excluído");
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      qc.invalidateQueries({ queryKey: ["painel-financeiro"] });
      qc.invalidateQueries({ queryKey: ["monthly-goal"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir cliente");
    }
  };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.trade_name?.toLowerCase().includes(q) ?? false) ||
      (c.document?.toLowerCase().includes(q) ?? false)
    );
  });

  const expiring = clients
    .map((c) => ({ c, info: contractInfo(c.start_date, c.contract_months) }))
    .filter((x) => x.c.status === "active" && x.info && x.info.daysLeft <= 30);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Carteira completa com cadastro 360º.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
              qc.invalidateQueries({ queryKey: ["painel-financeiro"] });
              load();
            }}
            disabled={loading}
            title="Atualizar dados"
          >
            <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo cliente
          </Button>
        </div>
      </div>

      {expiring.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Contratos próximos do vencimento</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm">
              {expiring.map(({ c, info }) => (
                <li key={c.id}>
                  <Link to="/clientes/$id" params={{ id: c.id }} className="underline">
                    {c.name}
                  </Link>{" "}
                  —{" "}
                  {info!.daysLeft < 0
                    ? `vencido há ${Math.abs(info!.daysLeft)} dia(s)`
                    : info!.daysLeft === 0
                      ? "vence hoje"
                      : `vence em ${info!.daysLeft} dia(s)`}{" "}
                  ({info!.end.toLocaleDateString("pt-BR")})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de clientes</CardTitle>
          <CardDescription>Clique em um cliente para abrir o perfil completo.</CardDescription>
          <div className="relative mt-3 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, fantasia ou documento..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {clients.length === 0 ? "Nenhum cliente cadastrado." : "Nenhum resultado."}
            </div>
          ) : (
            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-center">Venc.</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const info = contractInfo(c.start_date, c.contract_months);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">
                          {c.name}
                          {c.trade_name && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({c.trade_name})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.client_type === "pj" ? "PJ" : "PF"}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {c.document || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {c.phone || c.email || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {fmtBRL(Number(c.contract_value))}
                        </TableCell>
                        <TableCell className="text-center">Dia {c.due_day}</TableCell>
                        <TableCell className="text-sm">
                          {info ? (
                            <div className="flex flex-col">
                              <span>
                                {c.contract_months}m · até {info.end.toLocaleDateString("pt-BR")}
                              </span>
                              {info.daysLeft <= 30 && (
                                <span
                                  className={`text-xs font-medium ${info.daysLeft < 0 ? "text-destructive" : "text-amber-600"}`}
                                >
                                  {info.daysLeft < 0
                                    ? `vencido há ${Math.abs(info.daysLeft)}d`
                                    : info.daysLeft === 0
                                      ? "vence hoje"
                                      : `${info.daysLeft}d restantes`}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              c.status === "active"
                                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                                : "bg-slate-400 hover:bg-slate-400 text-white"
                            }
                          >
                            {c.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button asChild variant="ghost" size="sm">
                              <Link to="/clientes/$id" params={{ id: c.id }}>
                                Abrir <ExternalLink className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Remove permanentemente <strong>{c.name}</strong>, com
                                    pagamentos, arquivos e credenciais. Não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(c.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo cliente</DialogTitle>
            <DialogDescription>
              Cadastre os dados básicos. Você pode completar o perfil depois.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Razão social / Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nome fantasia</Label>
              <Input
                value={form.trade_name}
                onChange={(e) => setForm({ ...form, trade_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={form.client_type}
                onValueChange={(v) => setForm({ ...form, client_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                  <SelectItem value="pf">Pessoa Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{form.client_type === "pj" ? "CNPJ" : "CPF"}</Label>
              <Input
                value={form.document}
                onChange={(e) => setForm({ ...form, document: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor mensal (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.contract_value}
                onChange={(e) => setForm({ ...form, contract_value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dia do vencimento</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={form.due_day}
                onChange={(e) => setForm({ ...form, due_day: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Início do contrato</Label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Duração (meses)</Label>
              <Input
                type="number"
                min="1"
                max="120"
                value={form.contract_months}
                onChange={(e) => setForm({ ...form, contract_months: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
