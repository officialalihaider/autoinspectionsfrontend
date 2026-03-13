// import React, { useState, useEffect } from "react";
// import { userAPI } from "../utils/api";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const initEdit = (u) => ({
//   name: u.name || "",
//   email: u.email || "",
//   role: u.role || "user",
//   isActive: u.isActive !== false,
//   password: "",
// });

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLd] = useState(true);
//   const [editUser, setEU] = useState(null); // user being edited
//   const [form, setForm] = useState({});
//   const [saving, setSv] = useState(false);
//   const [delUser, setDU] = useState(null);
//   const { user: me } = useAuth();
//   const navigate = useNavigate();

//   const load = () => {
//     setLd(true);
//     userAPI
//       .getAll()
//       .then((r) => setUsers(r.data.data))
//       .catch(() => toast.error("Failed to load users"))
//       .finally(() => setLd(false));
//   };

//   useEffect(() => {
//     if (me && me.role !== "admin") {
//       navigate("/");
//       toast.error("Admin only");
//       return;
//     }
//     load();
//   }, [me]);

//   const openEdit = (u) => {
//     setEU(u);
//     setForm(initEdit(u));
//   };

//   const saveEdit = async () => {
//     if (!form.name.trim() || !form.email.trim())
//       return toast.error("Name and email required");
//     setSv(true);
//     try {
//       await userAPI.update(editUser._id, form);
//       toast.success("User updated!");
//       setEU(null);
//       load();
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Update failed");
//     } finally {
//       setSv(false);
//     }
//   };

//   const doDelete = async () => {
//     try {
//       await userAPI.delete(delUser._id);
//       toast.success("User deleted");
//       setDU(null);
//       load();
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Delete failed");
//     }
//   };

//   const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   return (
//     <div>
//       <div className="card">
//         <div className="card-header d-flex align-items-center gap-2">
//           <span style={{ fontSize: "22px" }}>👥</span>
//           <span>All Users</span>
//           <span className="badge bg-danger ms-1">{users.length}</span>
//         </div>

