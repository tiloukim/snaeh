import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  // Delete related data first (swipes, matches, messages)
  await admin.from("messages").delete().or(`sender_id.eq.${userId}`);
  await admin.from("matches").delete().or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
  await admin.from("swipes").delete().or(`swiper_id.eq.${userId},swiped_id.eq.${userId}`);

  // Delete profile
  const { error } = await admin.from("profiles").delete().eq("id", userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Delete auth user
  await admin.auth.admin.deleteUser(userId);

  return NextResponse.json({ success: true });
}
