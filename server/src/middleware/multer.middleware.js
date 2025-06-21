// src/middleware/multer.middleware.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const constants = require("../config/constants");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for audio files
const fileFilter = (req, file, cb) => {
  // Accept audio files only
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(
      new Error("File type not supported. Please upload an audio file."),
      false
    );
  }
};

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: constants.MAX_FILE_SIZE, // From our constants file
  },
  fileFilter: fileFilter,
});

module.exports = upload;
