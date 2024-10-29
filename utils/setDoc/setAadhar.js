// Function to sanitize Aadhaar OCR data and KYC data for comparison
const sanitizeAadharData = (ocrData, kycData) => {
  return {
    documentNumber: ocrData.documentNumber.trim(), // Aadhaar number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth.trim(), // DOB
    sex: ocrData.sex.trim(), // Gender
    issuingStateCode: ocrData.issuingStateCode.trim(), // State code
  };
};

module.exports = sanitizeAadharData;
