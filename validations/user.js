const Joi = require("joi");

// Validation schema for user registration
const registrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  username: Joi.string().alphanum().min(3).required(),
  phone: Joi.string().required(),
});

// Validation schema for user login
const loginSchema = Joi.object({
  login: Joi.string().required(), // Can be either email or username
  password: Joi.string().min(6).required(),
});

module.exports = {
  registrationSchema,
  loginSchema,
};
