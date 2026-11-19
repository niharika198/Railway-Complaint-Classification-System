import { NavLink, Link } from "react-router-dom";
import { TrainFront } from "lucide-react";
import "./Navbar.css";

function Navbar() {
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
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
