
-- Drop e recria as FKs com ON DELETE CASCADE (algumas já existem sem cascade)
ALTER TABLE public.client_credentials DROP CONSTRAINT IF EXISTS client_credentials_client_id_fkey;
ALTER TABLE public.client_files DROP CONSTRAINT IF EXISTS client_files_client_id_fkey;
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_client_id_fkey;

DELETE FROM public.client_credentials WHERE client_id NOT IN (SELECT id FROM public.clients);
DELETE FROM public.client_files WHERE client_id NOT IN (SELECT id FROM public.clients);
DELETE FROM public.payments WHERE client_id IS NOT NULL AND client_id NOT IN (SELECT id FROM public.clients);

ALTER TABLE public.client_credentials
  ADD CONSTRAINT client_credentials_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.client_files
  ADD CONSTRAINT client_files_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
