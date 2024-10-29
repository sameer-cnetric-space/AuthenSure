const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { compareStrings } = require("../utils/stringComparison"); // Utility for string comparison

// Import document-specific sanitizers
const sanitizeAadharData = require("../utils/setDoc/setAadhar");
const sanitizePassportData = require("../utils/setDoc/setPassport");
const sanitizePanCardData = require("../utils/setDoc/setPanCard");
const sanitizeDrivingLicenseData = require("../utils/setDoc/setDrivingLicense");
const sanitizeVoterIdData = require("../utils/setDoc/setVoterId");

// Parse the OCR environment variable
const ocrEnv = JSON.parse(process.env.OCR);

/**
 * Function to extract data from a document image using RapidAPI ID Document Recognition
 * @param {String} imagePath - The local path to the image file
 * @returns {Object} Extracted data from the document
 */
const extractDataFromDocument = async (imagePath) => {
  try {
    // Create a form for the file upload
    const form = new FormData();
    form.append("image", fs.createReadStream(imagePath));

    // Send a POST request to the RapidAPI OCR service
    const response = await axios.post(ocrEnv.url, form, {
      headers: {
        ...form.getHeaders(),
        "x-rapidapi-host": ocrEnv.rapidHost,
        "x-rapidapi-key": ocrEnv.rapidApiKey, // Use the key from the parsed environment variable
      },
    });

    const { data } = response;

    if (data.status !== "ok") {
      throw new Error("OCR extraction failed");
    }

    // Map the extracted data to a structured format, depending on the document type
    const extractedData = data.data.ocr;
    // Remove 'validState' field if it exists
    if (extractedData.hasOwnProperty("validState")) {
      delete extractedData.validState;
    }

    return extractedData;
  } catch (error) {
    console.error("Error extracting data from document:", error.message);
    throw new Error("OCR extraction failed");
  }
};

/**
 * Generalized function to compare extracted OCR data with user-provided KYC form data based on document type
 * @param {String} documentType - The type of document (e.g., aadhar, passport, panCard)
 * @param {Object} ocrData - Extracted OCR data from the document
 * @param {Object} kycData - User-provided KYC form data
 * @returns {Boolean} Whether the OCR data matches the KYC form data
 */
const compareDocumentByType = (documentType, ocrData, kycData) => {
  let sanitizedOcrData, sanitizedKycData;

  // Select the appropriate sanitization function based on document type
  switch (documentType.toLowerCase()) {
    case "aadhar":
      sanitizedOcrData = sanitizeAadharData(ocrData);
      sanitizedKycData = sanitizeAadharData(kycData);
      break;
    case "passport":
      sanitizedOcrData = sanitizePassportData(ocrData);
      sanitizedKycData = sanitizePassportData(kycData);
      break;
    case "panCard":
      sanitizedOcrData = sanitizePanCardData(ocrData);
      sanitizedKycData = sanitizePanCardData(kycData);
      break;
    case "drivingLicense":
      sanitizedOcrData = sanitizeDrivingLicenseData(ocrData);
      sanitizedKycData = sanitizeDrivingLicenseData(kycData);
      break;
    case "voterId":
      sanitizedOcrData = sanitizeVoterIdData(ocrData);
      sanitizedKycData = sanitizeVoterIdData(kycData);
      break;
    default:
      throw new Error(`Unsupported document type: ${documentType}`);
  }

  // Compare each sanitized field from the OCR with the KYC form data
  const matchFields = Object.keys(sanitizedOcrData).map((field) => {
    return compareStrings(sanitizedOcrData[field], sanitizedKycData[field]);
  });

  // Return true if all fields match, false if any field doesn't match
  return matchFields.every(Boolean);
};

module.exports = { extractDataFromDocument, compareDocumentByType };
