// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/async-handler");
const constants = require("../config/constants");

/**
 * Middleware to protect routes that require authentication
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: constants.ERRORS.AUTH.TOKEN_MISSING,
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: constants.ERRORS.AUTH.TOKEN_EXPIRED,
      });
    }

    return res.status(401).json({
      success: false,
      message: constants.ERRORS.AUTH.TOKEN_INVALID,
    });
  }
});

/**
 * Middleware to allow guest access (optional authentication)
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findById(decoded.id);

      if (user) {
        // Add user to request object
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }

  next();
});

/**
 * Middleware to restrict routes to specific roles
 * @param {Array} roles - Array of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: constants.ERRORS.AUTH.TOKEN_MISSING,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
};
