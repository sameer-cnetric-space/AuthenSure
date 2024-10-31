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

const checkKycStatus = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming req.user contains authenticated user's ID

    // Check if there's an existing KYC entry in Pending or Verified status for the user
    const existingKyc = await Kyc.findOne({
      userId,
      kycStatus: { $in: ["Pending", "Verified"] },
    });

    if (existingKyc) {
      return res.status(400).json({
        message:
          "A KYC entry with Pending or Verified status already exists. You cannot create a new one.",
      });
    }

    // If no such KYC entry exists, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error("Error checking KYC status:", error);
    return res.status(500).json({
      message: "Error checking KYC status",
      error: error.message,
    });
  }
};

module.exports = { checkKycExists, checkKycStatus };
