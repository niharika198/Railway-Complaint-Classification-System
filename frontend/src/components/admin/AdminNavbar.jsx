import { NavLink, useNavigate } from "react-router-dom";
import { TrainFront, LogOut } from "lucide-react";

import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-container">
        {/* BRAND */}
        <div className="admin-navbar-brand">
          <div className="admin-brand-icon">
            <TrainFront size={27} />
          </div>

          <h2>
            Railway Complaint
            <span>Classification System</span>
          </h2>
        </div>

        {/* NAVIGATION */}
        <nav className="admin-navbar-links">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Manage Complaints
          </NavLink>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default AdminNavbar;
