/**
 * Authentication Service
 * Contains business logic for authentication
 */
const User = require("../models/User");
const jwtUtils = require("../utils/jwt");
const crypto = require("crypto");

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Object} User object and JWT token
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 400;
    throw error;
  }

  // In a production app, we would hash the password here
  // const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    name,
    email,
    password, // In production: hashedPassword
    role: "user",
  });

  // Generate JWT token
  const token = jwtUtils.generateToken({ id: user._id });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Log in a user
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Object} User object and JWT token
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Check if password is correct
  // In production: const isMatch = await bcrypt.compare(password, user.password);
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Update last login timestamp
  user.lastLogin = Date.now();
  await user.save();

  // Generate JWT token
  const token = jwtUtils.generateToken({ id: user._id });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Create a guest user account
 * @returns {Object} Guest user object and JWT token
 */
const createGuestUser = async () => {
  // Generate random guest name
  const randomId = crypto.randomBytes(4).toString("hex");
  const guestName = `Guest_${randomId}`;

  // Create guest user
  const user = await User.create({
    name: guestName,
    email: `${guestName.toLowerCase()}@guest.securevoice.app`,
    role: "guest",
  });

  // Generate JWT token
  const token = jwtUtils.generateToken({ id: user._id });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  };
};

/**
 * Get user profile by ID
 * @param {String} userId - User ID
 * @returns {Object} User profile data
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    avatarUrl: user.avatarUrl,
  };
};

module.exports = {
  registerUser,
  loginUser,
  createGuestUser,
  getUserProfile,
};
