const express = require('express');
const { body } = require('express-validator');
const {
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Student profile routes
router
    .route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile)
    .delete(protect, deleteProfile);

// Admin routes
router
    .route('/')
    .get(protect, adminOnly, getAllUsers)
    .post(
        protect,
        adminOnly,
        [
            body('studentId').notEmpty().withMessage('Student ID is required'),
            body('fullName').notEmpty().withMessage('Full name is required'),
            body('email').isEmail().withMessage('Please enter a valid email'),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
        ],
        createUser
    );

router
    .route('/:id')
    .get(protect, adminOnly, getUserById)
    .put(protect, adminOnly, updateUser)
    .delete(protect, adminOnly, deleteUser);

module.exports = router;
