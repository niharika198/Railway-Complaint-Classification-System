import { useState } from "react";
import {
  TrainFront,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
} from "lucide-react";

import "./AdminLogin.css";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please enter your email and password.");
      return;
    }

    // Backend authentication will be connected in a later step.
    setMessage("Admin authentication is not connected yet.");
  };

  return (
    <div className="admin-login-page">
      <section className="admin-login-hero">
        <div className="admin-login-left">
          <p className="admin-login-label">ADMINISTRATION PORTAL</p>

          <h1>
            Manage Railway
            <span> Complaints</span>
          </h1>

          <p className="admin-login-description">
            Access the administration portal to monitor complaints, manage their
            status and oversee the complaint resolution process.
          </p>
        </div>

        <div className="admin-login-card">
          <div className="admin-login-icon">
            <TrainFront size={48} strokeWidth={2.5} />
          </div>

          <div className="admin-login-badge">
            <ShieldCheck size={17} />
            Authorized Personnel Only
          </div>

          <h2>Administrator Login</h2>

          <p className="admin-login-subtitle">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <div className="admin-login-form-group">
              <label>
                Email Address <span>*</span>
              </label>

              <div className="admin-login-input-wrapper">
                <Mail size={21} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-login-form-group">
              <label>
                Password <span>*</span>
              </label>

              <div className="admin-login-input-wrapper">
                <Lock size={21} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                </button>
              </div>
            </div>

            {message && (
              <p className="admin-login-message" role="alert">
                {message}
              </p>
            )}

            <button type="submit" className="admin-login-submit-btn">
              <LogIn size={21} />
              Login as Administrator
            </button>
          </form>

          <div className="admin-login-divider">
            <span></span>
            <p>SECURE ACCESS</p>
            <span></span>
          </div>

          <p className="admin-login-footer-text">
            This portal is restricted to authorized administrators.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AdminLogin;
