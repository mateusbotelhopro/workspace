import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { savePushSubscription, sendTestPush, getPushStatus } from "@/lib/push.functions";
import { subscribeToPush, isIOS, isStandalone } from "@/lib/push";

export function PushNotificationsCard() {
  const save = useServerFn(savePushSubscription);
  const test = useServerFn(sendTestPush);
  const status = useServerFn(getPushStatus);

  const [perm, setPerm] = useState<NotificationPermission>("default");
  const [devices, setDevices] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (typeof Notification !== "undefined") setPerm(Notification.permission);
    status({})
      .then((r) => setDevices(r.devices))
      .catch(() => {});
  }, [status]);

  const enable = async () => {
    setLoading(true);
    try {
      if (typeof Notification === "undefined") {
        toast.error("Navegador não suporta notificações");
        return;
      }
      if (isIOS() && !isStandalone()) {
        toast.error("No iPhone, instale o app primeiro: Compartilhar → Adicionar à Tela de Início");
        return;
      }
      const p = await Notification.requestPermission();
      setPerm(p);
      if (p !== "granted") {
        toast.error("Permissão negada");
        return;
      }
      const sub = await subscribeToPush();
      if (!sub) {
        toast.error("Não foi possível registrar. Abra o app instalado (não no preview).");
        return;
      }
      await save({
        data: {
          ...sub,
          user_agent: navigator.userAgent.slice(0, 500),
        },
      });
      const r = await status({});
      setDevices(r.devices);
      toast.success("Notificações ativadas neste dispositivo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao ativar notificações");
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      const r = await test({});
      if (r.sent > 0) toast.success(r.message);
      else toast.warning(r.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao enviar");
    } finally {
      setTesting(false);
    }
  };

  const enabled = perm === "granted" && devices > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              {enabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              Notificações Push
            </CardTitle>
            <CardDescription className="mt-1">
              Alertas de cobranças vencidas, contratos próximos do vencimento e tarefas atrasadas.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Smartphone className="h-3 w-3" />
            {devices} {devices === 1 ? "dispositivo" : "dispositivos"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isIOS() && !isStandalone() && (
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <strong>iPhone:</strong> Para receber notificações, abra no Safari, toque em{" "}
            <strong>Compartilhar</strong> → <strong>Adicionar à Tela de Início</strong>. Depois abra
            o app instalado e ative aqui.
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={enable} disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            {enabled ? "Ativar em mais um dispositivo" : "Ativar notificações"}
          </Button>
          {devices > 0 && (
            <Button onClick={sendTest} disabled={testing} size="sm" variant="outline">
              {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Enviar teste
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
