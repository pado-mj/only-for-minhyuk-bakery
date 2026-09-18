import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — server-side only.
export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin env vars are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
