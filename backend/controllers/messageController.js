const Message = require('../models/Message');
const Chat = require('../models/Chat');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { chatId, content, type = 'TEXT' } = req.body;
        const senderId = req.user.id;

        // Check if chat exists
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Check if user is participant
        if (!chat.participants.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages in this chat'
            });
        }

        // Check if chat is locked
        if (chat.status === 'LOCKED') {
            return res.status(403).json({
                success: false,
                message: 'This chat is locked. Cannot send messages. The item has been returned.',
                data: {
                    isLocked: true,
                    lockedAt: chat.lockedAt
                }
            });
        }

        // Create message
        const message = await Message.create({
            chatId,
            senderId,
            content,
            type,
            readBy: [{ userId: senderId, readAt: new Date() }]
        });

        // Update chat's last message
        chat.lastMessage = content;
        chat.lastMessageAt = new Date();
        await chat.save();

        // Populate sender details
        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'fullName profilePhoto');

        res.status(201).json({
            success: true,
            data: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        // Check if chat exists and user is participant
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        if (!chat.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const messages = await Message.find({ chatId })
            .populate('senderId', 'fullName profilePhoto')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages.reverse()
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
};

// Add to messageController.js
const editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    const message = await Message.findById(messageId);
    
    // Allow edit only within 5 minutes
    const timeElapsed = Date.now() - new Date(message.createdAt).getTime();
    const FIVE_MINUTES = 5 * 60 * 1000;
    
    if (timeElapsed > FIVE_MINUTES) {
        return res.status(403).json({
            success: false,
            message: 'Messages can only be edited within 5 minutes'
        });
    }
    
    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();
    
    res.json({ success: true, data: message });
};

const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    const message = await Message.findById(messageId);
    
    if (message.senderId.toString() !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Can only delete your own messages'
        });
    }
    
    message.deleted = true;
    message.content = '[Message deleted]';
    await message.save();
    
    res.json({ success: true, message: 'Message deleted' });
};
// @desc    Get edit history of a message (optional)
// @route   GET /api/messages/:id/history
// @access  Private
const getMessageHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Check if user is participant in the chat
        const chat = await Chat.findById(message.chatId);
        if (!chat.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view message history'
            });
        }

        // If you want to store edit history, you'd need a separate collection
        // For now, just return edit status
        res.status(200).json({
            success: true,
            data: {
                isEdited: message.isEdited,
                editedAt: message.editedAt,
                originalContent: message.isDeleted ? null : message.content,
                isDeleted: message.isDeleted || false,
                deletedAt: message.deletedAt
            }
        });

    } catch (error) {
        console.error('Get message history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching message history',
            error: error.message
        });
    }
};



// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Check if already read
        const alreadyRead = message.readBy.some(r => r.userId.toString() === userId);
        if (!alreadyRead) {
            message.readBy.push({ userId, readAt: new Date() });
            await message.save();
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking message as read',
            error: error.message
        });
    }
};

// Update module.exports
module.exports = {
    sendMessage,
    getMessages,
    markAsRead,
    editMessage,      
    deleteMessage,    
    getMessageHistory 
};