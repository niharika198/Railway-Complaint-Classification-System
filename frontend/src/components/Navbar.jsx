import { NavLink, Link, useNavigate } from "react-router-dom";
import { TrainFront } from "lucide-react";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <div className="brand-logo">
          <TrainFront size={30} />
        </div>

        <div className="brand-text">
          <strong>Railway Complaint</strong>
          <strong>Classification System</strong>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/track-complaint">Track Complaint</NavLink>

        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </nav>

      <div className="nav-buttons">
        {!user ? (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "admin" ? (
              <Link to="/admin/dashboard" className="login-btn">
                Dashboard
              </Link>
            ) : (
              <Link to="/track-complaint" className="login-btn">
                My Complaints
              </Link>
            )}

            <button
              type="button"
              className="register-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
