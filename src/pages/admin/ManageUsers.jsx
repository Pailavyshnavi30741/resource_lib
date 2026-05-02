import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/admin.css";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john@gmail.com", role: "Admin", status: "Active" },
    { id: 2, name: "Olivia Bennett", email: "olivia@gmail.com", role: "User", status: "Inactive" },
    { id: 3, name: "Daniel Warren", email: "daniel@gmail.com", role: "User", status: "Banned" },
    { id: 4, name: "Chloe Hayes", email: "chloe@gmail.com", role: "User", status: "Active" },
  ]);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" || user.status === statusFilter)
    );
  });

  return (
    <AdminLayout>
      <div className="admin-wrapper">
        <div className="admin-container">

          <div className="header-row">
            <div>
              <h2 className="page-title">User Management</h2>
              <p className="page-subtitle">
                Control access, assign roles, and manage platform users.
              </p>
            </div>
            <button className="add-user-btn">+ Add User</button>
          </div>

          {/* Controls */}
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search user..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Banned">Banned</option>
            </select>
          </div>

          {/* Table */}
          <div className="table-card">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-cell">
                      <div className="avatar">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn">✏️</button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <p className="no-data">No users found.</p>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;