// src/controllers/snippet.controller.js
const Snippet = require("../models/Snippet");
const asyncHandler = require("../utils/async-handler");
const gridfsService = require("../services/gridfs-service");
const constants = require("../config/constants");
const fs = require("fs");

/**
 * @desc    Upload a new audio snippet
 * @route   POST /api/snippets
 * @access  Private
 */
const uploadSnippet = asyncHandler(async (req, res) => {
  const { title, description, duration, isPrivate, transcription } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an audio file",
    });
  }

  // Get file path and details
  const filePath = file.path;
  const originalName = file.originalname;
  const fileSize = file.size;

  // Generate a unique filename
  const uniqueFilename = gridfsService.generateUniqueFilename(
    req.user._id,
    originalName
  );

  // Prepare metadata
  const metadata = {
    userId: req.user._id.toString(),
    contentType: file.mimetype,
    originalName,
  };

  try {
    // Upload file to GridFS
    const uploadedFile = await gridfsService.uploadFileFromPath(
      filePath,
      uniqueFilename,
      metadata
    );

    // Create snippet record
    const snippet = await Snippet.create({
      title,
      description,
      user: req.user._id,
      fileId: uploadedFile._id,
      fileName: uniqueFilename,
      duration: parseFloat(duration) || 0,
      size: fileSize,
      transcription: transcription || "",
      isPrivate: isPrivate === "false" ? false : true,
      isEncrypted: true, // Assume client-side encryption was used
      encryptionDetails: {
        algorithm: "AES-256-GCM",
        iv: req.body.iv || "",
        authTag: req.body.authTag || "",
      },
    });

    res.status(201).json({
      success: true,
      snippet: {
        id: snippet._id,
        title: snippet.title,
        description: snippet.description,
        duration: snippet.duration,
        createdAt: snippet.createdAt,
      },
    });
  } catch (error) {
    // Clean up the temporary file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: constants.ERRORS.SNIPPET.UPLOAD_FAILED,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * @desc    Get all snippets for the current user
 * @route   GET /api/snippets
 * @access  Private
 */
const getSnippets = asyncHandler(async (req, res) => {
  const snippets = await Snippet.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("title description duration createdAt isPrivate");

  res.json({
    success: true,
    count: snippets.length,
    snippets,
  });
});

/**
 * @desc    Get a single snippet
 * @route   GET /api/snippets/:id
 * @access  Private
 */
const getSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SNIPPET.NOT_FOUND,
    });
  }

  // Check if user owns the snippet
  if (snippet.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: constants.ERRORS.SNIPPET.UNAUTHORIZED,
    });
  }

  res.json({
    success: true,
    snippet,
  });
});

/**
 * @desc    Stream audio file
 * @route   GET /api/snippets/:id/audio
 * @access  Private
 */
const streamAudio = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SNIPPET.NOT_FOUND,
    });
  }

  // Check if user owns the snippet
  if (snippet.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: constants.ERRORS.SNIPPET.UNAUTHORIZED,
    });
  }

  try {
    // Get file stream from GridFS
    const fileStream = gridfsService.getFileStream(snippet.fileId);

    // Set appropriate headers
    res.set("Content-Type", "audio/mpeg");
    res.set("Accept-Ranges", "bytes");

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } catch (error) {
    console.error("Stream error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to stream audio file",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * @desc    Delete a snippet
 * @route   DELETE /api/snippets/:id
 * @access  Private
 */
const deleteSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SNIPPET.NOT_FOUND,
    });
  }

  // Check if user owns the snippet
  if (snippet.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: constants.ERRORS.SNIPPET.UNAUTHORIZED,
    });
  }

  try {
    // Delete file from GridFS
    await gridfsService.deleteFile(snippet.fileId);

    // Delete snippet from database
    await snippet.remove();

    res.json({
      success: true,
      message: "Snippet deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete snippet",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = {
  uploadSnippet,
  getSnippets,
  getSnippet,
  streamAudio,
  deleteSnippet,
};
