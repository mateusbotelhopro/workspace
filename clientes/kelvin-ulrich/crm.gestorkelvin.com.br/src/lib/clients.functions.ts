import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ clientId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: files } = await supabase
      .from("client_files")
      .select("storage_path")
      .eq("client_id", data.clientId);
    if (files && files.length > 0) {
      await supabase.storage.from("client-files").remove(files.map((f) => f.storage_path));
    }

    // client_credentials, client_files e payments saem via ON DELETE CASCADE no banco.
    const { error } = await supabase.from("clients").delete().eq("id", data.clientId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
