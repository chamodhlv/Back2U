import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNotice, updateNotice, getNotice } from "../services/noticeService";

const CreateNotice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    priority: "Medium",
    publishDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    adminName: ""
  });

  const [loading, setLoading] = useState(false);

  const fetchNotice = async () => {
    try {
      const res = await getNotice(id);
      const notice = res.data;
      setForm({
        title: notice.title,
        content: notice.content,
        category: notice.category,
        priority: notice.priority,
        publishDate: new Date(notice.publishDate).toISOString().split("T")[0],
        expiryDate: new Date(notice.expiryDate).toISOString().split("T")[0],
        adminName: notice.adminName
      });
    } catch (error) {
      alert("Error loading notice: " + error.message);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchNotice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateNotice(id, form);
        alert("Notice updated successfully!");
      } else {
        await createNotice(form);
        alert("Notice created successfully!");
      }
      navigate("/admin/notices");
    } catch (error) {
      alert("Error saving notice: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/admin/notices")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      >
        ← Back to Notices
      </button>

      <h2>{isEdit ? "Edit Notice" : "Create New Notice"}</h2>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Title *
          </label>
          <input
            name="title"
            placeholder="Enter notice title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Category *
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
          >
            <option value="">Select Category</option>
            <option value="Alert">Alert (High theft area, security warnings)</option>
            <option value="Lost Item Week">Lost Item Week</option>
            <option value="Tips">Tips & Best Practices</option>
            <option value="Success Story">Success Story</option>
            <option value="General">General</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Priority *
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
          >
            <option value="High">High (Urgent alerts, important announcements)</option>
            <option value="Medium">Medium (Regular updates)</option>
            <option value="Low">Low (General information)</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Content *
          </label>
          <textarea
            name="content"
            placeholder="Enter notice content"
            value={form.content}
            onChange={handleChange}
            required
            rows="8"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Publish Date *
            </label>
            <input
              type="date"
              name="publishDate"
              value={form.publishDate}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
            />
            <small style={{ color: "#666" }}>Future dates will be scheduled</small>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Expiry Date *
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
              min={form.publishDate}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
            />
            <small style={{ color: "#666" }}>Auto-archives after expiry</small>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Admin Name *
          </label>
          <input
            name="adminName"
            placeholder="Your name"
            value={form.adminName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 30px",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? "Saving..." : isEdit ? "Update Notice" : "Create Notice"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/notices")}
            style={{
              padding: "12px 30px",
              cursor: "pointer",
              backgroundColor: "#f0f0f0",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotice;
