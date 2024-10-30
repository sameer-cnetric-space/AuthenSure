const { formatDate } = require("../dateFormatter");

// Function to sanitize Aadhaar OCR data and KYC data for comparison
const sanitizeAadharData = (ocrData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // Aadhaar number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
    firstIssueDate: ocrData.firstIssueDate, // id issue date
  };
  return modOcrData;
};

// Function to sanitize KYC data as per aadhaar fields comparison
const sanitizeModKycDataAadhar = (kycData) => {
  const modKycData = {
    documentNumber: kycData.idNumber.trim(), // Aadhaar number
    name: kycData.user.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: formatDate(kycData.dob), // DOB
    firstIssueDate: formatDate(kycData.idIssueDate), //  id issue date
  };
  return modKycData;
};

module.exports = { sanitizeAadharData, sanitizeModKycDataAadhar };
