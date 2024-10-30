const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");
// Define KYC schema
const kycSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return generateUUID("kyc-");
      },
    },
    userId: {
      type: String, // This references the User model
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    idType: {
      type: String,
      required: true,
      enum: ["aadhaar-card", "passport", "dl", "voter-id", "pan-card"], // More options can be added
    },
    idNumber: {
      type: String,
      required: true,
      unique: true, // Assuming ID numbers should be unique
    },
    idIssueDate: {
      type: Date,
      required: true,
    },
    idExpiryDate: {
      type: Date,
      required: false, // Some ID types may not have an expiry date
    },
    idIssuingCountry: {
      type: String,
      required: true,
    },
    countryOfResidence: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: false, // Optional field
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    documentImage: {
      type: String, // Store the image URL or file path here
    },
    selfieImage: {
      type: String, // Store the image URL or file path here
    },
    kycStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"], // Default KYC status options
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KYC", kycSchema);
