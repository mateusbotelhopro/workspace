import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listClientFiles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ clientId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("client_files")
      .select("*")
      .eq("client_id", data.clientId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createSignedUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        clientId: z.string().uuid(),
        filename: z.string().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${context.userId}/${data.clientId}/${Date.now()}-${safe}`;
    const { data: signed, error } = await context.supabase.storage
      .from("client-files")
      .createSignedUploadUrl(path);
    if (error) throw new Error(error.message);
    return { path, token: signed.token, signedUrl: signed.signedUrl };
  });

export const registerClientFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        clientId: z.string().uuid(),
        name: z.string().min(1).max(200),
        category: z.string().max(50).default("other"),
        storage_path: z.string().min(1),
        size: z.number().nonnegative().nullable().optional(),
        mime_type: z.string().max(100).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("client_files").insert({
      user_id: context.userId,
      client_id: data.clientId,
      name: data.name,
      category: data.category,
      storage_path: data.storage_path,
      size: data.size ?? null,
      mime_type: data.mime_type ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getFileSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ path: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: signed, error } = await context.supabase.storage
      .from("client-files")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export const deleteClientFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), path: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await context.supabase.storage.from("client-files").remove([data.path]);
    const { error } = await context.supabase.from("client_files").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
