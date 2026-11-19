import { useState } from "react";
import { Link } from "react-router-dom";
import { TrainFront, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    // Connect your backend login API here.
    console.log("Login Details:", {
      ...formData,
      rememberMe,
    });
  };

  return (
    <div className="login-page">
      {/* Existing Navbar */}
      <Navbar />

      {/* Login Hero Section */}
      <section className="login-hero">
        {/* Left Content */}
        <div className="login-left">
          <p className="login-label">WELCOME BACK</p>

          <h1>
            Login to Your
            <span> Account</span>
          </h1>

          <p className="login-description">
            Access your account to submit complaints, track status and get the
            latest updates.
          </p>
        </div>

        {/* Right Login Card */}
        <div className="login-card">
          <div className="login-icon">
            <TrainFront size={55} strokeWidth={2.5} />
          </div>

          <h2>Login</h2>

          <p className="login-subtitle">Sign in to continue</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-form-group">
              <label>
                Email Address <span>*</span>
              </label>

              <div className="login-input-wrapper">
                <Mail size={23} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-form-group">
              <label>
                Password <span>*</span>
              </label>

              <div className="login-input-wrapper">
                <Lock size={23} />

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
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-submit-btn">
              <LogIn size={25} />
              Login
            </button>
          </form>

          {/* OR Divider */}
          <div className="login-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          {/* Register Link */}
          <p className="register-redirect">
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </div>
      </section>

      {/* Existing Footer */}
      <Footer />
    </div>
  );
}

export default Login;