const Kyc = require("../models/kyc"); // Assuming Kyc is your KYC model
const { buildFileUrl } = require("../utils/buildUrl");

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

/**
 * Middleware to check if the KYC entry already has assets
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const checkKycAssets = async (req, res, next) => {
  try {
    const { kycId } = req.params;

    // Validate KYC ID
    if (!kycId) {
      return res.status(400).json({ message: "KYC ID is required." });
    }

    // Fetch KYC entry by ID
    const kyc = await Kyc.findById(kycId);

    if (!kyc) {
      return res.status(404).json({ message: "KYC entry not found." });
    }

    // Check if assets are already uploaded
    if (kyc.selfieImage || kyc.documentImage) {
      return res.status(400).json({
        message: "Assets already exist for this KYC entry.",
        assets: {
          selfieImage: buildFileUrl(kyc.selfieImage) || null,
          documentImage: buildFileUrl(kyc.documentImage) || null,
        },
      });
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error checking KYC assets:", error.message);
    res.status(500).json({
      message: "Error checking KYC assets.",
      error: error.message,
    });
  }
};

module.exports = { checkKycExists, checkKycStatus, checkKycAssets };
