import { createSupabaseAdmin, STORAGE_BUCKET } from "@invoicely/utilities";
import { env } from "@invoicely/utilities";

// Create Supabase admin client for server-side operations
export const supabaseAdmin = createSupabaseAdmin(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Export storage bucket constant
export { STORAGE_BUCKET };
