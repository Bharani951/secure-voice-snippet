// src/routes/share.routes.js
const express = require("express");
const router = express.Router();
const {
  createShareLink,
  getSharedSnippet,
  streamSharedAudio,
  getShareLinks,
  deleteShareLink,
} = require("../controllers/share.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");

router.post("/:snippetId", protect, createShareLink);
router.get("/", protect, getShareLinks);
router.get("/:shareId", getSharedSnippet);
router.get("/:shareId/audio", streamSharedAudio);
router.delete("/:id", protect, deleteShareLink);

module.exports = router;
