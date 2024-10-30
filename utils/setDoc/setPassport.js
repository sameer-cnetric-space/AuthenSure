const { formatDate } = require("../dateFormatter");

// Passport OCR sanitization
const sanitizePassportData = (ocrData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // Passport number
    name: ocrData.givenNames.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
    dateOfIssue: ocrData.dateOfIssue, // Passport issue date
    dateOfExpiry: ocrData.dateOfExpiry, // Passport expiry date
  };
  return modOcrData;
};

// Passport KYC sanitization
const sanitizeModKycDataPassport = (kycData) => {
  const modKycData = {
    documentNumber: kycData.idNumber.trim(), // Passport number
    name: kycData.user.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: formatDate(kycData.dob), // DOB
    dateOfIssue: formatDate(kycData.idIssueDate), // Passport issue date
    dateOfExpiry: formatDate(kycData.idExpiryDate), // Passport expiry date
  };

  return modKycData;
};

module.exports = { sanitizePassportData, sanitizeModKycDataPassport };
