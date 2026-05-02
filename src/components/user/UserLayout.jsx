import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/user.css";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="user-layout">

      {/* Sidebar */}
      <aside className="user-sidebar">
        <h2 className="user-logo">EduNexus</h2>

        <nav className="user-nav">

          <Link
            to="/home"
            className={location.pathname.includes("home") ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/search"
            className={location.pathname.includes("search") ? "active" : ""}
          >
            Search
          </Link>

          <Link
            to="/profile"
            className={location.pathname.includes("profile") ? "active" : ""}
          >
            Profile
          </Link>

          <Link
            to="/feedback"
            className={location.pathname.includes("feedback") ? "active" : ""}
          >
            Feedback
          </Link>

        </nav>

        <button className="user-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="user-content">
        {children}
      </main>

    </div>
  );
};

export default UserLayout;