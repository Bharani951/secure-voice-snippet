// src/models/User.js
const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function () {
        // Only require password for regular users, not guest users
        return this.role === "user";
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in query results by default
    },
    role: {
      type: String,
      enum: ["user", "guest", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create virtual for full URL to user's avatar (can be implemented later)
UserSchema.virtual("avatarUrl").get(function () {
  // Default avatar or Gravatar implementation
  const hash = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // In a real implementation, we would use bcrypt.compare
  // For now, we'll use a simple equality check
  return this.password === enteredPassword;
};

module.exports = mongoose.model("User", UserSchema);
