const Kyc = require("../models/kyc"); // Assuming Kyc is your KYC model
const Moderation = require("../models/moderation");
/**
 * Middleware to check if the KYC entry belongs to the authenticated user
 */
const checkKycOwnership = async (req, res, next) => {
  try {
    const kycId = req.params.kycId;
    const userId = req.user._id;

    // Check if the KYC entry belongs to the logged-in user
    const kyc = await Kyc.findOne({ _id: kycId, userId });

    if (!kyc) {
      return res.status(403).json({
        message: "Access denied. This KYC entry does not belong to you.",
      });
    }

    // If KYC entry belongs to the user, proceed to the next middleware/controller
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error checking KYC ownership",
      error: error.message,
    });
  }
};

/**
 * Middleware to check if a moderation entry already exists for the KYC ID
 */
const checkExistingModeration = async (req, res, next) => {
  try {
    const kycId = req.params.kycId;

    // Check if there's an existing moderation entry for the given KYC ID
    const existingModeration = await Moderation.findOne({ kycId });

    if (existingModeration) {
      return res.status(400).json({
        message:
          "Moderation already exists for this KYC entry. Only one moderation per KYC is allowed.",
      });
    }

    // If no moderation exists, proceed to the next middleware/controller
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error checking existing moderation entry",
      error: error.message,
    });
  }
};

module.exports = { checkKycOwnership, checkExistingModeration };
