const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
    createClaim,
    getClaimsForItem,
    getMyClaims,
    getReceivedClaims,
    getClaimById,
    approveClaim,
    rejectClaim,
    confirmReturn
} = require('../controllers/claimController');

const router = express.Router();

// Configure multer for proof image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `claim-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
    }
});

// Confirm return / retrieval — MUST be before /:itemType/:itemId or it gets swallowed
router.post('/:id/confirm-return', protect, confirmReturn);

// Submit a claim (with up to 3 proof images)
router.post('/:itemType/:itemId', protect, upload.array('proofImages', 3), createClaim);

// Get claims submitted by current user — MUST be before /:itemType/:itemId
router.get('/mine', protect, getMyClaims);

// Get claims received by current user (on their own posts)
router.get('/received', protect, getReceivedClaims);

// Get a single claim by ID
router.get('/detail/:id', protect, getClaimById);

// Approve or reject a claim
router.put('/:id/approve', protect, approveClaim);
router.put('/:id/reject', protect, rejectClaim);

// Get all claims for an item (post owner only)
router.get('/:itemType/:itemId', protect, getClaimsForItem);

module.exports = router;
