"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
}

export default function AdminDashboard({
  waitlist,
  error,
}: {
  waitlist: WaitlistEntry[];
  error: string | null;
}) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleExportCSV = () => {
    const header = "Email,Date\n";
    const rows = waitlist
      .map((w) => `${w.email},${new Date(w.created_at).toLocaleDateString()}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "snaeh-waitlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <div className="admin-logo">
            Snaeh<span>App</span>
          </div>
          <span className="admin-subtitle">Admin Dashboard</span>
        </div>
        <button onClick={handleLogout} className="btn-outline admin-logout">
          Logout
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-num">{waitlist.length}</span>
          <span className="admin-stat-label">Total Signups</span>
        </div>
      </div>

      <div className="admin-table-header">
        <h2>Waitlist</h2>
        <button onClick={handleExportCSV} className="btn-outline">
          Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {waitlist.map((entry, i) => (
              <tr key={entry.id}>
                <td>{i + 1}</td>
                <td>{entry.email}</td>
                <td>{new Date(entry.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {waitlist.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", opacity: 0.5 }}>
                  No signups yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
