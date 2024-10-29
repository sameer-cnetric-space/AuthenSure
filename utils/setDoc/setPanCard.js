// Function to sanitize PAN Card OCR data and KYC data for comparison
const sanitizePanCardData = (ocrData) => {
  return {
    documentNumber: ocrData.documentNumber.trim(), // PAN number
    name: ocrData.name.trim(), // Name
    dateOfBirth: ocrData.dateOfBirth.trim(), // DOB
    fathersName: ocrData.fathersName.trim(), // Father's name
    issuingStateCode: ocrData.issuingStateCode.trim(), // State code
  };
};

module.exports = sanitizePanCardData;
