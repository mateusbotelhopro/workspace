import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
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
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
  Loader2,
  ArrowLeft,
  Save,
  KeyRound,
  FileText,
  Plus,
  Eye,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import {
  listCredentials,
  saveCredential,
  revealCredential,
  deleteCredential,
} from "@/lib/vault.functions";
import {
  listClientFiles,
  createSignedUploadUrl,
  registerClientFile,
  getFileSignedUrl,
  deleteClientFile,
} from "@/lib/client-files.functions";
import type { Database } from "@/integrations/supabase/types";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
type ClientFileRow = Database["public"]["Tables"]["client_files"]["Row"];
type CredRow = Database["public"]["Tables"]["client_credentials"]["Row"];
type CredListItem = Pick<
  CredRow,
  "id" | "label" | "username" | "url" | "notes" | "created_at" | "updated_at"
>;

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Erro inesperado");

export const Route = createFileRoute("/_authenticated/clientes/$id")({
  head: () => ({ meta: [{ title: "Cliente | Gestor Kelvin" }] }),
  component: ClientDetailPage,
});

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

function ClientDetailPage() {
  const { id } = useParams({ from: "/_authenticated/clientes/$id" });
  const [client, setClient] = useState<ClientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from("clients").select("*").eq("id", id).single(),
      supabase
        .from("payments")
        .select("*")
        .eq("client_id", id)
        .order("reference_month", { ascending: false }),
    ]);
    if (c.error) toast.error(c.error.message);
    else setClient(c.data);
    setPayments(p.data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, [id]);

  const updateField = (k: string, v: unknown) =>
    setClient((prev) => (prev ? { ...prev, [k]: v } : prev));

  const save = async () => {
    if (!client) return;
    setSaving(true);
    const { id: _, user_id: __, created_at: ___, updated_at: ____, ...rest } = client;
    const { error } = await supabase.from("clients").update(rest).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cliente atualizado");
  };

  const handleDelete = async () => {
    setDeleting(true);
    // limpar dependentes (sem FK no banco)
    await supabase.from("client_credentials").delete().eq("client_id", id);
    await supabase.from("client_files").delete().eq("client_id", id);
    await supabase.from("payments").delete().eq("client_id", id);
    const { error } = await supabase.from("clients").delete().eq("id", id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Cliente excluído");
    navigate({ to: "/clientes" });
  };

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Carregando...
      </div>
    );
  }

  const totalReceived = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount), 0);
  const overdue = payments
    .filter((p) => p.status === "overdue")
    .reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{client.name}</h1>
            <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-1">
              {client.trade_name && <span className="truncate">{client.trade_name} ·</span>}
              <Badge variant="outline">{client.client_type === "pj" ? "PJ" : "PF"}</Badge>
              <Badge
                className={
                  client.status === "active"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-400 text-white"
                }
              >
                {client.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={save} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar alterações
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleting} className="w-full sm:w-auto">
                {deleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação remove permanentemente <strong>{client.name}</strong>, junto com
                  pagamentos, arquivos e credenciais associados. Não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir definitivamente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contrato mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {fmtBRL(Number(client.contract_value))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{fmtBRL(totalReceived)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inadimplente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{fmtBRL(overdue)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dados">
        <div className="-mx-4 md:-mx-6 overflow-x-auto px-4 md:px-6">
          <TabsList className="w-max">
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="contrato">Contrato</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
            <TabsTrigger value="cofre">Cofre de senhas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dados" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Razão social / Nome">
                <Input
                  value={client.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>
              <Field label="Nome fantasia">
                <Input
                  value={client.trade_name || ""}
                  onChange={(e) => updateField("trade_name", e.target.value)}
                />
              </Field>
              <Field label="Tipo">
                <Select
                  value={client.client_type || "pj"}
                  onValueChange={(v) => updateField("client_type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                    <SelectItem value="pf">Pessoa Física</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={client.client_type === "pj" ? "CNPJ" : "CPF"}>
                <Input
                  value={client.document || ""}
                  onChange={(e) => updateField("document", e.target.value)}
                />
              </Field>
              <Field label="Inscrição estadual">
                <Input
                  value={client.state_registration || ""}
                  onChange={(e) => updateField("state_registration", e.target.value)}
                />
              </Field>
              <Field label="Segmento">
                <Input
                  value={client.segment || ""}
                  onChange={(e) => updateField("segment", e.target.value)}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={client.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </Field>
              <Field label="Telefone">
                <Input
                  value={client.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </Field>
              <Field label="Site">
                <Input
                  value={client.website || ""}
                  onChange={(e) => updateField("website", e.target.value)}
                />
              </Field>
              <Field label="Pessoa de contato">
                <Input
                  value={client.contact_person || ""}
                  onChange={(e) => updateField("contact_person", e.target.value)}
                />
              </Field>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Field label="CEP">
                <Input
                  value={client.address_zip || ""}
                  onChange={(e) => updateField("address_zip", e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Rua">
                  <Input
                    value={client.address_street || ""}
                    onChange={(e) => updateField("address_street", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Número">
                <Input
                  value={client.address_number || ""}
                  onChange={(e) => updateField("address_number", e.target.value)}
                />
              </Field>
              <Field label="Complemento">
                <Input
                  value={client.address_complement || ""}
                  onChange={(e) => updateField("address_complement", e.target.value)}
                />
              </Field>
              <Field label="Bairro">
                <Input
                  value={client.address_district || ""}
                  onChange={(e) => updateField("address_district", e.target.value)}
                />
              </Field>
              <Field label="Cidade">
                <Input
                  value={client.address_city || ""}
                  onChange={(e) => updateField("address_city", e.target.value)}
                />
              </Field>
              <Field label="UF">
                <Input
                  value={client.address_state || ""}
                  onChange={(e) => updateField("address_state", e.target.value)}
                  maxLength={2}
                />
              </Field>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={client.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contrato" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do contrato</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Valor mensal (R$)">
                <Input
                  type="number"
                  step="0.01"
                  value={client.contract_value || 0}
                  onChange={(e) => updateField("contract_value", parseFloat(e.target.value) || 0)}
                />
              </Field>
              <Field label="Dia de vencimento">
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={client.due_day || 1}
                  onChange={(e) => updateField("due_day", parseInt(e.target.value) || 1)}
                />
              </Field>
              <Field label="Data de início">
                <Input
                  type="date"
                  value={client.start_date || ""}
                  onChange={(e) => updateField("start_date", e.target.value || null)}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={client.status || "active"}
                  onValueChange={(v) => updateField("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de pagamentos</CardTitle>
              <CardDescription>Faturas geradas para este cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">Nenhum pagamento.</p>
              ) : (
                <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            {new Date(p.reference_month).toLocaleDateString("pt-BR", {
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>{new Date(p.due_date).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                p.status === "paid"
                                  ? "bg-emerald-600 text-white"
                                  : p.status === "overdue"
                                    ? "bg-red-600 text-white"
                                    : "bg-slate-400 text-white"
                              }
                            >
                              {p.status === "paid"
                                ? "Pago"
                                : p.status === "overdue"
                                  ? "Vencido"
                                  : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {fmtBRL(Number(p.amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arquivos" className="mt-4">
          <FilesTab clientId={id} />
        </TabsContent>
        <TabsContent value="cofre" className="mt-4">
          <VaultTab clientId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function FilesTab({ clientId }: { clientId: string }) {
  const list = useServerFn(listClientFiles);
  const sign = useServerFn(createSignedUploadUrl);
  const register = useServerFn(registerClientFile);
  const getUrl = useServerFn(getFileSignedUrl);
  const del = useServerFn(deleteClientFile);
  const [files, setFiles] = useState<ClientFileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setFiles(await list({ data: { clientId } }));
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, [clientId]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { path, signedUrl } = await sign({ data: { clientId, filename: file.name } });
      const up = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!up.ok) throw new Error("Falha no upload");
      await register({
        data: {
          clientId,
          name: file.name,
          category: "other",
          storage_path: path,
          size: file.size,
          mime_type: file.type,
        },
      });
      toast.success("Arquivo enviado");
      load();
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
    setUploading(false);
    e.target.value = "";
  };

  const onDownload = async (path: string) => {
    try {
      const { url } = await getUrl({ data: { path } });
      window.open(url, "_blank");
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
  };

  const onDelete = async (id: string, path: string) => {
    if (!confirm("Excluir este arquivo?")) return;
    try {
      await del({ data: { id, path } });
      toast.success("Arquivo removido");
      load();
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Arquivos
          </CardTitle>
          <CardDescription>Contratos, briefings, criativos.</CardDescription>
        </div>
        <label className="w-full sm:w-auto">
          <input type="file" className="hidden" onChange={onUpload} disabled={uploading} />
          <Button asChild disabled={uploading} className="w-full sm:w-auto">
            <span>
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Enviar
            </span>
          </Button>
        </label>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : files.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Nenhum arquivo.</p>
        ) : (
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {f.mime_type || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {f.size ? `${(f.size / 1024).toFixed(1)} KB` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDownload(f.storage_path)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(f.id, f.storage_path)}
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
}

function VaultTab({ clientId }: { clientId: string }) {
  const list = useServerFn(listCredentials);
  const save = useServerFn(saveCredential);
  const reveal = useServerFn(revealCredential);
  const del = useServerFn(deleteCredential);
  const [creds, setCreds] = useState<CredListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ label: "", username: "", password: "", url: "", notes: "" });

  const load = async () => {
    setLoading(true);
    try {
      setCreds(await list({ data: { clientId } }));
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, [clientId]);

  const handleSave = async () => {
    if (!form.label.trim() || !form.password) return toast.error("Label e senha obrigatórios");
    setSaving(true);
    try {
      await save({
        data: {
          id: null,
          clientId,
          label: form.label.trim(),
          username: form.username || null,
          password: form.password,
          url: form.url || null,
          notes: form.notes || null,
        },
      });
      toast.success("Credencial salva");
      setOpen(false);
      setForm({ label: "", username: "", password: "", url: "", notes: "" });
      load();
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
    setSaving(false);
  };

  const handleReveal = async (id: string) => {
    if (revealed[id]) {
      setRevealed({ ...revealed, [id]: "" });
      return;
    }
    try {
      const { password } = await reveal({ data: { id } });
      setRevealed({ ...revealed, [id]: password });
      setTimeout(() => setRevealed((r) => ({ ...r, [id]: "" })), 30000);
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir credencial?")) return;
    try {
      await del({ data: { id } });
      toast.success("Removida");
      load();
    } catch (e: unknown) {
      toast.error(errMsg(e));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Cofre de senhas
          </CardTitle>
          <CardDescription>Senhas criptografadas no servidor (AES-256-GCM).</CardDescription>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : creds.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nenhuma credencial cadastrada.
          </p>
        ) : (
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Senha</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creds.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.label}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {c.username || "—"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {revealed[c.id] || "••••••••"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs truncate max-w-[200px]">
                      {c.url || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleReveal(c.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova credencial</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Field label="Label (ex: Meta Ads, Google Ads)">
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </Field>
            <Field label="Usuário / Email">
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </Field>
            <Field label="Senha">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Field>
            <Field label="URL">
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </Field>
            <Field label="Notas">
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
