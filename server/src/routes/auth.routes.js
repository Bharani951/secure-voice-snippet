const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserProfile,
  verifyToken,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.get("/verify", protect, verifyToken);

module.exports = router;
