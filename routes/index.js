const express = require("express");
const router = express.Router();
const { userRateLimiter, adminRateLimiter } = require("../utils/rateLimiter");

// Import individual route modules
const userRoutes = require("./user"); // User routes
const adminRoutes = require("./admin"); // Admin routes
const kycRoutes = require("./kyc"); // Kyc routes

// Use the routes
router.use("/users", userRateLimiter, userRoutes);
router.use("/admins", adminRateLimiter, adminRoutes);
router.use("/kyc", kycRoutes);

module.exports = router;
