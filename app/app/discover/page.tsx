import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SwipeCard from "./SwipeCard";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch candidates: exclude self, already-swiped, and incomplete profiles
  const { data: swipedRows } = await supabase
    .from("swipes")
    .select("swiped_id")
    .eq("swiper_id", user.id);

  const swipedIds = (swipedRows ?? []).map((r) => r.swiped_id);
  const excludeIds = [user.id, ...swipedIds];

  const { data: candidates } = await supabase
    .from("profiles")
    .select("id, name, age, gender, bio, province, photo_url, zodiac")
    .not("id", "in", `(${excludeIds.join(",")})`)
    .not("name", "is", null);

  // Shuffle candidates
  const shuffled = (candidates ?? []).sort(() => Math.random() - 0.5);

  return (
    <div className="discover-page">
      <SwipeCard candidates={shuffled} userId={user.id} />
    </div>
  );
}
