import { useState, useEffect } from "react";
import { ClipboardList, Clock, AlertCircle, CheckCircle } from "lucide-react";

import AdminNavbar from "../../components/admin/AdminNavbar";
import Footer from "../../components/Footer";
import api from "../../services/api";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    total_complaints: 0,
    submitted_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");

        const response = await api.get("/admin/dashboard/stats", token);

        setStatistics(response.statistics);
        setRecentComplaints(response.recent_complaints);
      } catch (err) {
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Complaints",
      value: statistics.total_complaints,
      icon: <ClipboardList size={27} />,
      color: "blue",
    },
    {
      title: "Pending Complaints",
      value: statistics.submitted_complaints,
      icon: <Clock size={27} />,
      color: "orange",
    },
    {
      title: "In Progress",
      value: statistics.in_progress_complaints,
      icon: <AlertCircle size={27} />,
      color: "purple",
    },
    {
      title: "Resolved Complaints",
      value: statistics.resolved_complaints,
      icon: <CheckCircle size={27} />,
      color: "green",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      {/* HERO SECTION */}
      <section className="admin-dashboard-hero">
        <div className="admin-hero-content">
          <p className="admin-hero-label">ADMINISTRATION PORTAL</p>

          <h1>
            Manage Railway <span>Complaints</span>
          </h1>

          <p className="admin-hero-description">
            Monitor passenger complaints, track their progress and manage the
            resolution process efficiently.
          </p>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      <main className="admin-dashboard-content">
        {/* STATISTICS */}
        <section className="admin-statistics-section">
          <div className="admin-section-title">
            <h2>Complaint Statistics</h2>
            <p>Overview of all passenger complaints</p>
          </div>

          {loading ? (
            <p className="admin-dashboard-message">
              Loading dashboard statistics...
            </p>
          ) : error ? (
            <p className="admin-dashboard-error">{error}</p>
          ) : (
            <div className="admin-statistics-grid">
              {stats.map((stat, index) => (
                <div className="admin-stat-card" key={index}>
                  <div className={`admin-stat-icon ${stat.color}`}>
                    {stat.icon}
                  </div>

                  <div className="admin-stat-info">
                    <p>{stat.title}</p>
                    <h3>{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECENT COMPLAINTS */}
        <section className="admin-recent-complaints">
          <div className="admin-section-title">
            <h2>Recent Complaints</h2>
            <p>Latest complaints submitted by passengers</p>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <p>Loading recent complaints...</p>
            </div>
          ) : error ? (
            <div className="admin-empty-state">
              <p className="admin-dashboard-error">
                Unable to load recent complaints.
              </p>
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="admin-empty-state">
              <ClipboardList size={45} />
              <h3>No Complaints to Display</h3>
              <p>
                Passenger complaints will appear here once they are submitted.
              </p>
            </div>
          ) : (
            <div className="admin-recent-list">
              {recentComplaints.map((complaint) => (
                <div className="admin-recent-item" key={complaint.id}>
                  <div className="admin-recent-icon">
                    <ClipboardList size={22} />
                  </div>

                  <div className="admin-recent-info">
                    <h3>{complaint.predicted_category}</h3>
                    <p>Passenger: {complaint.passenger_name}</p>
                    <p>Submitted: {formatDate(complaint.created_at)}</p>
                  </div>

                  <span
                    className={`admin-complaint-status ${complaint.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
