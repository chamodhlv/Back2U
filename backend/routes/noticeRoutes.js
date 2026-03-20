const express = require("express");
const router = express.Router();

const noticeController = require("../controllers/noticeController");

// CREATE
router.post("/create", noticeController.createNotice);

// READ
router.get("/", noticeController.getAllNotices); // Public
router.get("/admin", noticeController.getAllNoticesAdmin); // Admin
router.get("/priority", noticeController.getPriorityNotices);
router.get("/category/:category", noticeController.getNoticesByCategory);
router.get("/:id", noticeController.getNoticeById);

// UPDATE
router.put("/update/:id", noticeController.updateNotice);

// DELETE
router.delete("/delete/:id", noticeController.deleteNotice);

// ARCHIVE
router.put("/archive/:id", noticeController.archiveNotice);

module.exports = router;
