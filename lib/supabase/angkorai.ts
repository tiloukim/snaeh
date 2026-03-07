import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _angkoraiAdmin: SupabaseClient | null = null;

export function getAngkorAIAdmin(): SupabaseClient | null {
  if (
    !process.env.ANGKORAI_SUPABASE_URL ||
    !process.env.ANGKORAI_SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  if (!_angkoraiAdmin) {
    _angkoraiAdmin = createClient(
      process.env.ANGKORAI_SUPABASE_URL,
      process.env.ANGKORAI_SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return _angkoraiAdmin;
}
