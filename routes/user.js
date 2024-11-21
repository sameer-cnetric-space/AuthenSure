const express = require("express");
const UserController = require("../controllers/user");
const { registrationSchema, loginSchema } = require("../validations/user"); // Import Joi schemas
const validate = require("../middlewares/validate"); // Import validation middleware
const userAuth = require("../middlewares/auth/user");

const router = express.Router();

// Apply validation middleware and route controllers
router.post("/register", validate(registrationSchema), UserController.register); // Registration route
router.post("/login", validate(loginSchema), UserController.login); // Login route

//me endpoint for user
router.get("/me", userAuth, UserController.getUserMe);
module.exports = router;
