const { formatDate } = require("../dateFormatter");

// Driving License OCR sanitization
const sanitizeDrivingLicenseData = (ocrData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // DL number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
    dateOfIssue: ocrData.dateOfIssue, // DL issue date
    dateOfExpiry: ocrData.dateOfExpiry, // DL expiry date
  };
  return modOcrData;
};

// Driving License KYC sanitization
const sanitizeModKycDataDrivingLicense = (kycData) => {
  const modKycData = {
    documentNumber: kycData.idNumber.trim(), // DL number
    name: kycData.user.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: formatDate(kycData.dob), // DOB
    dateOfIssue: formatDate(kycData.idIssueDate), // DL issue date
    dateOfExpiry: formatDate(kycData.idExpiryDate), // DL expiry date
  };
  return modKycData;
};

module.exports = {
  sanitizeDrivingLicenseData,
  sanitizeModKycDataDrivingLicense,
};
