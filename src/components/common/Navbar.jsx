import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/navbar.css";

const Navbar = () => {
  const { userRole, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2>EduNexus</h2>

      <div className="nav-links">
        {userRole === "user" && (
          <>
            <Link to="/home">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {userRole === "admin" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/upload">Upload</Link>
            <Link to="/admin/users">Users</Link>
          </>
        )}

        {userRole && (
          <Link to="/" onClick={logout} className="logout-btn">
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;