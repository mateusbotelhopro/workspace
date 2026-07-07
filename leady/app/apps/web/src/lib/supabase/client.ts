"use client";

import { createBrowserClient } from "@supabase/ssr";

// Client pro browser (inbox realtime, mutações do usuário).
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
