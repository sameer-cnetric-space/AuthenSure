const mongoose = require("mongoose");
const Kyc = require("../models/kyc"); // Assuming Kyc is your KYC model

const checkKycExists = async (req, res, next) => {
  try {
    const kycId = req.params.kycId;
    const userId = req.user._id; // Assuming req.user contains the authenticated user's ID

    // Check if the KYC exists and belongs to the current user
    const kyc = await Kyc.findOne({ _id: kycId, userId });

    if (!kyc) {
      return res.status(404).json({
        message: "KYC Entry not found",
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
