const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages,
    markAsRead,
    editMessage,      // Add this
    deleteMessage,    // Add this
    getMessageHistory // Add this (optional)
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All message routes require authentication
router.use(protect);

// Send a new message
router.route('/')
    .post(sendMessage);

// Get messages for a chat
router.route('/:chatId')
    .get(getMessages);

// Edit a message (time-limited)
router.put('/:id/edit', editMessage);

// Delete a message (soft delete)
router.delete('/:id/delete', deleteMessage);

// Get message history (optional)
router.get('/:id/history', getMessageHistory);

// Mark message as read
router.put('/:id/read', markAsRead);

module.exports = router;