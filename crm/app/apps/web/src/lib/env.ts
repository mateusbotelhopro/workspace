// Variáveis usadas só no servidor (route handlers, server components).
// As NEXT_PUBLIC_* podem ir pro client.

export const serverEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  metaAppSecret: process.env.META_APP_SECRET ?? "",
  metaWebhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN ?? "",
};
