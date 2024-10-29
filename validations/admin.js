const Joi = require("joi");

// Validation schema for admin registration
const adminRegistrationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "superadmin"),
});

// Validation schema for admin login
const adminLoginSchema = Joi.object({
  login: Joi.string().required(), // Can be either email or username
  password: Joi.string().min(6).required(),
});

module.exports = {
  adminRegistrationSchema,
  adminLoginSchema,
};
