const express = require("express");
const UserController = require("../controllers/user");
const { registrationSchema, loginSchema } = require("../validations/user"); // Import Joi schemas
const validate = require("../middlewares/validate"); // Import validation middleware

const router = express.Router();

// Apply validation middleware and route controllers
router.post("/register", validate(registrationSchema), UserController.register); // Registration route
router.post("/login", validate(loginSchema), UserController.login); // Login route
router.get("/:id", UserController.getUserById); // Get user by ID route (no validation for now)

module.exports = router;
