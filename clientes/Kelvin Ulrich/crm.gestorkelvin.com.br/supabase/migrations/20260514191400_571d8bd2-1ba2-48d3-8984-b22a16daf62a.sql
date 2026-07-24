ALTER TABLE public.payments ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS description text;