// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();

// We'll implement these routes in the next steps
router.post("/register", (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

router.post("/login", (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

router.post("/guest", (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

module.exports = router; // src/routes/auth.routes.js
const {
  register,
  login,
  getMe,
  createGuest,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/guest", createGuest);

module.exports = router;
