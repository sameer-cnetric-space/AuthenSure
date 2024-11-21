const { checkImageQuality } = require("../services/imageQuality");

/**
 * Middleware to check image quality of both selfie and document
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const checkImageQualityMiddleware = async (req, res, next) => {
  try {
    // Extract files from multer's req.files
    const selfie = req.files?.selfie?.[0];
    const document = req.files?.document?.[0];

    // Ensure both files are uploaded
    if (!selfie || !document) {
      return res.status(400).json({
        message: "Both selfie and document images are required.",
      });
    }

    // Pass the file buffers and metadata to the image quality service
    const qualityResult = await checkImageQuality(
      {
        buffer: selfie.buffer,
        mimetype: selfie.mimetype,
        originalname: selfie.originalname,
      },
      {
        buffer: document.buffer,
        mimetype: document.mimetype,
        originalname: document.originalname,
      }
    );

    // If both images meet the quality criteria, proceed to the next step
    if (qualityResult.isAcceptable) {
      next();
    } else {
      // If any image fails the quality check, return an error response
      res.status(400).json({
        message: "Image quality check failed",
        details: qualityResult.details,
      });
    }
  } catch (error) {
    console.error("Error in image quality middleware:", error.message);
    res.status(500).json({
      message: "Error checking image quality",
      error: error.message,
    });
  }
};

module.exports = { checkImageQualityMiddleware };
