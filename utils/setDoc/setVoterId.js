// Function to sanitize Voter ID OCR data and KYC data for comparison
const sanitizeVoterIdData = (ocrData) => {
  return {
    documentNumber: ocrData.documentNumber.trim(), // Voter ID number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth.trim(), // DOB
    fathersName: ocrData.fathersName.replace(/\^/g, "").trim(), // Father's name, removing special characters
    sex: ocrData.sex.trim(), // Gender
  };
};

module.exports = sanitizeVoterIdData;
