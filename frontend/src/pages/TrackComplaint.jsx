import { useState } from "react";
import {
  Search,
  Ticket,
  FileText,
  Settings,
  CheckCircle,
  Phone,
  Mail,
  HelpCircle,
  Headphones,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import "./TrackComplaint.css";

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  const trackingStages = [
    {
      title: "Submitted",
      description: "Complaint received",
      icon: <FileText size={26} />,
    },
    {
      title: "In Progress",
      description: "Action in progress",
      icon: <Settings size={26} />,
    },
    {
      title: "Resolved",
      description: "Issue resolved",
      icon: <CheckCircle size={28} />,
    },
  ];

  const statusOrder = {
    Submitted: 0,
    "In Progress": 1,
    Resolved: 2,
  };

  const handleTrack = async (e) => {
    e.preventDefault();

    const enteredId = complaintId.trim();

    if (!enteredId) {
      setMessage("Please enter your complaint ID.");
      setMessageType("error");
      setComplaint(null);
      return;
    }

    setLoading(true);
    setComplaint(null);
    setMessage("");
    setMessageType("");

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please log in to track your complaint.");
      }

      const response = await api.get(
        `/complaints/${encodeURIComponent(enteredId)}`,
        token,
      );

      setComplaint(response.complaint);
      setMessage("Complaint details retrieved successfully.");
      setMessageType("success");
    } catch (error) {
      setComplaint(null);
      setMessage(error.message || "Unable to retrieve complaint details.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentStage = complaint ? statusOrder[complaint.status] : -1;

  const statusClass = complaint
    ? complaint.status.toLowerCase().replace(/\s+/g, "-")
    : "";

  return (
    <div className="track-page">
      <Navbar />

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

      <main className="track-main">
        <div className="track-left-content">
          {/* COMPLAINT SEARCH */}

          <section className="track-search-card">
            <div className="track-search-icon">
              <Search size={38} />
            </div>

            <div className="track-search-content">
              <h2>Enter Your Complaint ID</h2>

              <p>
                Enter the complaint ID provided when you submitted your
                complaint.
              </p>

              <form className="track-search-form" onSubmit={handleTrack}>
                <div className="track-input-wrapper">
                  <Ticket size={21} />

                  <input
                    type="text"
                    placeholder="Enter your complaint ID"
                    value={complaintId}
                    onChange={(e) => {
                      setComplaintId(e.target.value);
                      setMessage("");
                      setMessageType("");
                      setComplaint(null);
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="track-button"
                  disabled={loading}
                >
                  <Search size={20} />

                  {loading ? "Searching..." : "Track Complaint"}
                </button>
              </form>

              {message && (
                <p
                  className={`track-message track-${messageType}`}
                  role="status"
                >
                  {message}
                </p>
              )}
            </div>
          </section>

          {/* COMPLAINT DETAILS */}

          {complaint && (
            <section className="track-result-card">
              <div className="track-result-header">
                <h2>Complaint Details</h2>

                <span className={`track-result-status ${statusClass}`}>
                  {complaint.status}
                </span>
              </div>

              <div className="track-result-info">
                <div className="track-result-item">
                  <label>Complaint ID</label>
                  <p>{complaint.id}</p>
                </div>

                <div className="track-result-item">
                  <label>Submission Date</label>
                  <p>{formatDate(complaint.created_at)}</p>
                </div>

                <div className="track-result-item">
                  <label>Predicted Category</label>
                  <p>{complaint.predicted_category}</p>
                </div>

                <div className="track-result-item">
                  <label>Cluster ID</label>
                  <p>{complaint.predicted_cluster}</p>
                </div>
              </div>

              <div className="track-result-complaint">
                <label>Submitted Complaint</label>
                <p>{complaint.complaint_text}</p>
              </div>
            </section>
          )}

          {/* DYNAMIC TRACKING TIMELINE */}

          <section className="track-timeline-card">
            <h2>
              {complaint
                ? "Your Complaint Progress"
                : "Complaint Tracking Journey"}
            </h2>

            <div className="track-timeline">
              {trackingStages.map((stage, index) => {
                const isCompleted = complaint && index < currentStage;

                const isCurrent = complaint && index === currentStage;

                return (
                  <div className="track-stage" key={stage.title}>
                    <div
                      className={`track-stage-icon ${
                        isCompleted ? "track-stage-completed" : ""
                      } ${isCurrent ? "track-stage-current" : ""}`}
                    >
                      {stage.icon}
                    </div>

                    {index < trackingStages.length - 1 && (
                      <div
                        className={`track-stage-line ${
                          complaint && index < currentStage
                            ? "track-line-completed"
                            : ""
                        }`}
                      ></div>
                    )}

                    <h3>{stage.title}</h3>

                    <p>
                      {isCurrent
                        ? "Current status"
                        : isCompleted
                          ? "Completed"
                          : stage.description}
                    </p>
                  </div>
                );
              })}
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

        {/* HELP PANEL */}

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

      <Footer />
    </div>
  );
}

export default TrackComplaint;
