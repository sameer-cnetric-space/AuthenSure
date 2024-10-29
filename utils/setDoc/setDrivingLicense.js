// Function to sanitize Driving License OCR data and KYC data for comparison
const sanitizeDrivingLicenseData = (ocrData) => {
  return {
    documentNumber: ocrData.documentNumber.trim(), // DL number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth.trim(), // DOB
    dateOfExpiry: ocrData.dateOfExpiry.trim(), // Expiry date
    address: ocrData.address.replace(/\^/g, "").trim(), // Address, removing special characters
    fathersName: ocrData.fathersName.trim(), // Father's name
  };
};

module.exports = sanitizeDrivingLicenseData;
