const { formatDate } = require("../dateFormatter");

// PAN Card OCR sanitization
const sanitizePanCardData = (ocrData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // PAN number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
  };
  return modOcrData;
};

// PAN Card KYC sanitization
const sanitizeModKycDataPanCard = (kycData) => {
  const modKycData = {
    documentNumber: kycData.idNumber.trim(), // PAN number
    name: kycData.user.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: formatDate(kycData.dob), // DOB
  };
  return modKycData;
};

module.exports = { sanitizePanCardData, sanitizeModKycDataPanCard };
