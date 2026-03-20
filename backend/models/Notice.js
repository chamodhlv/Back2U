const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["Alert", "Lost Item Week", "Tips", "Success Story", "General"],
      required: true
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },

    publishDate: {
      type: Date,
      default: Date.now
    },

    expiryDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Published", "Archived"],
      default: "Draft"
    },

    isVisible: {
      type: Boolean,
      default: true
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register"
    },

    adminName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-archive expired notices
noticeSchema.index({ expiryDate: 1, status: 1 });

module.exports = mongoose.model("Notice", noticeSchema);
