import { getSupabaseAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: waitlist, error } = await supabaseAdmin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminDashboard
      waitlist={waitlist ?? []}
      error={error?.message ?? null}
    />
  );
}
