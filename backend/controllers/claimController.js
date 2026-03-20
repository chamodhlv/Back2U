const Claim = require("../Models/Clalim");
const FoundItem = require("../Models/FoundItem");

// CREATE Claim
exports.createClaim = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Check if item exists and is claimable
    const item = await FoundItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    if (item.status === "Returned" || item.status === "Archived") {
      return res.status(400).json({ message: "This item is no longer claimable" });
    }

    const claimData = {
      itemId,
      ...req.body
    };

    if (req.file) {
      claimData.proofImage = req.file.filename;
    }

    const newClaim = new Claim(claimData);
    const savedClaim = await newClaim.save();

    res.status(201).json(savedClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Claims for specific item (for finder)
exports.getClaimsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const claims = await Claim.find({ itemId }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Claim
exports.getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("itemId");
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE Claim
exports.approveClaim = async (req, res) => {
  try {
    const { id } = req.params;
    
    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Update claim status
    claim.status = "Approved";
    await claim.save();

    // Update item status to Returned
    await FoundItem.findByIdAndUpdate(claim.itemId, { status: "Returned" });

    // Reject all other pending claims for this item
    await Claim.updateMany(
      { itemId: claim.itemId, _id: { $ne: id }, status: "Pending" },
      { status: "Rejected" }
    );

    res.json({ message: "Claim approved and item marked as returned", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REJECT Claim
exports.rejectClaim = async (req, res) => {
  try {
    const { id } = req.params;
    
    const claim = await Claim.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.json({ message: "Claim rejected", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
