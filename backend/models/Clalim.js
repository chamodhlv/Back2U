const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
{
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoundItem",
    required: true
  },

  claimantName: {
    type: String,
    required: true
  },

  claimantEmail: {
    type: String,
    required: true
  },

  claimantPhone: {
    type: String
  },

  message: {
    type: String,
    required: true
  },

  proofImage: {
    type: String
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Claim", claimSchema);