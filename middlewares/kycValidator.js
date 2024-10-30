const mongoose = require("mongoose");
const Kyc = require("../models/kyc"); // Assuming Kyc is your KYC model

const checkKycExists = async (req, res, next) => {
  try {
    const kycId = req.params.kycId;

    // Check if KYC exists in the database
    const kyc = await Kyc.findById(kycId);

    if (!kyc) {
      return res.status(404).json({
        message: "KYC ID not found",
      });
    }

    // If KYC exists, move to the next middleware
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error checking KYC ID",
      error: error.message,
    });
  }
};

module.exports = checkKycExists;
