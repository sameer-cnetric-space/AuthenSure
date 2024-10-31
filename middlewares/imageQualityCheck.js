const { checkImageQuality } = require("../services/imageQuality");

/**
 * Middleware to check image quality of both selfie and document
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const checkImageQualityMiddleware = async (req, res, next) => {
  try {
    const { selfiePath, documentPath } = req.body; // Assuming paths are provided in req.body

    // Run image quality check
    const qualityResult = await checkImageQuality(selfiePath, documentPath);

    // If both images meet the quality criteria, proceed to the next step
    if (qualityResult.isAcceptable) {
      next();
    } else {
      // If any image fails the quality check, return an error response
      return res.status(400).json({
        message: "Image quality check failed",
        details: qualityResult.details,
      });
    }
  } catch (error) {
    console.error("Error in image quality middleware:", error.message);
    return res.status(500).json({
      message: "Error checking image quality",
      error: error.message,
    });
  }
};

module.exports = { checkImageQualityMiddleware };
