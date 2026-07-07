import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

// Worker usa service role: acessa qualquer org (bypassa RLS).
// Todo job DEVE filtrar por org_id explicitamente.
export const db = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
