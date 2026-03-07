import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
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
