const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

// Define Admin schema
const adminSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return generateUUID("adm-");
      },
    },
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
      canManageUsers: { type: Boolean, default: true },
      canViewReports: { type: Boolean, default: true },
      canApproveKYC: { type: Boolean, default: true },
      canManageModeration: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
