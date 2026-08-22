import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-brand">🗳️ SecureVote</div>
      <nav className="nav-links">
        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/signup">Signup</Link>}
        {token && role === "voter" && <Link to="/dashboard">Vote</Link>}
        {token && role === "admin" && <Link to="/admin">Manage Candidates</Link>}
        {token && role === "admin" && <Link to="/admin/results">Results</Link>}
        {token && <Link to="/change-password">Change Password</Link>}
      </nav>
      {token && (
        <div className="nav-user">
          <span className="user-badge">{role === "admin" ? "Admin" : "Voter"}{userName ? ` · ${userName}` : ""}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}