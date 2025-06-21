// src/services/gridfs-service.js
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

let bucket;

/**
 * Initialize GridFS bucket
 * @param {Object} db - MongoDB database connection
 * @returns {Object} GridFSBucket instance
 */
const initGridFS = (db) => {
  if (!bucket) {
    bucket = new GridFSBucket(db, {
      bucketName: "audioUploads",
    });
  }
  return bucket;
};

/**
 * Generate a unique filename
 * @param {String} userId - User ID
 * @param {String} originalFilename - Original file name
 * @returns {String} Unique filename
 */
const generateUniqueFilename = (userId, originalFilename) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = originalFilename.split(".").pop();
  return `${userId}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Upload a file buffer to GridFS
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} filename - Filename
 * @param {Object} metadata - File metadata
 * @returns {Promise<Object>} Uploaded file info
 */
const uploadFile = (fileBuffer, filename, metadata) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      return reject(new Error("GridFS not initialized"));
    }

    const uploadStream = bucket.openUploadStream(filename, {
      metadata,
    });

    uploadStream.on("error", (error) => {
      reject(error);
    });

    uploadStream.on("finish", (file) => {
      resolve(file);
    });

    uploadStream.write(fileBuffer);
    uploadStream.end();
  });
};

/**
 * Upload a file from the filesystem to GridFS
 * @param {String} filePath - Path to the file
 * @param {String} filename - Filename to use in GridFS
 * @param {Object} metadata - File metadata
 * @returns {Promise<Object>} Uploaded file info
 */
const uploadFileFromPath = (filePath, filename, metadata) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      return reject(new Error("GridFS not initialized"));
    }

    const uploadStream = bucket.openUploadStream(filename, {
      metadata,
    });

    const readStream = fs.createReadStream(filePath);

    uploadStream.on("error", (error) => {
      reject(error);
    });

    uploadStream.on("finish", (file) => {
      // Optionally delete the temporary file after upload
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temporary file:", err);
      });
      resolve(file);
    });

    readStream.on("error", (error) => {
      reject(error);
    });

    readStream.pipe(uploadStream);
  });
};

/**
 * Get a file stream from GridFS
 * @param {String} fileId - File ID
 * @returns {Stream} File download stream
 */
const getFileStream = (fileId) => {
  if (!bucket) {
    throw new Error("GridFS not initialized");
  }

  return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};

/**
 * Get file info from GridFS
 * @param {String} fileId - File ID
 * @returns {Promise<Object>} File information
 */
const getFileInfo = (fileId) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      return reject(new Error("GridFS not initialized"));
    }

    bucket
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray((err, files) => {
        if (err) {
          return reject(err);
        }

        if (!files || files.length === 0) {
          return reject(new Error("File not found"));
        }

        resolve(files[0]);
      });
  });
};

/**
 * Delete a file from GridFS
 * @param {String} fileId - File ID
 * @returns {Promise} Promise resolving when file is deleted
 */
const deleteFile = (fileId) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      return reject(new Error("GridFS not initialized"));
    }

    bucket.delete(new mongoose.Types.ObjectId(fileId), (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

/**
 * List files for a specific user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Array of file info objects
 */
const listUserFiles = (userId) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      return reject(new Error("GridFS not initialized"));
    }

    bucket.find({ "metadata.userId": userId }).toArray((err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
};

module.exports = {
  initGridFS,
  generateUniqueFilename,
  uploadFile,
  uploadFileFromPath,
  getFileStream,
  getFileInfo,
  deleteFile,
  listUserFiles,
};
