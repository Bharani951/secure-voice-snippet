// src/server.js (updated)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Import database connection
const connectDB = require("./config/db");

// Import error handler
const errorHandler = require("./middleware/error.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const snippetRoutes = require("./routes/snippet.routes");
const shareRoutes = require("./routes/share.routes");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize GridFS
const gridfsService = require("./services/gridfs-service");
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established");
  gridfsService.initGridFS(mongoose.connection.db);
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // Logging

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/share", shareRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SecureVoice Snippet API" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
