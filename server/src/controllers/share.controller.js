// src/controllers/share.controller.js
const Snippet = require("../models/Snippet");
const ShareLink = require("../models/ShareLink");
const asyncHandler = require("../utils/async-handler");
const gridfsService = require("../services/gridfs-service");
const constants = require("../config/constants");

/**
 * @desc    Create a share link for a snippet
 * @route   POST /api/share/:snippetId
 * @access  Private
 */
const createShareLink = asyncHandler(async (req, res) => {
  const { maxPlays, expiryDays, accessKey } = req.body;

  // Find the snippet
  const snippet = await Snippet.findById(req.params.snippetId);

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

  // Calculate expiration date
  const now = new Date();
  const expiresAt = new Date(
    now.setDate(
      now.getDate() + (parseInt(expiryDays) || constants.DEFAULT_EXPIRY_DAYS)
    )
  );

  // Create share link
  const shareLink = await ShareLink.create({
    snippet: snippet._id,
    createdBy: req.user._id,
    expiresAt,
    maxPlays: parseInt(maxPlays) || constants.DEFAULT_MAX_PLAYS,
    accessKey: accessKey || undefined,
  });

  res.status(201).json({
    success: true,
    shareLink: {
      id: shareLink._id,
      shareId: shareLink.shareId,
      expiresAt: shareLink.expiresAt,
      maxPlays: shareLink.maxPlays,
      currentPlays: shareLink.currentPlays,
      url: `${req.protocol}://${req.get("host")}/share/${shareLink.shareId}`,
    },
  });
});

/**
 * @desc    Get a shared snippet
 * @route   GET /api/share/:shareId
 * @access  Public
 */
const getSharedSnippet = asyncHandler(async (req, res) => {
  // Find the share link
  const shareLink = await ShareLink.findOne({ shareId: req.params.shareId });

  if (!shareLink) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SHARE.LINK_NOT_FOUND,
    });
  }

  // Check if share link is valid
  if (!shareLink.isValid()) {
    let message = constants.ERRORS.SHARE.LINK_EXPIRED;

    if (shareLink.currentPlays >= shareLink.maxPlays) {
      message = constants.ERRORS.SHARE.MAX_PLAYS_REACHED;
    }

    return res.status(403).json({
      success: false,
      message,
    });
  }

  // Check if access key is required
  if (shareLink.accessKey && req.query.key !== shareLink.accessKey) {
    return res.status(401).json({
      success: false,
      message: "Access key required",
      requiresKey: true,
    });
  }

  // Find the snippet
  const snippet = await Snippet.findById(shareLink.snippet);

  if (!snippet) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SNIPPET.NOT_FOUND,
    });
  }

  // Increment play count
  await shareLink.incrementPlays();

  res.json({
    success: true,
    snippet: {
      id: snippet._id,
      title: snippet.title,
      description: snippet.description,
      duration: snippet.duration,
      createdAt: snippet.createdAt,
      isEncrypted: snippet.isEncrypted,
      encryptionDetails: snippet.isEncrypted
        ? snippet.encryptionDetails
        : undefined,
      transcription: snippet.transcription,
    },
    shareInfo: {
      playsRemaining: shareLink.maxPlays - shareLink.currentPlays,
      expiresAt: shareLink.expiresAt,
    },
  });
});

/**
 * @desc    Stream shared audio file
 * @route   GET /api/share/:shareId/audio
 * @access  Public
 */
const streamSharedAudio = asyncHandler(async (req, res) => {
  // Find the share link
  const shareLink = await ShareLink.findOne({ shareId: req.params.shareId });

  if (!shareLink) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SHARE.LINK_NOT_FOUND,
    });
  }

  // Check if share link is valid
  if (!shareLink.isValid()) {
    let message = constants.ERRORS.SHARE.LINK_EXPIRED;

    if (shareLink.currentPlays >= shareLink.maxPlays) {
      message = constants.ERRORS.SHARE.MAX_PLAYS_REACHED;
    }

    return res.status(403).json({
      success: false,
      message,
    });
  }

  // Check if access key is required
  if (shareLink.accessKey && req.query.key !== shareLink.accessKey) {
    return res.status(401).json({
      success: false,
      message: "Access key required",
    });
  }

  // Find the snippet
  const snippet = await Snippet.findById(shareLink.snippet);

  if (!snippet) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SNIPPET.NOT_FOUND,
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
 * @desc    Get all share links for a user
 * @route   GET /api/share
 * @access  Private
 */
const getShareLinks = asyncHandler(async (req, res) => {
  const shareLinks = await ShareLink.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .populate("snippet", "title duration");

  res.json({
    success: true,
    count: shareLinks.length,
    shareLinks: shareLinks.map((link) => ({
      id: link._id,
      shareId: link.shareId,
      snippet: link.snippet,
      expiresAt: link.expiresAt,
      maxPlays: link.maxPlays,
      currentPlays: link.currentPlays,
      isActive: link.isActive && link.isValid(),
      url: `${req.protocol}://${req.get("host")}/share/${link.shareId}`,
    })),
  });
});

/**
 * @desc    Delete a share link
 * @route   DELETE /api/share/:id
 * @access  Private
 */
const deleteShareLink = asyncHandler(async (req, res) => {
  const shareLink = await ShareLink.findById(req.params.id);

  if (!shareLink) {
    return res.status(404).json({
      success: false,
      message: constants.ERRORS.SHARE.LINK_NOT_FOUND,
    });
  }

  // Check if user owns the share link
  if (shareLink.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this share link",
    });
  }

  await shareLink.remove();

  res.json({
    success: true,
    message: "Share link deleted successfully",
  });
});

module.exports = {
  createShareLink,
  getSharedSnippet,
  streamSharedAudio,
  getShareLinks,
  deleteShareLink,
};
