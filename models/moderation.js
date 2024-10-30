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
      match: Boolean, // Validate the map keys
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Moderation", moderationSchema);
