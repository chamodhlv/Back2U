const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { studentId, fullName, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
        if (userExists) {
            return res.status(400).json({
                message:
                    userExists.email === email
                        ? 'Email already registered'
                        : 'Student ID already registered',
            });
        }

        const user = await User.create({
            studentId,
            fullName,
            email,
            passwordHash: password,
        });

        res.status(201).json({
            _id: user._id,
            studentId: user.studentId,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
            points: user.points,
            isActive: user.isActive,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: field === 'email' ? "Email already registered" : "Student ID already registered"
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            studentId: user.studentId,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
            points: user.points,
            isActive: user.isActive,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("getMe error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { register, login, getMe };
