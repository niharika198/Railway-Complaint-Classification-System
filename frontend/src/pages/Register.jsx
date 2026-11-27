import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Ticket,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  Bell,
  User,
  UserPlus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pnr: "",
    password: "",
    confirmPassword: "",
    userType: "Passenger",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.pnr.trim())) {
      alert("Please enter a valid 10-digit PNR number.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        pnr: formData.pnr.trim(),
        password: formData.password,
      });

      alert(response.message || "Registration successful!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        pnr: "",
        password: "",
        confirmPassword: "",
        userType: "Passenger",
        terms: false,
      });

      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <ShieldCheck size={34} />,
      title: "Submit Complaints",
      description:
        "Quickly register and file your complaint about any railway issue.",
    },
    {
      icon: <Search size={34} />,
      title: "Track Status",
      description: "Monitor your complaint progress in real time.",
    },
    {
      icon: <Bell size={34} />,
      title: "Get Updates",
      description: "Receive timely notifications and resolution details.",
    },
    {
      icon: <User size={34} />,
      title: "Personalized Dashboard",
      description: "Manage your complaints and profile all in one place.",
    },
  ];

  return (
    <div className="register-page">
      <Navbar />

      <main className="register-main">
        {/* HERO SECTION */}

        <section className="register-hero">
          <div className="register-hero-content">
            <p className="register-hero-label">JOIN OUR COMMUNITY</p>

            <h1>
              Create Your <span>Account</span>
            </h1>

            <p className="register-hero-description">
              Register to submit complaints, track your issues and get the
              latest updates about your railway journey.
            </p>
          </div>
        </section>

        {/* REGISTRATION SECTION */}

        <section className="register-content">
          {/* REGISTER FORM */}

          <div className="register-card">
            <div className="register-heading">
              <div className="register-heading-icon">
                <UserRound size={38} />
              </div>

              <div>
                <h2>Register</h2>
                <p>Create your account to get started.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="register-form-grid">
                {/* FULL NAME */}

                <div className="register-field">
                  <label>
                    Full Name <span>*</span>
                  </label>

                  <div className="register-input-wrapper">
                    <UserRound size={18} />

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="register-field">
                  <label>
                    Email Address <span>*</span>
                  </label>

                  <div className="register-input-wrapper">
                    <Mail size={18} />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div className="register-field">
                  <label>
                    Phone Number <span>*</span>
                  </label>

                  <div className="register-input-wrapper">
                    <Phone size={18} />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      pattern="[0-9+\-\s]{10,15}"
                      required
                    />
                  </div>
                </div>

                {/* PNR */}

                <div className="register-field">
                  <label>
                    PNR Number <span>*</span>
                  </label>

                  <div className="register-input-wrapper">
                    <Ticket size={18} />

                    <input
                      type="text"
                      name="pnr"
                      placeholder="Enter 10 digit PNR"
                      value={formData.pnr}
                      onChange={handleChange}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div className="register-field">
                  <label>
                    Password <span>*</span>
                  </label>

                  <div className="register-input-wrapper">
                    <LockKeyhole size={18} />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}

                <div className="register-field">
                  <label>
                    Confirm Password <span>*</span>
                  </label>

                  <div className="register-input-wrapper">
                    <LockKeyhole size={18} />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* USER TYPE */}

              <div className="register-field user-type-field">
                <label>
                  User Type <span>*</span>
                </label>

                <div className="register-input-wrapper">
                  <User size={18} />

                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Passenger">Passenger</option>
                  </select>
                </div>
              </div>

              {/* TERMS AND CONDITIONS */}

              <div className="register-terms">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />

                <label htmlFor="terms">
                  I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="register-submit-btn"
                disabled={isLoading}
              >
                <UserPlus size={20} />
                {isLoading ? "Registering..." : "Register"}
              </button>

              {/* LOGIN LINK */}

              <p className="register-login-text">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>

          {/* WHY REGISTER PANEL */}

          <aside className="register-benefits">
            <div className="benefits-heading">
              <h2>Why Register?</h2>

              <p>Get the most out of our railway complaint system.</p>
            </div>

            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div className="benefit-item" key={index}>
                  <div className="benefit-icon">{benefit.icon}</div>

                  <div className="benefit-text">
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="benefits-train-image"></div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
