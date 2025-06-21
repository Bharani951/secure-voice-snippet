/**
 * Snippet Service
 * Contains business logic for snippet operations
 */
const Snippet = require("../models/Snippet");
const ShareLink = require("../models/ShareLink");
const gridfsService = require("./gridfs-service");
const fs = require("fs");
const path = require("path");

/**
 * Create a new snippet
 * @param {Object} snippetData - Snippet data
 * @param {Object} file - Uploaded file object from multer
 * @param {Object} user - Current user
 * @returns {Object} Created snippet
 */
const createSnippet = async (snippetData, file, user) => {
  const {
    title,
    description,
    duration,
    isPrivate,
    transcription,
    iv,
    authTag,
  } = snippetData;

  if (!file) {
    const error = new Error("Please upload an audio file");
    error.statusCode = 400;
    throw error;
  }

  try {
    // Generate unique filename
    const uniqueFilename = gridfsService.generateUniqueFilename(
      user._id,
      file.originalname
    );

    // Prepare metadata
    const metadata = {
      userId: user._id.toString(),
      contentType: file.mimetype,
      originalName: file.originalname,
    };

    // Upload file to GridFS
    const uploadedFile = await gridfsService.uploadFileFromPath(
      file.path,
      uniqueFilename,
      metadata
    );

    // Create snippet record
    const snippet = await Snippet.create({
      title,
      description,
      user: user._id,
      fileId: uploadedFile._id,
      fileName: uniqueFilename,
      duration: parseFloat(duration) || 0,
      size: file.size,
      transcription: transcription || "",
      isPrivate: isPrivate === "false" ? false : true,
      isEncrypted: true, // Assume client-side encryption was used
      encryptionDetails: {
        algorithm: "AES-256-GCM",
        iv: iv || "",
        authTag: authTag || "",
      },
    });

    return snippet;
  } catch (error) {
    // Clean up the temporary file if it exists
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    throw error;
  }
};

/**
 * Get all snippets for a user
 * @param {String} userId - User ID
 * @returns {Array} Array of snippets
 */
const getUserSnippets = async (userId) => {
  return await Snippet.find({ user: userId })
    .sort({ createdAt: -1 })
    .select("title description duration createdAt isPrivate");
};

/**
 * Get a snippet by ID
 * @param {String} snippetId - Snippet ID
 * @param {String} userId - User ID (for authorization)
 * @returns {Object} Snippet object
 */
const getSnippetById = async (snippetId, userId) => {
  const snippet = await Snippet.findById(snippetId);

  if (!snippet) {
    const error = new Error("Snippet not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if user is authorized to access this snippet
  if (snippet.user.toString() !== userId.toString()) {
    const error = new Error("Unauthorized access to snippet");
    error.statusCode = 403;
    throw error;
  }

  return snippet;
};

/**
 * Delete a snippet
 * @param {String} snippetId - Snippet ID
 * @param {String} userId - User ID (for authorization)
 * @returns {Boolean} Success indicator
 */
const deleteSnippet = async (snippetId, userId) => {
  const snippet = await Snippet.findById(snippetId);

  if (!snippet) {
    const error = new Error("Snippet not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if user is authorized to delete this snippet
  if (snippet.user.toString() !== userId.toString()) {
    const error = new Error("Unauthorized access to snippet");
    error.statusCode = 403;
    throw error;
  }

  try {
    // Delete associated share links
    await ShareLink.deleteMany({ snippet: snippetId });

    // Delete file from GridFS
    await gridfsService.deleteFile(snippet.fileId);

    // Delete snippet record
    await snippet.remove();

    return true;
  } catch (error) {
    console.error("Error deleting snippet:", error);
    throw error;
  }
};

/**
 * Update a snippet
 * @param {String} snippetId - Snippet ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - User ID (for authorization)
 * @returns {Object} Updated snippet
 */
const updateSnippet = async (snippetId, updateData, userId) => {
  const snippet = await Snippet.findById(snippetId);

  if (!snippet) {
    const error = new Error("Snippet not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if user is authorized to update this snippet
  if (snippet.user.toString() !== userId.toString()) {
    const error = new Error("Unauthorized access to snippet");
    error.statusCode = 403;
    throw error;
  }

  // Only allow updating certain fields
  const allowedUpdates = ["title", "description", "transcription", "isPrivate"];
  const updates = {};

  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = updateData[key];
    }
  });

  // Update snippet
  Object.assign(snippet, updates);
  await snippet.save();

  return snippet;
};

module.exports = {
  createSnippet,
  getUserSnippets,
  getSnippetById,
  deleteSnippet,
  updateSnippet,
};
