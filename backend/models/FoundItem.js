const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  locationFound: {
    type: String,
    required: true
  },

  foundDate: {
    type: Date,
    required: true
  },

  image: {
    type: String
  },

  finderName: {
    type: String,
    required: true
  },

  finderEmail: {
    type: String,
    required: true
  },

  finderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register"
  },

  status: {
    type: String,
    enum: ["Found", "Claimable", "Returned", "Archived"],
    default: "Claimable"
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("FoundItem", foundItemSchema);