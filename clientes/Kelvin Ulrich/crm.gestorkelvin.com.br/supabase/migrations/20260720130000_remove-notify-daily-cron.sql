
-- Remove o cron 'gestor-kelvin-notify-daily' (migration 20260711120100).
-- Ele só existia pra disparar notificações push via VAPID, e o recurso de
-- push foi removido do app (chave privada VAPID perdida na troca de projeto
-- Supabase, decisão foi descontinuar em vez de gerar par novo).
-- O endpoint /api/public/cron/notify-daily também foi removido do código.
-- Idempotente: não falha se o job já não existir (ex: se a versão anterior
-- desta migration, que reagendava com apikey corrigido, já tiver rodado).

DO $$
BEGIN
  PERFORM cron.unschedule('gestor-kelvin-notify-daily');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
