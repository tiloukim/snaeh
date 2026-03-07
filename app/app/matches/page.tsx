import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MatchList from "./MatchList";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch matches where current user is either user1 or user2
  const { data: matches } = await supabase
    .from("matches")
    .select("id, user1_id, user2_id, created_at")
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  // Get the other user's profile for each match
  const otherIds = (matches ?? []).map((m) =>
    m.user1_id === user.id ? m.user2_id : m.user1_id
  );

  const { data: profiles } = otherIds.length
    ? await supabase
        .from("profiles")
        .select("id, name, photo_url")
        .in("id", otherIds)
    : { data: [] };

  // Get latest message per match for preview
  const matchIds = (matches ?? []).map((m) => m.id);
  const { data: latestMessages } = matchIds.length
    ? await supabase
        .from("messages")
        .select("match_id, content, created_at")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  // Build a map of match_id -> latest message (first occurrence since ordered desc)
  const latestByMatch = new Map<string, { content: string; created_at: string }>();
  for (const msg of latestMessages ?? []) {
    if (!latestByMatch.has(msg.match_id)) {
      latestByMatch.set(msg.match_id, { content: msg.content, created_at: msg.created_at });
    }
  }

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const items = (matches ?? []).map((m) => {
    const otherId = m.user1_id === user.id ? m.user2_id : m.user1_id;
    const profile = profileMap.get(otherId);
    const latest = latestByMatch.get(m.id);
    return {
      matchId: m.id,
      name: profile?.name ?? "Unknown",
      photo_url: profile?.photo_url ?? null,
      lastMessage: latest?.content ?? null,
    };
  });

  return (
    <div className="matches-page">
      <MatchList items={items} />
    </div>
  );
}
