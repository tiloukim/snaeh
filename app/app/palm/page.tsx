import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PalmClient from "./PalmClient";

export default async function PalmPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("zodiac, name, date_of_birth")
    .eq("id", user.id)
    .single();

  return (
    <PalmClient
      zodiac={profile?.zodiac ?? null}
      name={profile?.name ?? null}
      dateOfBirth={profile?.date_of_birth ?? null}
    />
  );
}
