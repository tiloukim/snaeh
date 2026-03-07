"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AppShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <a href="/" className="app-logo">
          <svg className="app-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#as)"
            />
            <defs>
              <linearGradient id="as" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#E8454A" />
                <stop offset="1" stopColor="#8B1A28" />
              </linearGradient>
            </defs>
          </svg>
          <span className="app-logo-text">
            Snaeh<span>App</span>
          </span>
        </a>
        <nav className="app-nav">
          <a href="/app/discover">Discover</a>
          <a href="/app/matches">Matches</a>
          <a href="/app/profile">Profile</a>
        </nav>
        <div className="app-user">
          <span className="app-user-email">{userEmail}</span>
          <button onClick={handleLogout} className="btn-outline app-logout">
            Logout
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
