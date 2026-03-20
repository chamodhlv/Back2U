const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const foundItemController = require("../controllers/foundItemController");


// CREATE (with image upload)
router.post("/create", upload.single("image"), foundItemController.createFoundItem);


// READ
router.get("/", foundItemController.getAllFoundItems);
router.get("/:id", foundItemController.getFoundItemById);


// UPDATE (with optional image upload)
router.put("/update/:id", upload.single("image"), foundItemController.updateFoundItem);


// DELETE / ARCHIVE
router.delete("/archive/:id", foundItemController.archiveFoundItem);


module.exports = router;