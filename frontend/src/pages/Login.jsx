import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { TrainFront, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState("passenger");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Send login request to FastAPI
      const response = await api.post("/auth/login", formData);

      const { access_token, user } = response;

      if (!access_token || !user) {
        throw new Error("Invalid response from server.");
      }

      // Verify user role
      const expectedRole = loginType === "admin" ? "admin" : "user";

      if (user.role !== expectedRole) {
        setError(
          loginType === "admin"
            ? "Access denied. This account is not an administrator."
            : "Please select Admin Login for this account.",
        );
        return;
      }

      // Clear previous login data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");

      // Store login information
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", access_token);
      storage.setItem("user", JSON.stringify(user));

      // Redirect according to role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      {/* LOGIN HERO SECTION */}
      <section className="login-hero">
        {/* LEFT CONTENT */}
        <div className="login-left">
          <p className="login-label">
            {loginType === "admin" ? "ADMINISTRATION PORTAL" : "WELCOME BACK"}
          </p>

          <h1>
            {loginType === "admin" ? (
              <>
                Admin
                <span> Login</span>
              </>
            ) : (
              <>
                Login to Your
                <span> Account</span>
              </>
            )}
          </h1>

          <p className="login-description">
            {loginType === "admin"
              ? "Access the administration portal to monitor passenger complaints and manage their resolution."
              : "Access your account to submit complaints, track status and get the latest updates."}
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">
          {/* LOGIN TYPE TOGGLE */}
          <div className="login-type-toggle">
            <button
              type="button"
              className={loginType === "passenger" ? "selected" : ""}
              onClick={() => {
                setLoginType("passenger");
                setError("");
              }}
            >
              Passenger
            </button>

            <button
              type="button"
              className={loginType === "admin" ? "selected" : ""}
              onClick={() => {
                setLoginType("admin");
                setError("");
              }}
            >
              Admin
            </button>
          </div>

          <div className="login-icon">
            <TrainFront size={55} strokeWidth={2.5} />
          </div>

          <h2>{loginType === "admin" ? "Admin Login" : "Passenger Login"}</h2>

          <p className="login-subtitle">
            {loginType === "admin"
              ? "Sign in to access the administration portal"
              : "Sign in to continue"}
          </p>

          {/* ERROR MESSAGE */}
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
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

            {/* PASSWORD */}
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

            {/* REMEMBER ME AND FORGOT PASSWORD */}
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

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              <LogIn size={25} />

              {loading
                ? "Signing In..."
                : loginType === "admin"
                  ? "Login as Admin"
                  : "Login as Passenger"}
            </button>
          </form>

          {/* OR DIVIDER */}
          <div className="login-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          {/* REGISTER LINK */}
          <p className="register-redirect">
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Login;
