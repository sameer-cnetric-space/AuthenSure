// Function to format a Date object or string to 'YYYY-MM-DD'
const formatDate = (date) => {
  if (!date) return ""; // Return empty string if the date is not provided
  return new Date(date).toISOString().split("T")[0]; // Extract 'YYYY-MM-DD'
};

// Function to sanitize Aadhaar OCR data and KYC data for comparison
const sanitizeAadharData = (ocrData, kycData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // Aadhaar number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
    firstIssueDate: ocrData.firstIssueDate, // id issue date
  };
  return modOcrData;
};

// Function to sanitize KYC data as per aadhaar fields comparison
const sanitizeModKycData = (kycData) => {
  const modKycData = {
    documentNumber: kycData.idNumber.trim(), // Aadhaar number
    name: kycData.user.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: formatDate(kycData.dob), // DOB
    firstIssueDate: formatDate(kycData.idIssueDate), //  id issue date
  };
  return modKycData;
};

module.exports = { sanitizeAadharData, sanitizeModKycData };
