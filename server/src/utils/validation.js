/**
 * Validation Schemas
 * Uses Joi for validation
 */
const Joi = require("joi");
const mongoose = require("mongoose");

// Custom Joi extension for MongoDB ObjectId validation
const JoiObjectId = Joi.extend({
  type: "objectId",
  base: Joi.string(),
  messages: {
    "objectId.invalid": "{{#label}} must be a valid MongoDB ObjectId",
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId.invalid") };
    }
  },
});

// User validation schemas
const userSchemas = {
  // Register validation
  register: {
    body: Joi.object({
      name: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 50 characters",
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),
      password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters",
        "string.empty": "Password is required",
      }),
    }),
  },

  // Login validation
  login: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required",
      }),
    }),
  },
};

// Snippet validation schemas
const snippetSchemas = {
  // Create snippet validation
  create: {
    body: Joi.object({
      title: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters",
        "string.max": "Title cannot exceed 100 characters",
      }),
      description: Joi.string().trim().max(500).allow("").optional().messages({
        "string.max": "Description cannot exceed 500 characters",
      }),
      duration: Joi.number().min(0).required().messages({
        "number.base": "Duration must be a number",
        "number.min": "Duration cannot be negative",
      }),
      isPrivate: Joi.boolean().default(true),
      transcription: Joi.string().trim().allow("").optional(),
      iv: Joi.string().allow("").optional(),
      authTag: Joi.string().allow("").optional(),
    }),
  },

  // Update snippet validation
  update: {
    params: Joi.object({
      id: JoiObjectId.objectId().required().messages({
        "objectId.invalid": "Invalid snippet ID format",
      }),
    }),
    body: Joi.object({
      title: Joi.string().trim().min(3).max(100).optional().messages({
        "string.min": "Title must be at least 3 characters",
        "string.max": "Title cannot exceed 100 characters",
      }),
      description: Joi.string().trim().max(500).allow("").optional().messages({
        "string.max": "Description cannot exceed 500 characters",
      }),
      transcription: Joi.string().trim().allow("").optional(),
      isPrivate: Joi.boolean().optional(),
    }),
  },

  // Get snippet by ID validation
  getById: {
    params: Joi.object({
      id: JoiObjectId.objectId().required().messages({
        "objectId.invalid": "Invalid snippet ID format",
      }),
    }),
  },
};

// Share link validation schemas
const shareSchemas = {
  // Create share link validation
  create: {
    params: Joi.object({
      snippetId: JoiObjectId.objectId().required().messages({
        "objectId.invalid": "Invalid snippet ID format",
      }),
    }),
    body: Joi.object({
      maxPlays: Joi.number().integer().min(1).max(100).default(5).messages({
        "number.base": "Max plays must be a number",
        "number.integer": "Max plays must be an integer",
        "number.min": "Max plays must be at least 1",
        "number.max": "Max plays cannot exceed 100",
      }),
      expiryDays: Joi.number().integer().min(1).max(30).default(7).messages({
        "number.base": "Expiry days must be a number",
        "number.integer": "Expiry days must be an integer",
        "number.min": "Expiry days must be at least 1",
        "number.max": "Expiry days cannot exceed 30",
      }),
      accessKey: Joi.string()
        .trim()
        .min(4)
        .max(20)
        .allow("")
        .optional()
        .messages({
          "string.min": "Access key must be at least 4 characters",
          "string.max": "Access key cannot exceed 20 characters",
        }),
    }),
  },

  // Get shared snippet validation
  getShared: {
    params: Joi.object({
      shareId: Joi.string().trim().required().messages({
        "string.empty": "Share ID is required",
      }),
    }),
    query: Joi.object({
      key: Joi.string().trim().allow("").optional(),
    }),
  },
};

module.exports = {
  user: userSchemas,
  snippet: snippetSchemas,
  share: shareSchemas,
};
