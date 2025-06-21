// src/middleware/error.middleware.js
const constants = require("../config/constants");

/**
 * Custom error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err);

  // Default error status and message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Something went wrong";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;

    // Format validation errors
    const errors = Object.values(err.errors).map((error) => error.message);
    message = errors.join(", ");
  }

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Handle Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = `File too large. Maximum size is ${
      constants.MAX_FILE_SIZE / (1024 * 1024)
    } MB`;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = constants.ERRORS.AUTH.TOKEN_INVALID;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = constants.ERRORS.AUTH.TOKEN_EXPIRED;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
