// Function to sanitize Passport OCR data and KYC data for comparison
const sanitizePassportData = (ocrData) => {
  return {
    documentNumber: ocrData.documentNumber.trim(), // Passport number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth.trim(), // DOB
    dateOfExpiry: ocrData.dateOfExpiry.trim(), // Expiry date
    placeOfBirth: ocrData.placeOfBirth.trim(), // Place of birth
    sex: ocrData.sex.trim(), // Gender
    nationality: ocrData.nationality.trim(), // Nationality
  };
};

module.exports = sanitizePassportData;
