// src/routes/snippet.routes.js
const express = require("express");
const router = express.Router();
const {
  uploadSnippet,
  getSnippets,
  getSnippet,
  streamAudio,
  deleteSnippet,
} = require("../controllers/snippet.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");

router.post("/", protect, upload.single("audio"), uploadSnippet);
router.get("/", protect, getSnippets);
router.get("/:id", protect, getSnippet);
router.get("/:id/audio", protect, streamAudio);
router.delete("/:id", protect, deleteSnippet);

module.exports = router;
