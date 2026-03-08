"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  country: string | null;
  province: string | null;
  zodiac: string | null;
  photo_url: string | null;
  looking_for: string | null;
  date_of_birth: string | null;
  updated_at: string | null;
}

type Tab = "waitlist" | "users";

export default function AdminDashboard({
  waitlist,
  users,
  error,
}: {
  waitlist: WaitlistEntry[];
  users: UserProfile[];
  error: string | null;
}) {
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
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
    if (tab === "waitlist") {
      const header = "Email,Date\n";
      const rows = waitlist
        .map((w) => `${w.email},${new Date(w.created_at).toLocaleDateString()}`)
        .join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      download(blob, "snaeh-waitlist.csv");
    } else {
      const header = "Name,Age,Gender,Zodiac,Location,Looking For,Last Updated\n";
      const rows = filteredUsers
        .map((u) =>
          `"${u.name ?? ""}",${u.age ?? ""},${u.gender ?? ""},${u.zodiac ?? ""},"${u.province ?? ""}, ${u.country ?? ""}",${u.looking_for ?? ""},${u.updated_at ? new Date(u.updated_at).toLocaleDateString() : ""}`
        )
        .join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      download(blob, "snaeh-users.csv");
    }
  };

  function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.province ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.country ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.zodiac ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === "all" || u.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const maleCount = users.filter((u) => u.gender === "male").length;
  const femaleCount = users.filter((u) => u.gender === "female").length;

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

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-num">{users.length}</span>
          <span className="admin-stat-label">Total Users</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{maleCount}</span>
          <span className="admin-stat-label">Male</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{femaleCount}</span>
          <span className="admin-stat-label">Female</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{waitlist.length}</span>
          <span className="admin-stat-label">Waitlist</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setTab("users")}
          className={`admin-tab ${tab === "users" ? "admin-tab-active" : ""}`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setTab("waitlist")}
          className={`admin-tab ${tab === "waitlist" ? "admin-tab-active" : ""}`}
        >
          Waitlist ({waitlist.length})
        </button>
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <>
          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search name, location, zodiac..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search"
            />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button onClick={handleExportCSV} className="btn-outline">
              Export CSV
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Zodiac</th>
                  <th>Location</th>
                  <th>Looking For</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>
                      {user.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={user.name ?? ""}
                          className="admin-user-avatar"
                        />
                      ) : (
                        <div className="admin-user-avatar-placeholder">?</div>
                      )}
                    </td>
                    <td className="admin-user-name">{user.name ?? "—"}</td>
                    <td>{user.age ?? "—"}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${user.gender}`}>
                        {user.gender ?? "—"}
                      </span>
                    </td>
                    <td>{user.zodiac ?? "—"}</td>
                    <td>{[user.province, user.country].filter(Boolean).join(", ") || "—"}</td>
                    <td>{user.looking_for ?? "—"}</td>
                    <td>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", opacity: 0.5 }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Waitlist Tab */}
      {tab === "waitlist" && (
        <>
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
        </>
      )}
    </div>
  );
}
