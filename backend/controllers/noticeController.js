const Notice = require("../Models/Notice");

// CREATE Notice
exports.createNotice = async (req, res) => {
  try {
    const noticeData = req.body;
    
    // Auto-set status based on publish date
    const now = new Date();
    const publishDate = new Date(noticeData.publishDate);
    
    if (publishDate > now) {
      noticeData.status = "Scheduled";
    } else {
      noticeData.status = "Published";
    }

    const newNotice = new Notice(noticeData);
    const savedNotice = await newNotice.save();

    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ All Notices (Public - only active)
exports.getAllNotices = async (req, res) => {
  try {
    const now = new Date();
    
    // Auto-archive expired notices
    await Notice.updateMany(
      { expiryDate: { $lt: now }, status: "Published" },
      { status: "Archived", isVisible: false }
    );

    // Auto-publish scheduled notices
    await Notice.updateMany(
      { publishDate: { $lte: now }, status: "Scheduled" },
      { status: "Published" }
    );

    const notices = await Notice.find({
      status: "Published",
      isVisible: true,
      expiryDate: { $gte: now }
    }).sort({ priority: -1, createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ All Notices (Admin - all statuses)
exports.getAllNoticesAdmin = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ Single Notice
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Notice
exports.updateNotice = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Update status based on publish date if changed
    if (updateData.publishDate) {
      const now = new Date();
      const publishDate = new Date(updateData.publishDate);
      
      if (publishDate > now && updateData.status !== "Draft") {
        updateData.status = "Scheduled";
      } else if (publishDate <= now && updateData.status === "Scheduled") {
        updateData.status = "Published";
      }
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Notice
exports.deleteNotice = async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
    
    if (!deletedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ARCHIVE Notice
exports.archiveNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { status: "Archived", isVisible: false },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice archived successfully", notice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Notices by Category
exports.getNoticesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const now = new Date();

    const notices = await Notice.find({
      category,
      status: "Published",
      isVisible: true,
      expiryDate: { $gte: now }
    }).sort({ priority: -1, createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Priority Notices
exports.getPriorityNotices = async (req, res) => {
  try {
    const now = new Date();

    const notices = await Notice.find({
      priority: "High",
      status: "Published",
      isVisible: true,
      expiryDate: { $gte: now }
    }).sort({ createdAt: -1 }).limit(5);

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
