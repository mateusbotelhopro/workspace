import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getMasterKey(): Promise<CryptoKey> {
  const raw = process.env.VAULT_MASTER_KEY;
  if (!raw) throw new Error("VAULT_MASTER_KEY not configured");
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
  } catch {
    bytes = new TextEncoder().encode(raw);
  }
  if (bytes.byteLength !== 32) {
    const hash = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
    bytes = new Uint8Array(hash);
  }
  return crypto.subtle.importKey("raw", bytes as BufferSource, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function encryptString(plaintext: string) {
  const key = await getMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext) as BufferSource,
  );
  return { iv, ciphertext: new Uint8Array(ct) };
}

async function decryptString(ciphertext: Uint8Array, iv: Uint8Array) {
  const key = await getMasterKey();
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ciphertext as BufferSource,
  );
  return new TextDecoder().decode(pt);
}

// Supabase returns bytea as a `\x...` hex string in JS client
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("\\x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}
function bytesToHex(bytes: Uint8Array): string {
  return (
    "\\x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export const listCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ clientId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("client_credentials")
      .select("id, label, username, url, notes, created_at, updated_at")
      .eq("client_id", data.clientId)
      .order("label", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const saveCredential = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().nullable(),
        clientId: z.string().uuid(),
        label: z.string().min(1).max(100),
        username: z.string().max(200).nullable().optional(),
        password: z.string().min(1).max(500),
        url: z.string().max(500).nullable().optional(),
        notes: z.string().max(2000).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { iv, ciphertext } = await encryptString(data.password);
    const payload = {
      label: data.label,
      username: data.username ?? null,
      url: data.url ?? null,
      notes: data.notes ?? null,
      password_encrypted: bytesToHex(ciphertext),
      iv: bytesToHex(iv),
    };
    if (data.id) {
      const { error } = await context.supabase
        .from("client_credentials")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("client_credentials").insert({
        ...payload,
        client_id: data.clientId,
        user_id: context.userId,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const revealCredential = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("client_credentials")
      .select("password_encrypted, iv")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Credencial não encontrada");
    const ct = hexToBytes(row.password_encrypted as unknown as string);
    const iv = hexToBytes(row.iv as unknown as string);
    const password = await decryptString(ct, iv);
    return { password };
  });

export const deleteCredential = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("client_credentials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
