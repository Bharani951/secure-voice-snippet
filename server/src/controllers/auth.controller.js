// src/controllers/auth.controller.js
const User = require("../models/User");
const asyncHandler = require("../utils/async-handler");
const jwt = require("../utils/jwt");
const constants = require("../config/constants");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // In a real app, we would hash this password
    role: "user",
  });

  if (user) {
    // Generate token
    const token = jwt.generateToken({ id: user._id });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
    });
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = jwt.generateToken({ id: user._id });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: constants.ERRORS.AUTH.INVALID_CREDENTIALS,
    });
  }
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Create guest user
 * @route   POST /api/auth/guest
 * @access  Public
 */
const createGuest = asyncHandler(async (req, res) => {
  // Generate a random guest name
  const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;

  // Create a guest user
  const user = await User.create({
    name: guestName,
    email: `${guestName.toLowerCase()}@guest.secureVoice.app`,
    role: "guest",
  });

  // Generate token
  const token = jwt.generateToken({ id: user._id });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
  createGuest,
};
