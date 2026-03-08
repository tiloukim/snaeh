import { getSupabaseAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabaseAdmin = getSupabaseAdmin();

  const [{ data: waitlist, error: waitlistError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabaseAdmin
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("profiles")
        .select("id, name, age, gender, country, province, zodiac, photo_url, looking_for, date_of_birth, updated_at")
        .order("updated_at", { ascending: false }),
    ]);

  return (
    <AdminDashboard
      waitlist={waitlist ?? []}
      users={profiles ?? []}
      error={waitlistError?.message ?? profilesError?.message ?? null}
    />
  );
}
