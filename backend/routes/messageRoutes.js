const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, editMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/:chatId', getMessages);
router.put('/:id/edit', editMessage);
router.delete('/:id', deleteMessage);

module.exports = router;