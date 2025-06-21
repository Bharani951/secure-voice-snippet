// src/models/Snippet.js
const mongoose = require("mongoose");

const SnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      description: "Reference to the file in GridFS",
    },
    fileName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      description: "Duration in seconds",
    },
    size: {
      type: Number,
      required: true,
      description: "File size in bytes",
    },
    transcription: {
      type: String,
      trim: true,
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
    encryptionDetails: {
      algorithm: {
        type: String,
        default: "AES-256-GCM",
      },
      iv: {
        type: String,
        description: "Initialization vector, stored as hex string",
      },
      authTag: {
        type: String,
        description: "Authentication tag, stored as hex string",
      },
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
SnippetSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Snippet", SnippetSchema);
