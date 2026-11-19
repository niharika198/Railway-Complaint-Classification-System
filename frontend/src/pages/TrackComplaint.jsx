import { useState } from "react";
import {
  Search,
  Ticket,
  FileText,
  ShieldCheck,
  User,
  Settings,
  CheckCircle,
  Phone,
  Mail,
  HelpCircle,
  Headphones,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./TrackComplaint.css";

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [message, setMessage] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();

    if (!complaintId.trim()) {
      setMessage("Please enter your complaint ID.");
      return;
    }

    // Connect your backend tracking API here.
    // Example: GET /api/complaints/:complaintId

    setMessage(
      "Complaint tracking API is not connected yet. Please connect your backend to retrieve the actual complaint status.",
    );
  };

  const trackingStages = [
    {
      title: "Submitted",
      date: "Complaint received",
      icon: <FileText size={26} />,
    },
    {
      title: "In Review",
      date: "Under verification",
      icon: <ShieldCheck size={26} />,
    },
    {
      title: "Assigned",
      date: "Department assigned",
      icon: <User size={26} />,
    },
    {
      title: "In Progress",
      date: "Action in progress",
      icon: <Settings size={26} />,
    },
    {
      title: "Resolved",
      date: "Issue resolved",
      icon: <CheckCircle size={28} />,
    },
  ];

  return (
    <div className="track-page">
      {/* EXISTING NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="track-hero">
        <div className="track-hero-content">
          <span className="track-eyebrow">STAY INFORMED, STAY ASSURED</span>

          <h1>
            Track Your <span>Complaint</span>
          </h1>

          <p>
            Enter your complaint ID to check the current status
            <br className="track-desktop-break" />
            and get the latest updates about your issue.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="track-main">
        {/* LEFT CONTENT */}
        <div className="track-left-content">
          {/* SEARCH COMPLAINT */}
          <section className="track-search-card">
            <div className="track-search-icon">
              <Search size={38} />
            </div>

            <div className="track-search-content">
              <h2>Enter Your Complaint ID</h2>

              <p>
                You can find your complaint ID in the confirmation message or
                email you received.
              </p>

              <form className="track-search-form" onSubmit={handleTrack}>
                <div className="track-input-wrapper">
                  <Ticket size={21} />

                  <input
                    type="text"
                    placeholder="e.g. RA-2025-001"
                    value={complaintId}
                    onChange={(e) => {
                      setComplaintId(e.target.value);
                      setMessage("");
                    }}
                    required
                  />
                </div>

                <button type="submit" className="track-button">
                  <Search size={20} />
                  Track Complaint
                </button>
              </form>

              {message && (
                <p className="track-message" role="status">
                  {message}
                </p>
              )}
            </div>
          </section>

          {/* TRACKING TIMELINE */}
          <section className="track-timeline-card">
            <h2>Example: Complaint Tracking Journey</h2>

            <div className="track-timeline">
              {trackingStages.map((stage, index) => (
                <div className="track-stage" key={stage.title}>
                  <div
                    className={`track-stage-icon ${
                      index === 4 ? "track-resolved" : ""
                    }`}
                  >
                    {stage.icon}
                  </div>

                  <div className="track-stage-line"></div>

                  <h3>{stage.title}</h3>

                  <p>{stage.date}</p>
                </div>
              ))}
            </div>
          </section>

          {/* URGENT SUPPORT */}
          <section className="track-urgent-card">
            <div className="track-headset-icon">
              <Headphones size={34} />
            </div>

            <div className="track-urgent-text">
              <h3>Facing urgent issues?</h3>

              <p>
                For safety concerns, please contact our support team
                immediately.
              </p>
            </div>

            <a href="tel:139" className="track-helpline-button">
              <Phone size={16} />
              Helpline: 139
            </a>
          </section>
        </div>

        {/* RIGHT HELP PANEL */}
        <aside className="track-help-panel">
          <div className="track-help-heading">
            <div className="track-help-main-icon">
              <FileText size={34} />
            </div>

            <div>
              <h2>Need Help?</h2>

              <p>
                If you're facing any issues, here are some ways to get support.
              </p>
            </div>
          </div>

          {/* CONTACT SUPPORT */}
          <div className="track-help-item">
            <div className="track-help-icon">
              <Phone size={27} />
            </div>

            <div className="track-help-details">
              <h3>Contact Support</h3>

              <p>Our team is here to help you.</p>

              <a href="tel:139" className="track-outline-button">
                <Phone size={14} />
                Helpline: 139
              </a>
            </div>
          </div>

          {/* EMAIL SUPPORT */}
          <div className="track-help-item">
            <div className="track-help-icon">
              <Mail size={27} />
            </div>

            <div className="track-help-details">
              <h3>Email Us</h3>

              <p>Send us your query at</p>

              <a
                href="mailto:support@railwaycomplaints.in"
                className="track-email-link"
              >
                support@railwaycomplaints.in
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div className="track-help-item track-faq-item">
            <div className="track-help-icon">
              <HelpCircle size={28} />
            </div>

            <div className="track-help-details">
              <h3>FAQs</h3>

              <p>
                Find answers to common questions about the complaint process.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* EXISTING FOOTER */}
      <Footer />
    </div>
  );
}

export default TrackComplaint;