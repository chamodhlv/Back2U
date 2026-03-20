import React, { useEffect, useState } from "react";
import { getAllNotices, getNoticesByCategory } from "../services/noticeService";
import { Link } from "react-router-dom";

const CampusNotices = () => {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      let res;
      if (filter === "all") {
        res = await getAllNotices();
      } else {
        res = await getNoticesByCategory(filter);
      }
      setNotices(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return "border-red-500 bg-red-50";
      case "Medium":
        return "border-orange-400 bg-orange-50";
      case "Low":
        return "border-green-400 bg-green-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Alert":
        return "⚠️";
      case "Lost Item Week":
        return "📦";
      case "Tips":
        return "💡";
      case "Success Story":
        return "🎉";
      default:
        return "📢";
    }
  };

  if (loading) return <p className="p-5">Loading notices...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">📢 Campus Notices</h2>
          <p className="text-gray-600">Stay updated with important announcements and alerts</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
              filter === "all"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            All Notices
          </button>
          <button
            onClick={() => setFilter("Alert")}
            className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
              filter === "Alert"
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            ⚠️ Alerts
          </button>
          <button
            onClick={() => setFilter("Lost Item Week")}
            className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
              filter === "Lost Item Week"
                ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            📦 Lost Item Week
          </button>
          <button
            onClick={() => setFilter("Tips")}
            className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
              filter === "Tips"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            💡 Tips
          </button>
          <button
            onClick={() => setFilter("Success Story")}
            className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
              filter === "Success Story"
                ? "bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            🎉 Success Stories
          </button>
        </div>

        {/* Notices List */}
        <div className="space-y-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className={`border-2 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] ${getPriorityStyles(notice.priority)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{getCategoryIcon(notice.category)}</span>
                    <h3 className="text-2xl font-bold text-gray-800">{notice.title}</h3>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold text-white ${getPriorityBadge(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                      {notice.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="whitespace-pre-wrap mb-4 text-gray-700 leading-relaxed">
                {notice.content}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t border-gray-300">
                <div>
                  <p className="mb-1">
                    <span className="font-semibold">Posted by:</span> {notice.adminName}
                  </p>
                  <p>
                    <span className="font-semibold">Published:</span> {new Date(notice.publishDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-semibold">
                    Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xl text-gray-600 mb-2">No active notices at the moment</p>
            <p className="text-gray-500">Check back later for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusNotices;
