// ============================================================
// controllers/authController.js
// Handles Register, Login logic
// ============================================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: Generate a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload: what we store in the token
    process.env.JWT_SECRET,   // Secret key to sign the token
    { expiresIn: '7d' }       // Token expires in 7 days
  );
};

// Helper: Create a URL-safe username from a name + random suffix
const generateUsername = (name) => {
  const base = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  const suffix = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  return `${base}${suffix}`;
};

// ============================================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ============================================================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Generate a unique username
    let username = generateUsername(name);
    // Make sure username is truly unique
    while (await User.findOne({ username })) {
      username = generateUsername(name);
    }

    // Create the new user (password will be hashed by the pre-save hook)
    const user = await User.create({ name, email, password, username });

    // Return user info and JWT token
    res.status(201).json({
      message: 'Account created successfully!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ============================================================
// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
// ============================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user info and JWT token
    res.json({
      message: 'Login successful!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ============================================================
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private (requires token)
// ============================================================
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
