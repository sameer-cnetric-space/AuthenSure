const mongoose = require("mongoose");

// Define Admin schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Super Admin", "Moderator", "Viewer"], // Define different roles
      default: "Super Admin", // Default role for new admins
    },
    permissions: {
      canManageUsers: { type: Boolean, default: false },
      canViewReports: { type: Boolean, default: false },
      canApproveKYC: { type: Boolean, default: false },
      canManageModeration: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