//         {loading ? (
//           <div className="empty-state">
//             <div className="empty-icon">⏳</div>
//             <p>Loading users...</p>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">👤</div>
//             <p>No users found</p>
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Status</th>
//                   <th className="d-none d-md-table-cell">Joined</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id}>
//                     <td>
//                       <div className="d-flex align-items-center gap-2">
//                         <div
//                           style={{
//                             width: "38px",
//                             height: "38px",
//                             borderRadius: "50%",
//                             background:
//                               "linear-gradient(135deg,var(--primary),#b71c1c)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             color: "white",
//                             fontWeight: "800",
//                             fontSize: "16px",
//                             flexShrink: 0,
//                           }}
//                         >
//                           {u.name?.charAt(0)?.toUpperCase()}
//                         </div>
//                         <div>
//                           <div className="fw-bold" style={{ fontSize: "15px" }}>
//                             {u.name}
//                           </div>
//                           {u._id === me?._id && (
//                             <span
//                               className="badge bg-secondary"
//                               style={{ fontSize: "10px" }}
//                             >
//                               You
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td style={{ fontSize: "14px" }}>{u.email}</td>
//                     <td>
//                       <span
//                         className={`badge ${u.role === "admin" ? "bg-danger" : "bg-primary"}`}
//                         style={{ fontSize: "12px" }}
//                       >
//                         {u.role === "admin" ? "👑 Admin" : "👤 User"}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`badge ${u.isActive !== false ? "bg-success" : "bg-secondary"}`}
//                         style={{ fontSize: "12px" }}
//                       >
//                         {u.isActive !== false ? "● Active" : "○ Inactive"}
//                       </span>
//                     </td>
//                     <td className="d-none d-md-table-cell text-muted-ag">
//                       {new Date(u.createdAt).toLocaleDateString("en-PK")}
//                     </td>
//                     <td>
//                       <div className="d-flex gap-2">
//                         <button
//                           className="btn btn-outline-secondary btn-sm"
//                           onClick={() => openEdit(u)}
//                         >
//                           ✏️ Edit
//                         </button>
//                         {u._id !== me?._id && (
//                           <button
//                             className="btn btn-outline-danger btn-sm"
//                             onClick={() => setDU(u)}
//                           >
//                             🗑
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Edit User Modal */}
//       {editUser && (
//         <div
//           className="modal show d-block"
//           style={{
//             background: "rgba(0,0,0,0.75)",
//             backdropFilter: "blur(4px)",
//           }}
//         >
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">✏️ Edit User: {editUser.name}</h5>
//                 <button className="btn-close" onClick={() => setEU(null)} />
//               </div>
//               <div className="modal-body">
//                 <div className="row g-3">
//                   <div className="col-12 col-sm-6">
//                     <label className="form-label">Full Name</label>
//                     <input
//                       className="form-control"
//                       value={form.name}
//                       onChange={(e) => setF("name", e.target.value)}
//                       placeholder="Full name"
//                     />
//                   </div>
//                   <div className="col-12 col-sm-6">
//                     <label className="form-label">Email Address</label>
//                     <input
//                       className="form-control"
//                       type="email"
//                       value={form.email}
//                       onChange={(e) => setF("email", e.target.value)}
//                       placeholder="Email"
//                     />
//                   </div>
//                   <div className="col-12 col-sm-6">
//                     <label className="form-label">Role</label>
//                     <select
//                       className="form-select"
//                       value={form.role}
//                       onChange={(e) => setF("role", e.target.value)}
//                     >
//                       <option value="user">
//                         👤 User (can view own inspections)
//                       </option>
//                       <option value="admin">👑 Admin (full access)</option>
//                     </select>
//                   </div>
//                   <div className="col-12 col-sm-6">
//                     <label className="form-label">Account Status</label>
//                     <select
//                       className="form-select"
//                       value={form.isActive ? "active" : "inactive"}
//                       onChange={(e) =>
//                         setF("isActive", e.target.value === "active")
//                       }
//                     >
//                       <option value="active">● Active</option>
//                       <option value="inactive">
//                         ○ Inactive (cannot login)
//                       </option>
//                     </select>
//                   </div>
//                   <div className="col-12">
//                     <label className="form-label">
//                       New Password{" "}
//                       <span className="text-muted-ag">
//                         (leave blank to keep existing)
//                       </span>
//                     </label>
//                     <input
//                       className="form-control"
//                       type="password"
//                       value={form.password}
//                       onChange={(e) => setF("password", e.target.value)}
//                       placeholder="Min 6 characters or leave blank"
//                     />
//                   </div>
//                 </div>
//                 {form.role === "admin" && editUser.role !== "admin" && (
//                   <div
//                     className="alert alert-warning mt-3 mb-0"
//                     style={{ fontSize: "13px" }}
//                   >
//                     ⚠️ You are granting <strong>Admin</strong> access. This user
//                     will be able to create, edit and delete all inspections.
//                   </div>
//                 )}
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => setEU(null)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-danger"
//                   onClick={saveEdit}
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <span className="spinner-sm me-2" />
//                       Saving...
//                     </>
//                   ) : (
//                     "💾 Save Changes"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {delUser && (
//         <div
//           className="modal show d-block"
//           style={{
//             background: "rgba(0,0,0,0.75)",
//             backdropFilter: "blur(4px)",
//           }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">⚠️ Delete User?</h5>
//                 <button className="btn-close" onClick={() => setDU(null)} />
//               </div>
//               <div className="modal-body">
//                 <p style={{ fontSize: "15px" }}>
//                   Delete <strong>{delUser.name}</strong> ({delUser.email})?
//                 </p>
//                 <p className="text-muted-ag mb-0">
//                   This action cannot be undone.
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => setDU(null)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-danger" onClick={doDelete}>
//                   🗑 Delete User
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { userAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initEdit = (u) => ({
  name: u.name || "",
  email: u.email || "",
  role: u.role || "user",
  isActive: u.isActive !== false,
  password: "",
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLd] = useState(true);
  const [editUser, setEU] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSv] = useState(false);
  const [delUser, setDU] = useState(null);
  const { user: me } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    setLd(true);
    userAPI
      .getAll()
      .then((r) => setUsers(r.data.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLd(false));
  };

  useEffect(() => {
    if (me && me.role !== "admin") {
      navigate("/");
      toast.error("Admin only");
      return;
    }
    load();
  }, [me]);

  const openEdit = (u) => { setEU(u); setForm(initEdit(u)); };

  const saveEdit = async () => {
    if (!form.name.trim() || !form.email.trim())
      return toast.error("Name and email required");
    setSv(true);
    try {
      await userAPI.update(editUser._id, form);
      toast.success("User updated!");
      setEU(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setSv(false);
    }
  };

  const doDelete = async () => {
    try {
      await userAPI.delete(delUser._id);
      toast.success("User deleted");
      setDU(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="up-root">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .up-root { width: 100%; max-width: 100%; overflow-x: hidden; }

        /* ── Header card ── */
        .up-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .up-card-head {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f5;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 700;
          color: #212529;
        }
        .up-badge {
          background: var(--primary, #e63946);
          color: #fff;
          border-radius: 99px;
          padding: 2px 10px;
          font-size: 13px;
          font-weight: 700;
        }

        /* ── Empty state ── */
        .up-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 20px;
          color: #adb5bd;
        }
        .up-empty-icon { font-size: 48px; margin-bottom: 12px; }

        /* ── Desktop table ── */
        .up-table-wrap { overflow-x: auto; }
        .up-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .up-table thead tr {
          background: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
        }
        .up-table th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #6c757d;
          white-space: nowrap;
        }
        .up-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f3f5;
          vertical-align: middle;
        }
        .up-table tbody tr:hover { background: #fafafa; }
        .up-table tbody tr:last-child td { border-bottom: none; }

        .up-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary, #e63946), #b71c1c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 16px;
          flex-shrink: 0;
        }
        .up-name { font-weight: 700; font-size: 15px; color: #212529; }
        .up-you  { font-size: 10px; background: #e9ecef; color: #495057; border-radius: 4px; padding: 1px 6px; font-weight: 600; }

        .up-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 99px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
        .up-chip-admin   { background: #fdecea; color: #c0392b; }
        .up-chip-user    { background: #e8f0fe; color: #1a5276; }
        .up-chip-active  { background: #e8f8f0; color: #1e8449; }
        .up-chip-inactive{ background: #f1f3f5; color: #6c757d; }

        .up-btn-edit {
          display: inline-flex; align-items: center; gap: 5px;
          height: 34px; padding: 0 14px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1.5px solid #dee2e6; background: #fff; color: #495057;
          transition: all 0.18s;
        }
        .up-btn-edit:hover { background: #f8f9fa; border-color: #adb5bd; }

        .up-btn-del {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          font-size: 15px; cursor: pointer;
          border: 1.5px solid #ffcdd2; background: #fff; color: #e63946;
          transition: all 0.18s;
        }
        .up-btn-del:hover { background: #fdecea; border-color: #e63946; }

        /* ── Mobile cards — shown < 640px ── */
        .up-mobile-list { display: none; padding: 12px; }
        .up-user-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .up-user-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .up-user-card-info { flex: 1; min-width: 0; }
        .up-user-card-name {
          font-weight: 700;
          font-size: 15px;
          color: #212529;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .up-user-card-email {
          font-size: 13px;
          color: #6c757d;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .up-user-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .up-user-card-date {
          font-size: 12px;
          color: #adb5bd;
          margin-left: auto;
        }
        .up-user-card-actions {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #f1f3f5;
        }
        .up-user-card-actions .up-btn-edit { flex: 1; justify-content: center; }

        @media (max-width: 640px) {
          .up-table-wrap  { display: none; }
          .up-mobile-list { display: block; }
        }

        /* ── Modal ── */
        .up-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .up-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .up-modal-head {
          padding: 18px 20px;
          border-bottom: 1px solid #f1f3f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 700;
          color: #212529;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 1;
          border-radius: 18px 18px 0 0;
        }
        .up-modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: #f1f3f5; cursor: pointer;
          font-size: 16px; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .up-modal-close:hover { background: #e9ecef; }
        .up-modal-body { padding: 20px; }
        .up-modal-foot {
          padding: 16px 20px;
          border-top: 1px solid #f1f3f5;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ── Modal form grid ── */
        .up-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 480px) {
          .up-form-grid { grid-template-columns: 1fr; }
        }
        .up-span-2 { grid-column: 1 / -1; }

        .up-flabel {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #6c757d;
          margin-bottom: 7px;
        }
        .up-finput {
          width: 100%;
          height: 46px;
          font-size: 15px;
          border-radius: 10px;
          border: 1.5px solid #dee2e6;
          padding: 0 14px;
          color: #212529;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }
        .up-finput:focus {
          border-color: var(--primary, #e63946);
          box-shadow: 0 0 0 3px rgba(230,57,70,0.12);
          outline: none;
        }

        .up-warn {
          background: #fff8e1; border: 1px solid #ffe082;
          border-radius: 10px; padding: 12px 14px;
          font-size: 13px; color: #7a6500; margin-top: 14px;
        }

        /* ── Action buttons ── */
        .up-action-btn {
          height: 44px; padding: 0 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          border: none; transition: all 0.18s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .up-action-cancel {
          background: #fff; border: 1.5px solid #dee2e6; color: #495057;
        }
        .up-action-cancel:hover { background: #f8f9fa; }
        .up-action-save {
          background: var(--primary, #e63946); color: #fff;
          box-shadow: 0 4px 12px rgba(230,57,70,0.28);
        }
        .up-action-save:hover:not(:disabled) { filter: brightness(1.08); }
        .up-action-save:disabled { opacity: 0.7; cursor: not-allowed; }
        .up-action-del {
          background: var(--primary, #e63946); color: #fff;
          box-shadow: 0 4px 12px rgba(230,57,70,0.28);
        }
        .up-action-del:hover { filter: brightness(1.08); }
      `}</style>

      <div className="up-card">
        {/* Header */}
        <div className="up-card-head">
          <span style={{ fontSize: "22px" }}>👥</span>
          <span>All Users</span>
          <span className="up-badge">{users.length}</span>
        </div>

        {/* Loading / empty */}
        {loading ? (
          <div className="up-empty">
            <div className="up-empty-icon">⏳</div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="up-empty">
            <div className="up-empty-icon">👤</div>
            <p>No users found</p>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="up-table-wrap">
              <table className="up-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="up-avatar">{u.name?.charAt(0)?.toUpperCase()}</div>
                          <div>
                            <div className="up-name">{u.name}</div>
                            {u._id === me?._id && <span className="up-you">You</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "#495057" }}>{u.email}</td>
                      <td>
                        <span className={`up-chip ${u.role === "admin" ? "up-chip-admin" : "up-chip-user"}`}>
                          {u.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td>
                        <span className={`up-chip ${u.isActive !== false ? "up-chip-active" : "up-chip-inactive"}`}>
                          {u.isActive !== false ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td style={{ color: "#adb5bd", fontSize: "13px" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-PK")}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="up-btn-edit" onClick={() => openEdit(u)}>✏️ Edit</button>
                          {u._id !== me?._id && (
                            <button className="up-btn-del" onClick={() => setDU(u)}>🗑</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="up-mobile-list">
              {users.map((u) => (
                <div className="up-user-card" key={u._id}>
                  <div className="up-user-card-top">
                    <div className="up-avatar" style={{ width: 46, height: 46, fontSize: 18 }}>
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="up-user-card-info">
                      <div className="up-user-card-name">
                        {u.name}
                        {u._id === me?._id && <span className="up-you">You</span>}
                      </div>
                      <div className="up-user-card-email">{u.email}</div>
                    </div>
                  </div>
                  <div className="up-user-card-meta">
                    <span className={`up-chip ${u.role === "admin" ? "up-chip-admin" : "up-chip-user"}`}>
                      {u.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                    <span className={`up-chip ${u.isActive !== false ? "up-chip-active" : "up-chip-inactive"}`}>
                      {u.isActive !== false ? "● Active" : "○ Inactive"}
                    </span>
                    <span className="up-user-card-date">
                      {new Date(u.createdAt).toLocaleDateString("en-PK")}
                    </span>
                  </div>
                  <div className="up-user-card-actions">
                    <button className="up-btn-edit" onClick={() => openEdit(u)}>✏️ Edit</button>
                    {u._id !== me?._id && (
                      <button className="up-btn-del" onClick={() => setDU(u)}>🗑</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="up-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEU(null)}>
          <div className="up-modal">
            <div className="up-modal-head">
              <span>✏️ Edit User: {editUser.name}</span>
              <button className="up-modal-close" onClick={() => setEU(null)}>✕</button>
            </div>
            <div className="up-modal-body">
              <div className="up-form-grid">
                <div>
                  <label className="up-flabel">Full Name</label>
                  <input className="up-finput" value={form.name} onChange={(e) => setF("name", e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <label className="up-flabel">Email Address</label>
                  <input className="up-finput" type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} placeholder="Email" />
                </div>
                <div>
                  <label className="up-flabel">Role</label>
                  <select className="up-finput" value={form.role} onChange={(e) => setF("role", e.target.value)}>
                    <option value="user">👤 User (can view own inspections)</option>
                    <option value="admin">👑 Admin (full access)</option>
                  </select>
                </div>
                <div>
                  <label className="up-flabel">Account Status</label>
                  <select className="up-finput" value={form.isActive ? "active" : "inactive"} onChange={(e) => setF("isActive", e.target.value === "active")}>
                    <option value="active">● Active</option>
                    <option value="inactive">○ Inactive (cannot login)</option>
                  </select>
                </div>
                <div className="up-span-2">
                  <label className="up-flabel">
                    New Password <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#adb5bd" }}>(leave blank to keep existing)</span>
                  </label>
                  <input className="up-finput" type="password" value={form.password} onChange={(e) => setF("password", e.target.value)} placeholder="Min 6 characters or leave blank" />
                </div>
              </div>
              {form.role === "admin" && editUser.role !== "admin" && (
                <div className="up-warn">
                  ⚠️ You are granting <strong>Admin</strong> access. This user will be able to create, edit and delete all inspections.
                </div>
              )}
            </div>
            <div className="up-modal-foot">
              <button className="up-action-btn up-action-cancel" onClick={() => setEU(null)}>Cancel</button>
              <button className="up-action-btn up-action-save" onClick={saveEdit} disabled={saving}>
                {saving ? <><span className="spinner-sm me-1" />Saving...</> : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {delUser && (
        <div className="up-modal-overlay" onClick={(e) => e.target === e.currentTarget && setDU(null)}>
          <div className="up-modal" style={{ maxWidth: 420 }}>
            <div className="up-modal-head">
              <span>⚠️ Delete User?</span>
              <button className="up-modal-close" onClick={() => setDU(null)}>✕</button>
            </div>
            <div className="up-modal-body">
              <p style={{ fontSize: "15px", marginBottom: "8px" }}>
                Delete <strong>{delUser.name}</strong> ({delUser.email})?
              </p>
              <p style={{ fontSize: "13px", color: "#6c757d", margin: 0 }}>
                This action cannot be undone.
              </p>
            </div>
            <div className="up-modal-foot">
              <button className="up-action-btn up-action-cancel" onClick={() => setDU(null)}>Cancel</button>
              <button className="up-action-btn up-action-del" onClick={doDelete}>🗑 Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}