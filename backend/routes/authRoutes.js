const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
    '/register',
    [
        body('studentId').notEmpty().withMessage('Student ID is required'),
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    register
);

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
