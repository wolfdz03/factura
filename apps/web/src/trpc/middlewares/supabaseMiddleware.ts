import { middleware } from "@/trpc/init";
import { supabaseAdmin } from "@/lib/supabase/server";

export const supabaseMiddleware = middleware(async function supabaseMiddleware(options) {
  return options.next({
    ctx: {
      supabase: supabaseAdmin,
    },
  });
});
