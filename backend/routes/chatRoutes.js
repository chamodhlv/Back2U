const express = require('express');
const router = express.Router();
const { getMyChats, getChatById } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMyChats);
router.get('/:id', getChatById);

module.exports = router;