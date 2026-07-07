import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "../env";

// Client com service role — SÓ em route handlers de sistema
// (webhook, redirecionador). Bypassa RLS.
export function createAdminClient() {
  return createClient(serverEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}
