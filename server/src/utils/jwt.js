const jwt = require("jsonwebtoken");

// Get JWT secret from environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-for-development-only";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing id
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
