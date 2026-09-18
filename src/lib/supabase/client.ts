import { createClient } from "@supabase/supabase-js";

// Public, anon-key client. Safe to import from server components (for the
// initial fetch) and client components alike — RLS (see
// supabase/schema.sql) restricts it to reading published cakes only.
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(url, anonKey);
}
