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
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [userList, setUserList] = useState(users);
  const [photoMenuUser, setPhotoMenuUser] = useState<string | null>(null);
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

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${userName || "this user"}? This cannot be undone.`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUserList((prev) => prev.filter((u) => u.id !== userId));
        setPendingList((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      age: String(user.age || ""),
      gender: user.gender || "",
      bio: user.bio || "",
      country: user.country || "",
      province: user.province || "",
      looking_for: user.looking_for || "",
      status: user.status || "pending",
    });
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setActionLoading(editingUser.id);
    try {
      const updates: Record<string, unknown> = { ...editForm };
      if (editForm.age) updates.age = Number(editForm.age);
      const res = await fetch("/api/admin/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editingUser.id, updates }),
      });
      if (res.ok) {
        setUserList((prev) =>
          prev.map((u) => u.id === editingUser.id ? { ...u, ...updates } as UserProfile : u)
        );
        setEditingUser(null);
        router.refresh();
      } else {
        alert("Failed to save changes");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handlePhotoAction = async (userId: string, action: "hide" | "delete") => {
    const label = action === "hide" ? "hide (replace with default)" : "permanently delete";
    if (!confirm(`Are you sure you want to ${label} this user's photo?`)) return;
    setActionLoading(userId);
    try {
      const newUrl = null;
      const res = await fetch("/api/admin/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates: { photo_url: newUrl } }),
      });
      if (res.ok) {
        setUserList((prev) =>
          prev.map((u) => u.id === userId ? { ...u, photo_url: null } : u)
        );
        setPendingList((prev) =>
          prev.map((u) => u.id === userId ? { ...u, photo_url: null } : u)
        );
      } else {
        alert("Failed to update photo");
      }
    } finally {
      setActionLoading(null);
      setPhotoMenuUser(null);
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

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      !search ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.province ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.country ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.zodiac ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === "all" || u.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const maleCount = userList.filter((u) => u.gender === "male").length;
  const femaleCount = userList.filter((u) => u.gender === "female").length;

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
          <span className="admin-stat-num">{userList.length}</span>
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
          Users ({userList.length})
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
                    <td style={{ position: "relative" }}>
                      <img
                        src={user.photo_url || (user.gender === "female" ? "/default-female.png" : "/default-male.png")}
                        alt={user.name ?? ""}
                        className="admin-user-avatar"
                        style={{ cursor: user.photo_url ? "pointer" : "default" }}
                        onClick={() => user.photo_url && setPhotoMenuUser(photoMenuUser === user.id ? null : user.id)}
                      />
                      {photoMenuUser === user.id && user.photo_url && (
                        <div style={{
                          position: "absolute", top: 48, left: 0, zIndex: 10,
                          background: "#2a2a4a", borderRadius: 8, padding: 4,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.4)", minWidth: 140,
                        }}>
                          <button
                            onClick={() => { window.open(user.photo_url!, "_blank"); setPhotoMenuUser(null); }}
                            style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#fff", fontSize: 13, textAlign: "left", cursor: "pointer", borderRadius: 6 }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                          >
                            View Full Photo
                          </button>
                          <button
                            onClick={() => handlePhotoAction(user.id, "hide")}
                            style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#f59e0b", fontSize: 13, textAlign: "left", cursor: "pointer", borderRadius: 6 }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                          >
                            Hide Photo
                          </button>
                          <button
                            onClick={() => handlePhotoAction(user.id, "delete")}
                            style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#dc2626", fontSize: 13, textAlign: "left", cursor: "pointer", borderRadius: 6 }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                          >
                            Delete Photo
                          </button>
                        </div>
                      )}
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
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <button
                          className="admin-action-btn"
                          style={{ background: "#3b82f6", color: "#fff" }}
                          onClick={() => handleEdit(user)}
                          disabled={actionLoading === user.id}
                        >
                          Edit
                        </button>
                        {user.status === "approved" && (
                          <>
                            <button
                              className="admin-action-btn admin-action-suspend"
                              onClick={() => handleStatusChange(user.id, "suspended")}
                              disabled={actionLoading === user.id}
                            >
                              Suspend
                            </button>
                            <button
                              className="admin-action-btn"
                              style={{ background: "#f59e0b", color: "#fff" }}
                              onClick={() => handleStatusChange(user.id, "rejected")}
                              disabled={actionLoading === user.id}
                            >
                              Reject
                            </button>
                          </>
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
                        {user.status === "rejected" && (
                          <button
                            className="admin-action-btn admin-action-approve"
                            onClick={() => handleStatusChange(user.id, "approved")}
                            disabled={actionLoading === user.id}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          className="admin-action-btn"
                          style={{ background: "#dc2626", color: "#fff" }}
                          onClick={() => handleDelete(user.id, user.name || "")}
                          disabled={actionLoading === user.id}
                        >
                          Delete
                        </button>
                      </div>
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
      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={() => setEditingUser(null)}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 28, width: "90%", maxWidth: 480,
            maxHeight: "90vh", overflow: "auto",
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#1a1a2e" }}>
              Edit User: {editingUser.name || "Unknown"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Name
                <input type="text" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Age
                <input type="number" value={editForm.age || ""} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Gender
                <select value={editForm.gender || ""} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }}>
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Bio
                <textarea value={editForm.bio || ""} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4, resize: "vertical" }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Country
                <input type="text" value={editForm.country || ""} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Province
                <input type="text" value={editForm.province || ""} onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Looking For
                <select value={editForm.looking_for || ""} onChange={(e) => setEditForm({ ...editForm, looking_for: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }}>
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="everyone">Everyone</option>
                </select>
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                Status
                <select value={editForm.status || ""} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 4 }}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setEditingUser(null)}
                style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 14 }}>
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={actionLoading === editingUser.id}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#E8454A", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                {actionLoading === editingUser.id ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
