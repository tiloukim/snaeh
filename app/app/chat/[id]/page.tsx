import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatRoom from "./ChatRoom";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: matchId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Verify user is a participant in this match
  const { data: match } = await supabase
    .from("matches")
    .select("id, user1_id, user2_id")
    .eq("id", matchId)
    .maybeSingle();

  if (!match || (match.user1_id !== user.id && match.user2_id !== user.id)) {
    redirect("/app/matches");
  }

  // Get the other user's profile
  const otherId =
    match.user1_id === user.id ? match.user2_id : match.user1_id;
  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("name, photo_url")
    .eq("id", otherId)
    .single();

  // Fetch initial messages
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  return (
    <ChatRoom
      matchId={matchId}
      userId={user.id}
      otherName={otherProfile?.name ?? "Unknown"}
      otherPhoto={otherProfile?.photo_url ?? null}
      initialMessages={messages ?? []}
    />
  );
}
