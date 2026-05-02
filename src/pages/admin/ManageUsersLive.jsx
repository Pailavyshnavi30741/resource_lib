import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { deleteUserById, getAllUsers } from "../../utils/userStore";
import "../../styles/admin.css";

const ManageUsersLive = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const liveUsers = await getAllUsers();
        setUsers(liveUsers);
      } catch (err) {
        setError(err.message || "Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUserById(id);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const formattedRole = user.role === "admin" ? "Admin" : "User";

    return (
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === "All" || formattedRole === roleFilter)
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
                View and manage real users registered in your database.
              </p>
            </div>
            <button className="add-user-btn" disabled>
              Live Users
            </button>
          </div>

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
          </div>

          {error && <p className="no-data">{error}</p>}
          {loading && <p className="no-data">Loading users...</p>}

          <div className="table-card">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-cell">
                      <div className="avatar">{user.name.charAt(0)}</div>
                      {user.name}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role === "admin" ? "Admin" : "User"}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filteredUsers.length === 0 && (
              <p className="no-data">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsersLive;
