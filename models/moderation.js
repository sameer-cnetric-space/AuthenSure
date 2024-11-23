const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

// Define Moderation schema
const moderationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return generateUUID("mod-");
      },
    },
    kycId: {
      type: String, // Reference to the KYC model
      required: true,
    },
    ocrData: {
      type: Map, // Using a Map to store flexible key-value pairs for OCR data
      of: mongoose.Schema.Types.Mixed, // Allows mixed data types (string, number, etc.)
    },
    ocrMatch: {
      type: Boolean, // Field to store whether OCR data matches KYC data
      required: true,
    },
    ocrMismatchDetails: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    faceMatch: {
      match: Boolean,
      matchConfidence: Number,
    },
    liveliness: {
      passed: Boolean,
      livelinessDetails: String,
      livelinessResults: {
        sharpness: {
          passed: Boolean,
          score: Number,
        },
        symmetry: {
          passed: Boolean,
          score: Number,
        },
        texture: {
          passed: Boolean,
          score: Number,
        },
        moire: {
          passed: Boolean,
          score: Number,
        },
        depth: {
          passed: Boolean,
          score: Number,
        },
        edgeNoise: {
          passed: Boolean,
          score: Number,
        },
        blink: {
          passed: Boolean,
          score: Number,
        },
        size: {
          passed: Boolean,
          score: Number,
        },
      },
    },
    errorLogs: {
      type: [String], // Array to store error messages
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Failed", "Completed"], // Tracks the moderation process status
      default: "Pending",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Moderation", moderationSchema);
