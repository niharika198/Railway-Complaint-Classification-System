import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  CalendarDays,
  MapPin,
  TrainFront,
  Ticket,
  FileText,
  ShieldCheck,
  CheckCircle,
  Cpu,
  Bell,
  Send,
  Info,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import "./SubmitComplaint.css";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  pnr: "",
  trainNumber: "",
  journeyDate: "",
  fromStation: "",
  toStation: "",
  description: "",
};

function SubmitComplaint() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token) {
      setErrorMessage(
        "Your session has expired. Please log in again before submitting.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post(
        "/complaints/submit",
        {
          complaint_text: formData.description.trim(),
        },
        token,
      );

      const actualComplaintId = response?.complaint?.id;

      if (!actualComplaintId) {
        throw new Error(
          "Complaint was submitted, but the server did not return a complaint ID.",
        );
      }

      setComplaintId(actualComplaintId);
      setSubmitted(true);
    } catch (error) {
      console.error("Complaint submission error:", error);

      setErrorMessage(
        error.message || "Unable to submit your complaint. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setFormData(initialFormData);
    setComplaintId("");
    setErrorMessage("");
  };

  if (submitted) {
    return (
      <div className="rcc-page">
        <Navbar />

        <div className="rcc-success">
          <div className="rcc-success-card">
            <div className="rcc-success-icon">
              <CheckCircle size={42} />
            </div>

            <h1>Complaint Submitted!</h1>

            <p>
              Your complaint has been submitted successfully. Our AI-based
              classification system will analyze your complaint and identify the
              appropriate department.
            </p>

            <div className="rcc-id-box">
              <span>Your Complaint ID</span>
              <strong>{complaintId}</strong>
            </div>

            <p>
              Please save your complaint ID to track the status of your
              complaint.
            </p>

            <button className="rcc-primary-btn" onClick={handleSubmitAnother}>
              Submit Another Complaint
            </button>

            <a href="/track-complaint" className="rcc-secondary-btn">
              Track Complaint
            </a>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="rcc-page">
      <Navbar />

      {/* HERO SECTION */}
      <section className="rcc-hero">
        <div className="rcc-hero-content">
          <div className="rcc-eyebrow">
            RAILWAY COMPLAINT CLASSIFICATION SYSTEM
          </div>

          <h1>
            Submit a <span>Complaint</span>
          </h1>

          <p>
            Share the details of your issue and help us resolve it faster.
            <br />
            Our system uses AI to classify your complaint and
            <br className="desktop-break" />
            ensure it reaches the right department.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="rcc-main">
        {/* LEFT SIDEBAR */}
        <aside className="rcc-left-panel">
          <div className="rcc-steps">
            <div className="rcc-step">
              <div className="rcc-step-number">1</div>

              <div className="rcc-step-text">
                <strong>Passenger Information</strong>
                <span>Tell us about yourself</span>
              </div>

              <div className="rcc-step-line"></div>
            </div>

            <div className="rcc-step">
              <div className="rcc-step-number">2</div>

              <div className="rcc-step-text">
                <strong>Journey Details</strong>
                <span>Provide train and travel details</span>
              </div>

              <div className="rcc-step-line"></div>
            </div>

            <div className="rcc-step">
              <div className="rcc-step-number">3</div>

              <div className="rcc-step-text">
                <strong>Complaint Details</strong>
                <span>Describe your issue</span>
              </div>

              <div className="rcc-step-line"></div>
            </div>

            <div className="rcc-step">
              <div className="rcc-step-number">4</div>

              <div className="rcc-step-text">
                <strong>Review & Submit</strong>
                <span>Confirm and submit your complaint</span>
              </div>
            </div>
          </div>

          <div className="rcc-register-info">
            <div className="rcc-info-heading">
              <ShieldCheck size={25} />
              <strong>Why Register?</strong>
            </div>

            <ul>
              <li>
                <CheckCircle size={14} />
                Track your complaint status
              </li>

              <li>
                <CheckCircle size={14} />
                Get timely updates
              </li>

              <li>
                <CheckCircle size={14} />
                Help us improve railway services
              </li>
            </ul>

            <div className="rcc-sidebar-train">
              <TrainFront size={100} strokeWidth={1} />
            </div>
          </div>
        </aside>

        {/* CENTER COMPLAINT FORM */}
        <section className="rcc-form-panel">
          <form onSubmit={handleSubmit}>
            {/* PASSENGER INFORMATION */}
            <div className="rcc-form-section">
              <h2>Passenger Information</h2>

              <p className="rcc-section-description">
                Please provide your basic details to register the complaint.
              </p>

              <div className="rcc-fields-grid">
                <div className="rcc-field">
                  <label>Full Name *</label>

                  <div className="rcc-input">
                    <User size={15} />

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="rcc-field">
                  <label>Email Address *</label>

                  <div className="rcc-input">
                    <Mail size={15} />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="rcc-field">
                  <label>Phone Number *</label>

                  <div className="rcc-input">
                    <Phone size={15} />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="[0-9+\-\s]{10,15}"
                      required
                    />
                  </div>
                </div>

                <div className="rcc-field">
                  <label>PNR Number</label>

                  <div className="rcc-input">
                    <Ticket size={15} />

                    <input
                      type="text"
                      name="pnr"
                      placeholder="Enter 10 digit PNR"
                      value={formData.pnr}
                      onChange={handleChange}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Enter a valid 10 digit PNR number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* JOURNEY DETAILS */}
            <div className="rcc-form-section">
              <h2>Journey Details</h2>

              <p className="rcc-section-description">
                Provide your train and travel information.
              </p>

              <div className="rcc-fields-grid">
                <div className="rcc-field">
                  <label>Train Number *</label>

                  <div className="rcc-input">
                    <TrainFront size={15} />

                    <input
                      type="text"
                      name="trainNumber"
                      placeholder="e.g. 12002"
                      value={formData.trainNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="rcc-field">
                  <label>Journey Date *</label>

                  <div className="rcc-input">
                    <CalendarDays size={15} />

                    <input
                      type="date"
                      name="journeyDate"
                      value={formData.journeyDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="rcc-field">
                  <label>From Station *</label>

                  <div className="rcc-input">
                    <MapPin size={15} />

                    <input
                      type="text"
                      name="fromStation"
                      placeholder="Enter source station"
                      value={formData.fromStation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="rcc-field">
                  <label>To Station *</label>

                  <div className="rcc-input">
                    <MapPin size={15} />

                    <input
                      type="text"
                      name="toStation"
                      placeholder="Enter destination station"
                      value={formData.toStation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COMPLAINT DESCRIPTION */}
            <div className="rcc-form-section rcc-description-section">
              <h2>Complaint Description</h2>

              <p className="rcc-section-description">
                Please provide a detailed description of your complaint.
              </p>

              <div className="rcc-description">
                <textarea
                  name="description"
                  placeholder="Describe your issue in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                  minLength={10}
                  required
                />

                <div className="rcc-character-count">
                  {formData.description.length}/1000
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div
                role="alert"
                style={{
                  color: "#b42318",
                  background: "#fef3f2",
                  border: "1px solid #fecdca",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="rcc-submit-btn"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              <Send size={15} />
              {isLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </section>

        {/* RIGHT INFORMATION PANEL */}
        <aside className="rcc-right-panel">
          <div className="rcc-matters">
            <div className="rcc-document-icon">
              <FileText size={50} />
            </div>

            <div>
              <h3>Your Complaint Matters</h3>

              <p>
                We are committed to providing a safer, cleaner and more
                comfortable journey for every passenger.
              </p>
            </div>
          </div>

          <div className="rcc-next">
            <h3>What Happens Next?</h3>

            <div className="rcc-timeline">
              <div className="rcc-timeline-item">
                <div className="rcc-timeline-number">1</div>

                <div className="rcc-timeline-icon">
                  <Cpu size={25} />
                </div>

                <div>
                  <strong>AI Classification</strong>

                  <p>
                    Our system analyses your complaint and predicts the category
                    using ML.
                  </p>
                </div>
              </div>

              <div className="rcc-timeline-item">
                <div className="rcc-timeline-number">2</div>

                <div className="rcc-timeline-icon">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <strong>Department Forwarding</strong>

                  <p>
                    The complaint is sent to the right department for action.
                  </p>
                </div>
              </div>

              <div className="rcc-timeline-item">
                <div className="rcc-timeline-number">3</div>

                <div className="rcc-timeline-icon">
                  <Bell size={25} />
                </div>

                <div>
                  <strong>Track & Get Updates</strong>

                  <p>
                    Use your complaint ID to check the status and receive timely
                    updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HELPLINE */}
          <div className="rcc-helpline">
            <Info size={22} />

            <div>
              <p>
                For urgent issues like safety concerns, please contact our
                helpline immediately.
              </p>

              <a href="tel:139">
                <Phone size={14} />
                Helpline: 139
              </a>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

export default SubmitComplaint;
