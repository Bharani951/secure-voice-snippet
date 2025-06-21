// src/utils/async-handler.js
/**
 * Wraps an async route handler to catch any errors and pass them to the Express error handler
 * This eliminates the need for try/catch blocks in every route
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
