const { formatDate } = require("../dateFormatter");

// Voter ID OCR sanitization
const sanitizeVoterIdData = (ocrData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // Voter ID number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
  };
  return modOcrData;
};

// Voter ID KYC sanitization
const sanitizeModKycDataVoterId = (kycData) => {
  const modKycData = {
    documentNumber: kycData.idNumber.trim(), // Voter ID number
    name: kycData.user.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: formatDate(kycData.dob), // DOB
  };
  return modKycData;
};

module.exports = { sanitizeVoterIdData, sanitizeModKycDataVoterId };
