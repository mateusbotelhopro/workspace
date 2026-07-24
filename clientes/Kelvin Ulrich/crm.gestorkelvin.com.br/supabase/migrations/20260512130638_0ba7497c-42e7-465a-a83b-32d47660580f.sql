
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activities_user_created ON public.activities(user_id, created_at DESC);
CREATE INDEX idx_activities_entity ON public.activities(entity_type, entity_id);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities" ON public.activities
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities" ON public.activities
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activities" ON public.activities
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger function for clients
CREATE OR REPLACE FUNCTION public.log_client_activity()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description)
    VALUES (NEW.user_id, 'client', NEW.id, 'client_created', 'Cliente cadastrado', NEW.name);
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description, metadata)
    VALUES (NEW.user_id, 'client', NEW.id, 'client_status_changed', 'Status do cliente alterado',
            NEW.name || ': ' || OLD.status || ' → ' || NEW.status,
            jsonb_build_object('from', OLD.status, 'to', NEW.status));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description)
    VALUES (OLD.user_id, 'client', OLD.id, 'client_deleted', 'Cliente removido', OLD.name);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_log_client_activity
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.log_client_activity();

-- Trigger function for payments
CREATE OR REPLACE FUNCTION public.log_payment_activity()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _client_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT name INTO _client_name FROM public.clients WHERE id = NEW.client_id;
    INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description, metadata)
    VALUES (NEW.user_id, 'payment', NEW.id, 'payment_created', 'Pagamento gerado',
            COALESCE(_client_name, 'Cliente') || ' - R$ ' || NEW.amount,
            jsonb_build_object('amount', NEW.amount, 'reference_month', NEW.reference_month));
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT name INTO _client_name FROM public.clients WHERE id = NEW.client_id;
    IF NEW.status = 'paid' THEN
      INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description, metadata)
      VALUES (NEW.user_id, 'payment', NEW.id, 'payment_received', 'Pagamento recebido',
              COALESCE(_client_name, 'Cliente') || ' - R$ ' || NEW.amount,
              jsonb_build_object('amount', NEW.amount));
    ELSE
      INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description, metadata)
      VALUES (NEW.user_id, 'payment', NEW.id, 'payment_status_changed', 'Status do pagamento alterado',
              COALESCE(_client_name, 'Cliente') || ': ' || OLD.status || ' → ' || NEW.status,
              jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_log_payment_activity
AFTER INSERT OR UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.log_payment_activity();

-- Trigger function for tasks
CREATE OR REPLACE FUNCTION public.log_task_activity()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description)
    VALUES (NEW.user_id, 'task', NEW.id, 'task_created', 'Tarefa criada', NEW.title);
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'done' THEN
      INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description)
      VALUES (NEW.user_id, 'task', NEW.id, 'task_completed', 'Tarefa concluída', NEW.title);
    ELSE
      INSERT INTO public.activities (user_id, entity_type, entity_id, event_type, title, description, metadata)
      VALUES (NEW.user_id, 'task', NEW.id, 'task_status_changed', 'Status da tarefa alterado',
              NEW.title || ': ' || OLD.status || ' → ' || NEW.status,
              jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_log_task_activity
AFTER INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.log_task_activity();
