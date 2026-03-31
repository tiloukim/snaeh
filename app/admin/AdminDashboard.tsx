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
  bio: string | null;
  looking_for: string | null;
  date_of_birth: string | null;
  updated_at: string | null;
  status: string | null;
}

interface PendingProfile {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  country: string | null;
  province: string | null;
  photo_url: string | null;
  bio: string | null;
  updated_at: string | null;
  status: string | null;
}

type Tab = "waitlist" | "users" | "pending";

export default function AdminDashboard({
  waitlist,
  users,
  pendingUsers: initialPending,
  error,
}: {
  waitlist: WaitlistEntry[];
  users: UserProfile[];
  pendingUsers: PendingProfile[];
  error: string | null;
}) {
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [pendingList, setPendingList] = useState(initialPending);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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

  const handleStatusChange = async (userId: string, status: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      });
      if (res.ok) {
        setPendingList((prev) => prev.filter((u) => u.id !== userId));
        router.refresh();
      }
    } finally {
      setActionLoading(null);
    }
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
      const header = "Name,Age,Gender,Zodiac,Location,Looking For,Status,Last Updated\n";
      const rows = filteredUsers
        .map((u) =>
          `"${u.name ?? ""}",${u.age ?? ""},${u.gender ?? ""},${u.zodiac ?? ""},"${u.province ?? ""}, ${u.country ?? ""}",${u.looking_for ?? ""},${u.status ?? ""},${u.updated_at ? new Date(u.updated_at).toLocaleDateString() : ""}`
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
          onClick={() => setTab("pending")}
          className={`admin-tab ${tab === "pending" ? "admin-tab-active" : ""}`}
        >
          Pending Review
          {pendingList.length > 0 && (
            <span className="admin-tab-badge">{pendingList.length}</span>
          )}
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
                  <th>Status</th>
                  <th>Zodiac</th>
                  <th>Location</th>
                  <th>Looking For</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={user.photo_url || (user.gender === "female" ? "/default-female.png" : "/default-male.png")}
                        alt={user.name ?? ""}
                        className="admin-user-avatar"
                      />
                    </td>
                    <td className="admin-user-name">{user.name ?? "—"}</td>
                    <td>{user.age ?? "—"}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${user.gender}`}>
                        {user.gender ?? "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-badge admin-status-${user.status ?? "pending"}`}>
                        {user.status ?? "pending"}
                      </span>
                    </td>
                    <td>{user.zodiac ?? "—"}</td>
                    <td>{[user.province, user.country].filter(Boolean).join(", ") || "—"}</td>
                    <td>{user.looking_for ?? "—"}</td>
                    <td>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "—"}</td>
                    <td>
                      {user.status === "approved" && (
                        <button
                          className="admin-action-btn admin-action-suspend"
                          onClick={() => handleStatusChange(user.id, "suspended")}
                          disabled={actionLoading === user.id}
                        >
                          Suspend
                        </button>
                      )}
                      {user.status === "suspended" && (
                        <button
                          className="admin-action-btn admin-action-approve"
                          onClick={() => handleStatusChange(user.id, "approved")}
                          disabled={actionLoading === user.id}
                        >
                          Unsuspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", opacity: 0.5 }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pending Review Tab */}
      {tab === "pending" && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Bio</th>
                  <th>Location</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={user.photo_url || (user.gender === "female" ? "/default-female.png" : "/default-male.png")}
                        alt={user.name ?? ""}
                        className="admin-user-avatar"
                      />
                    </td>
                    <td className="admin-user-name">{user.name ?? "—"}</td>
                    <td>{user.age ?? "—"}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${user.gender}`}>
                        {user.gender ?? "—"}
                      </span>
                    </td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.bio ?? "—"}
                    </td>
                    <td>{[user.province, user.country].filter(Boolean).join(", ") || "—"}</td>
                    <td>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="admin-action-btn admin-action-approve"
                          onClick={() => handleStatusChange(user.id, "approved")}
                          disabled={actionLoading === user.id}
                        >
                          Approve
                        </button>
                        <button
                          className="admin-action-btn admin-action-reject"
                          onClick={() => handleStatusChange(user.id, "rejected")}
                          disabled={actionLoading === user.id}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingList.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", opacity: 0.5 }}>
                      No pending profiles
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
