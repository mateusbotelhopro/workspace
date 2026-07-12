
-- Agenda o resumo diario de notificacoes (cobrancas vencidas, contratos acabando,
-- tarefas atrasadas). O endpoint ja existia (/api/public/cron/notify-daily) mas
-- nunca era chamado sozinho -- so funcionava via teste manual no app.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'gestor-kelvin-notify-daily',
  '0 11 * * *', -- 11:00 UTC = 08:00 America/Sao_Paulo
  $$
  SELECT net.http_post(
    url := 'https://crm.gestorkelvin.com.br/api/public/cron/notify-daily',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbWdxZmlmb3NoZWtua2Rud3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjMxMjIsImV4cCI6MjA5NDEzOTEyMn0.V9-Gdx1tBuHJHxgl-fcsR6J2jDV7X6QPYkRdOdD_akM'
    ),
    body := '{}'::jsonb
  );
  $$
);
