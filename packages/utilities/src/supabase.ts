import { createClient } from "@supabase/supabase-js";

// Storage bucket name
export const STORAGE_BUCKET = "files";

// Client-side Supabase client (uses public anon key)
export const createSupabaseClient = (url: string, anonKey: string) => {
  return createClient(url, anonKey);
};

// Server-side Supabase client factory (uses service role key)
export const createSupabaseAdmin = (url: string, serviceRoleKey: string) => {
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};