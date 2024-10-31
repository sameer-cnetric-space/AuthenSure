const { formatDate } = require("../dateFormatter");

/**
 * Valiation as per Indian Government for Expiry  Date
 * Private Driving license is valid for 20 years from the date of issue or till the holder attains 40 years of age, which comes earlier.
 * After the age of 40 the Driving licence will be issued for 10 years & then 5 years subsequently.
 */

function calculateDlExpiry(issueDate, dateOfBirth) {
  const issue = new Date(issueDate);
  const dob = new Date(dateOfBirth);
  const ageAtIssue = issue.getFullYear() - dob.getFullYear();
  let expiry;

  if (ageAtIssue < 40) {
    expiry = new Date(dob.setFullYear(dob.getFullYear() + 40));
    if (expiry > new Date(issue.setFullYear(issue.getFullYear() + 20))) {
      expiry = issue;
    }
  } else if (ageAtIssue < 50) {
    expiry = new Date(dob.setFullYear(50));
  } else if (ageAtIssue < 55) {
    expiry = new Date(dob.setFullYear(55));
  } else {
    expiry = new Date(issue.setFullYear(issue.getFullYear() + 5));
  }

  return expiry.toISOString().split("T")[0];
}

// Driving License OCR sanitization
const sanitizeDrivingLicenseData = (ocrData) => {
  const modOcrData = {
    documentNumber: ocrData.documentNumber.trim(), // DL number
    name: ocrData.name.replace(/\^/g, "").trim(), // Remove special characters like '^'
    dateOfBirth: ocrData.dateOfBirth, // DOB
    dateOfIssue: ocrData.dateOfIssue, // DL issue date
    dateOfExpiry:
      ocrData.dateOfExpiry ||
      calculateDlExpiry(ocrData.dateOfIssue, ocrData.dateOfBirth), // DL expiry date
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
