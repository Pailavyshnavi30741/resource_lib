import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-logo">EduNexus</h2>

        <nav className="sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={location.pathname.includes("dashboard") ? "active" : ""}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/upload"
            className={location.pathname.includes("upload") ? "active" : ""}
          >
            Upload Resource
          </Link>

          <Link
            to="/admin/users"
            className={location.pathname.includes("users") ? "active" : ""}
          >
            Manage Users
          </Link>

          <Link
            to="/admin/feedback"
            className={location.pathname.includes("feedback") ? "active" : ""}
          >
            Feedback
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;