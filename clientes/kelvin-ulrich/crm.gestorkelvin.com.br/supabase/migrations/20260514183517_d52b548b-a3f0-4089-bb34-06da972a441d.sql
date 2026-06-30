-- 1) Limite de CPA por cliente (Módulo 3 - Semáforo)
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS cpa_limit numeric(12,2);

-- 2) Distinção PJ/PF nas despesas (Módulo 2)
ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS entity_type text NOT NULL DEFAULT 'pj'
    CHECK (entity_type IN ('pj','pf'));

CREATE INDEX IF NOT EXISTS expenses_entity_type_idx
  ON public.expenses(user_id, entity_type, expense_date DESC);

-- 3) Push Subscriptions (Módulo 1 - Web Push)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own push subscriptions"
  ON public.push_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own push subscriptions"
  ON public.push_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own push subscriptions"
  ON public.push_subscriptions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);