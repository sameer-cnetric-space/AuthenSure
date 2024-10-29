const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./user"); // User routes
const adminRoutes = require("./admin"); // Admin routes
const kycRoutes = require("./kyc"); // Kyc routes

// Use the routes
router.use("/users", userRoutes);
// router.use("/admin", adminRoutes);
// router.use("/kyc", kycRoutes);

module.exports = router;
