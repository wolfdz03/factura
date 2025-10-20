import { createSupabaseClient } from "@invoicely/utilities";

// Client-side Supabase configuration
// These should be public environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client for client-side operations
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
