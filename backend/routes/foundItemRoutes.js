const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const FoundItem = require('../models/FoundItem');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads (optional)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST /api/found – Create a found item
router.post('/', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, category, foundLocation, dateFound, color, brand } = req.body;
        
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const newFound = await FoundItem.create({
            title,
            description,
            category: category || 'Other',
            foundLocation,
            dateFound,
            color: color || '',
            brand: brand || '',
            images,
            postedBy: req.user._id,
            status: 'Found'
        });

        res.status(201).json({ success: true, data: newFound });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/found – Get all found items (optional)
router.get('/', protect, async (req, res) => {
    try {
        const items = await FoundItem.find({ isArchived: false }).sort({ createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/found/:id – Get single found item
router.get('/:id', protect, async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id).populate('postedBy', 'fullName email');
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;