// Chave pública VAPID — pode ficar exposta no client (é projetada pra isso).
// A privada (VAPID_PRIVATE_KEY) fica como secret no servidor.
export const VAPID_PUBLIC_KEY =
  "BIqol6qI_SUkxB8gtuVWqQju3InAFKCy6cfC3b9MJdEHPUHq21BQKdqWEzLnrFmUlxZKBfh8YSIdw4tWHLttWvk";

export const VAPID_SUBJECT = "mailto:kelvin@gestorkelvin.com.br";

export function normalizeVapidPrivateKey(value: string | undefined) {
  if (!value) throw new Error("VAPID_PRIVATE_KEY não configurada");
  return value
    .trim()
    .replace(/^['"`]+|['"`]+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
