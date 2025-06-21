// src/config/constants.js
module.exports = {
  // File upload limits
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 25000000, // 25MB
  MAX_AUDIO_DURATION: process.env.MAX_AUDIO_DURATION || 300, // 5 minutes in seconds

  // Authentication
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Default link sharing settings
  DEFAULT_MAX_PLAYS: 5,
  DEFAULT_EXPIRY_DAYS: 7,

  // Error messages
  ERRORS: {
    AUTH: {
      INVALID_CREDENTIALS: "Invalid email or password",
      TOKEN_EXPIRED: "Your session has expired. Please log in again",
      TOKEN_INVALID: "Invalid authentication token",
      TOKEN_MISSING: "Authentication token is required",
    },
    SNIPPET: {
      NOT_FOUND: "Snippet not found",
      UNAUTHORIZED: "You are not authorized to access this snippet",
      UPLOAD_FAILED: "Failed to upload audio file",
      INVALID_FILE: "Invalid file type or size",
    },
    SHARE: {
      LINK_EXPIRED: "This link has expired",
      MAX_PLAYS_REACHED: "Maximum number of plays reached",
      LINK_NOT_FOUND: "Share link not found",
    },
  },
};
