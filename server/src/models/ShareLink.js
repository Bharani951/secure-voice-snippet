// src/models/ShareLink.js
const mongoose = require("mongoose");
const crypto = require("crypto");

const ShareLinkSchema = new mongoose.Schema(
  {
    snippet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(10).toString("hex"),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => {
        const now = new Date();
        return new Date(now.setDate(now.getDate() + 7)); // Default 7 days
      },
    },
    maxPlays: {
      type: Number,
      default: 5,
    },
    currentPlays: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
    },
    accessKey: {
      type: String,
      description: "Optional password for additional protection",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
ShareLinkSchema.index({ shareId: 1 });
ShareLinkSchema.index({ expiresAt: 1 });

// Method to check if the share link is still valid
ShareLinkSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiresAt < new Date()) return false;
  if (this.currentPlays >= this.maxPlays) return false;
  return true;
};

// Method to increment play count
ShareLinkSchema.methods.incrementPlays = function () {
  this.currentPlays += 1;
  this.lastAccessed = new Date();
  return this.save();
};

module.exports = mongoose.model("ShareLink", ShareLinkSchema);
