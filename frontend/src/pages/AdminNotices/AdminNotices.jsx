import React, { useEffect, useState } from "react";
import { getAllNoticesAdmin, deleteNotice, archiveNotice } from "../services/noticeService";
import { useNavigate, Link } from "react-router-dom";

const AdminNotices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await getAllNoticesAdmin();
      setNotices(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(id);
        alert("Notice deleted successfully");
        fetchNotices();
      } catch (error) {
        alert("Error deleting notice: " + error.message);
      }
    }
  };

  const handleArchive = async (id) => {
    if (window.confirm("Are you sure you want to archive this notice?")) {
      try {
        await archiveNotice(id);
        alert("Notice archived successfully");
        fetchNotices();
      } catch (error) {
        alert("Error archiving notice: " + error.message);
      }
    }
  };

  const filteredNotices = notices.filter((notice) => {
    if (filter === "all") return true;
    return notice.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "#4CAF50";
      case "Scheduled":
        return "#2196F3";
      case "Draft":
        return "#ff9800";
      case "Archived":
        return "#666";
      default:
        return "#666";
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#2196F3" }}>
          ← Back to Home
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Admin - Manage Notices</h2>
        <button
          onClick={() => navigate("/admin/notices/create")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          + Create Notice
        </button>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: filter === "all" ? "#2196F3" : "#f0f0f0",
            color: filter === "all" ? "white" : "black",
            border: "none",
            borderRadius: "4px"
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Published")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: filter === "Published" ? "#4CAF50" : "#f0f0f0",
            color: filter === "Published" ? "white" : "black",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Published
        </button>
        <button
          onClick={() => setFilter("Scheduled")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: filter === "Scheduled" ? "#2196F3" : "#f0f0f0",
            color: filter === "Scheduled" ? "white" : "black",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Scheduled
        </button>
        <button
          onClick={() => setFilter("Draft")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: filter === "Draft" ? "#ff9800" : "#f0f0f0",
            color: filter === "Draft" ? "white" : "black",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Draft
        </button>
        <button
          onClick={() => setFilter("Archived")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: filter === "Archived" ? "#666" : "#f0f0f0",
            color: filter === "Archived" ? "white" : "black",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Archived
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Title</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Category</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Priority</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Publish Date</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Expiry Date</th>
              <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => (
              <tr key={notice._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{notice.title}</td>
                <td style={{ padding: "12px" }}>{notice.category}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ color: notice.priority === "High" ? "#ff4444" : notice.priority === "Medium" ? "#ff9800" : "#4CAF50", fontWeight: "bold" }}>
                    {notice.priority}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: getStatusColor(notice.status),
                      color: "white"
                    }}
                  >
                    {notice.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{new Date(notice.publishDate).toLocaleDateString()}</td>
                <td style={{ padding: "12px" }}>{new Date(notice.expiryDate).toLocaleDateString()}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    onClick={() => navigate(`/admin/notices/edit/${notice._id}`)}
                    style={{
                      padding: "6px 12px",
                      cursor: "pointer",
                      marginRight: "5px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px"
                    }}
                  >
                    Edit
                  </button>
                  {notice.status !== "Archived" && (
                    <button
                      onClick={() => handleArchive(notice._id)}
                      style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        marginRight: "5px",
                        backgroundColor: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "4px"
                      }}
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notice._id)}
                    style={{
                      padding: "6px 12px",
                      cursor: "pointer",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredNotices.length === 0 && (
        <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No notices found
        </p>
      )}
    </div>
  );
};

export default AdminNotices;
