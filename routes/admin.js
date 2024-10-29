const express = require("express");
const AdminController = require("../controllers/admin");
const {
  adminRegistrationSchema,
  adminLoginSchema,
} = require("../validations/admin");
const validate = require("../middlewares/validate");

const router = express.Router();

// Admin registration route with Joi validation
router.post(
  "/register",
  validate(adminRegistrationSchema),
  AdminController.register
);

// Admin login route with Joi validation
router.post("/login", validate(adminLoginSchema), AdminController.login);

// Get admin by ID
router.get("/:id", AdminController.getAdminById);

module.exports = router;
