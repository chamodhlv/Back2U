const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const claimController = require("../controllers/claimController");

// CREATE Claim (with optional proof image)
router.post("/create/:itemId", upload.single("proofImage"), claimController.createClaim);

// READ Claims by Item
router.get("/item/:itemId", claimController.getClaimsByItem);

// READ Single Claim
router.get("/:id", claimController.getClaimById);

// APPROVE Claim
router.put("/approve/:id", claimController.approveClaim);

// REJECT Claim
router.put("/reject/:id", claimController.rejectClaim);

module.exports = router;
