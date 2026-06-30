
-- Tabela de pagamentos
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  reference_month DATE NOT NULL, -- sempre dia 01 do mês
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, reference_month)
);

CREATE INDEX idx_payments_user_month ON public.payments(user_id, reference_month);
CREATE INDEX idx_payments_status ON public.payments(status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.payments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments"
  ON public.payments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Gera cobranças do mês para todos os clientes ativos do usuário
CREATE OR REPLACE FUNCTION public.generate_monthly_payments(_reference_month DATE)
RETURNS TABLE(created_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user UUID := auth.uid();
  _month DATE := date_trunc('month', _reference_month)::date;
  _count INTEGER := 0;
BEGIN
  IF _user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  WITH inserted AS (
    INSERT INTO public.payments (user_id, client_id, reference_month, amount, due_date, status)
    SELECT
      c.user_id,
      c.id,
      _month,
      c.contract_value,
      (_month + (LEAST(c.due_day, EXTRACT(DAY FROM (date_trunc('month', _month) + INTERVAL '1 month - 1 day'))::int) - 1) * INTERVAL '1 day')::date,
      CASE
        WHEN (_month + (LEAST(c.due_day, EXTRACT(DAY FROM (date_trunc('month', _month) + INTERVAL '1 month - 1 day'))::int) - 1) * INTERVAL '1 day')::date < CURRENT_DATE
          THEN 'overdue'
        ELSE 'pending'
      END
    FROM public.clients c
    WHERE c.user_id = _user
      AND c.status = 'active'
      AND NOT EXISTS (
        SELECT 1 FROM public.payments p
        WHERE p.client_id = c.id AND p.reference_month = _month
      )
    RETURNING 1
  )
  SELECT COUNT(*)::int INTO _count FROM inserted;

  -- Atualiza status de pagamentos vencidos
  UPDATE public.payments
    SET status = 'overdue'
    WHERE user_id = _user
      AND status = 'pending'
      AND due_date < CURRENT_DATE;

  RETURN QUERY SELECT _count;
END;
$$;
