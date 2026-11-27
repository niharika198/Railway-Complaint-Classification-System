import { useState, useEffect } from "react";
import { Search, Filter, ClipboardList, Eye, X } from "lucide-react";

import AdminNavbar from "../../components/admin/AdminNavbar";
import Footer from "../../components/Footer";
import api from "../../services/api";

import "./ManageComplaints.css";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");

        const response = await api.get("/admin/complaints", token);

        setComplaints(response.complaints || []);
      } catch (err) {
        setError(err.message || "Unable to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Get unique complaint categories
  const categories = [
    ...new Set(complaints.map((complaint) => complaint.predicted_category)),
  ].filter(Boolean);

  // Search and filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.id.toLowerCase().includes(searchText) ||
      complaint.passenger_name.toLowerCase().includes(searchText) ||
      complaint.passenger_email.toLowerCase().includes(searchText);

    const matchesStatus =
      selectedStatus === "all" || complaint.status === selectedStatus;

    const matchesCategory =
      selectedCategory === "all" ||
      complaint.predicted_category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Format date
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

  // Fetch selected complaint details
  const handleViewComplaint = async (complaintId) => {
    setSelectedComplaint(null);
    setDetailsError("");
    setStatusMessage("");
    setNewStatus("");
    setDetailsLoading(true);

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      const response = await api.get(`/admin/complaints/${complaintId}`, token);

      setSelectedComplaint(response.complaint);
      setNewStatus(response.complaint.status);
    } catch (err) {
      setDetailsError(err.message || "Unable to load complaint details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update complaint status
  const handleStatusUpdate = async () => {
    if (!selectedComplaint || newStatus === selectedComplaint.status) {
      return;
    }

    setUpdatingStatus(true);
    setStatusMessage("");

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      await api.patch(
        `/admin/complaints/${selectedComplaint.id}/status`,
        { status: newStatus },
        token,
      );

      // Update selected complaint in modal
      setSelectedComplaint((previous) => ({
        ...previous,
        status: newStatus,
      }));

      // Update complaint in table
      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.id === selectedComplaint.id
            ? { ...complaint, status: newStatus }
            : complaint,
        ),
      );

      setStatusMessage("Complaint status updated successfully!");
    } catch (err) {
      setStatusMessage(err.message || "Unable to update complaint status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Close complaint details modal
  const closeComplaintModal = () => {
    if (updatingStatus) return;

    setSelectedComplaint(null);
    setDetailsError("");
    setStatusMessage("");
    setNewStatus("");
  };

  return (
    <div className="manage-complaints-page">
      <AdminNavbar />

      {/* HERO SECTION */}
      <section className="manage-complaints-hero">
        <div className="manage-hero-content">
          <p className="manage-hero-label">ADMINISTRATION PORTAL</p>

          <h1>
            Manage <span>Complaints</span>
          </h1>

          <p className="manage-hero-description">
            View passenger complaints, monitor their status and manage the
            resolution process.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="manage-complaints-content">
        <section className="manage-complaints-section">
          <div className="manage-section-header">
            <div>
              <h2>All Complaints</h2>
              <p>View and manage complaints submitted by passengers</p>
            </div>

            <div className="manage-complaints-count">
              <ClipboardList size={18} />
              <span>{filteredComplaints.length} Complaints</span>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="manage-complaints-toolbar">
            <div className="manage-search-box">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search by complaint ID or passenger..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="manage-filter-box">
              <Filter size={18} />

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="manage-filter-box">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* COMPLAINTS TABLE */}
          <div className="manage-table-wrapper">
            <table className="manage-complaints-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Passenger</th>
                  <th>Category</th>
                  <th>Complaint Details</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="manage-empty-cell">
                      Loading complaints...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="manage-empty-cell">
                      {error}
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="manage-empty-cell">
                      <ClipboardList size={42} />

                      <h3>No Complaints Found</h3>

                      <p>No complaints match your current search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td title={complaint.id}>{complaint.id.slice(-8)}</td>

                      <td>
                        <div>{complaint.passenger_name}</div>
                        <small>{complaint.passenger_email}</small>
                      </td>

                      <td>{complaint.predicted_category}</td>

                      <td>
                        {complaint.complaint_text.length > 55
                          ? `${complaint.complaint_text.slice(0, 55)}...`
                          : complaint.complaint_text}
                      </td>

                      <td>{formatDate(complaint.created_at)}</td>

                      <td>
                        <span
                          className={`admin-complaint-status ${complaint.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          title="View complaint details"
                          aria-label="View complaint details"
                          onClick={() => handleViewComplaint(complaint.id)}
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* COMPLAINT DETAILS MODAL */}
      {(detailsLoading || detailsError || selectedComplaint) && (
        <div className="complaint-modal-overlay" onClick={closeComplaintModal}>
          <div
            className="complaint-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="complaint-modal-header">
              <h2>Complaint Details</h2>

              <button
                type="button"
                className="complaint-modal-close"
                onClick={closeComplaintModal}
                aria-label="Close complaint details"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="complaint-modal-loading">
                Loading complaint details...
              </div>
            ) : detailsError ? (
              <div className="complaint-modal-error">{detailsError}</div>
            ) : selectedComplaint ? (
              <>
                <div className="complaint-detail-grid">
                  <div className="complaint-detail-group">
                    <label>Complaint ID</label>
                    <p>{selectedComplaint.id}</p>
                  </div>

                  <div className="complaint-detail-group">
                    <label>Passenger Name</label>
                    <p>{selectedComplaint.passenger_name}</p>
                  </div>

                  <div className="complaint-detail-group">
                    <label>Passenger Email</label>
                    <p>{selectedComplaint.passenger_email}</p>
                  </div>

                  <div className="complaint-detail-group">
                    <label>Submission Date</label>
                    <p>{formatDate(selectedComplaint.created_at)}</p>
                  </div>

                  <div className="complaint-detail-group">
                    <label>Predicted Category</label>
                    <p>{selectedComplaint.predicted_category}</p>
                  </div>

                  <div className="complaint-detail-group">
                    <label>Cluster ID</label>
                    <p>{selectedComplaint.predicted_cluster}</p>
                  </div>

                  <div className="complaint-detail-group">
                    <label>Current Status</label>
                    <p>{selectedComplaint.status}</p>
                  </div>
                </div>

                {/* STATUS UPDATE */}
                <div className="complaint-detail-group">
                  <label>Update Status</label>

                  <select
                    value={newStatus}
                    onChange={(e) => {
                      setNewStatus(e.target.value);
                      setStatusMessage("");
                    }}
                    disabled={updatingStatus}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={
                      updatingStatus || newStatus === selectedComplaint.status
                    }
                  >
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>

                  {statusMessage && (
                    <p
                      className={
                        statusMessage.includes("successfully")
                          ? "complaint-status-success"
                          : "complaint-status-error"
                      }
                    >
                      {statusMessage}
                    </p>
                  )}
                </div>

                <div className="complaint-detail-group">
                  <label>Original Complaint</label>
                  <p>{selectedComplaint.complaint_text}</p>
                </div>

                <div className="complaint-detail-group">
                  <label>Cleaned Complaint</label>
                  <p>{selectedComplaint.cleaned_text}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ManageComplaints;
