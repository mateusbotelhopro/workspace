
-- 1. Expand clients table
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS client_type TEXT NOT NULL DEFAULT 'pj',
  ADD COLUMN IF NOT EXISTS document TEXT,
  ADD COLUMN IF NOT EXISTS legal_name TEXT,
  ADD COLUMN IF NOT EXISTS trade_name TEXT,
  ADD COLUMN IF NOT EXISTS state_registration TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS contact_person TEXT,
  ADD COLUMN IF NOT EXISTS segment TEXT,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS address_zip TEXT,
  ADD COLUMN IF NOT EXISTS address_street TEXT,
  ADD COLUMN IF NOT EXISTS address_number TEXT,
  ADD COLUMN IF NOT EXISTS address_complement TEXT,
  ADD COLUMN IF NOT EXISTS address_district TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_state TEXT;

-- 2. Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_day SMALLINT,
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own expenses" ON public.expenses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own expenses" ON public.expenses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own expenses" ON public.expenses
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own expenses" ON public.expenses
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Client files (metadata only; binaries in storage)
CREATE TABLE IF NOT EXISTS public.client_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  storage_path TEXT NOT NULL,
  size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own client_files" ON public.client_files
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own client_files" ON public.client_files
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own client_files" ON public.client_files
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Client credentials vault (encrypted server-side)
CREATE TABLE IF NOT EXISTS public.client_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  label TEXT NOT NULL,
  username TEXT,
  password_encrypted BYTEA NOT NULL,
  iv BYTEA NOT NULL,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credentials" ON public.client_credentials
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own credentials" ON public.client_credentials
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own credentials" ON public.client_credentials
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own credentials" ON public.client_credentials
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_credentials_updated_at
  BEFORE UPDATE ON public.client_credentials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Storage bucket for client files (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users read own client-files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload own client-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own client-files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own client-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_client_files_client ON public.client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_client_credentials_client ON public.client_credentials(client_id);
