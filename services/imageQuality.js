const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

/**
 * Function to check image quality for both selfie and document images
 * @param {String} selfiePath - The path to the selfie image file
 * @param {String} documentPath - The path to the document image file
 * @returns {Object} Result containing isAcceptable and quality details for each image
 */

const faceRecogBaseUrlEnv = process.env.FACE_RECOG_BASE_URL;

const checkImageQuality = async (selfiePath, documentPath) => {
  try {
    // Ensure paths are absolute to avoid errors
    const absSelfiePath = path.resolve(selfiePath);
    const absDocumentPath = path.resolve(documentPath);

    // Ensure both files exist
    if (!fs.existsSync(absSelfiePath) || !fs.existsSync(absDocumentPath)) {
      throw new Error("One or both image files not found.");
    }

    // Create form data for the request
    const formData = new FormData();
    formData.append("selfie", fs.createReadStream(absSelfiePath));
    formData.append("document", fs.createReadStream(absDocumentPath));

    // Make the request to the quality check service
    const response = await axios.post(
      `${faceRecogBaseUrlEnv}/check_image_quality/`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          accept: "application/json",
        },
      }
    );

    // Process the response
    const { selfie_quality, document_quality, message } = response.data;

    // Check if both selfie and document are acceptable
    const isAcceptable =
      selfie_quality.is_acceptable && document_quality.is_acceptable;

    return {
      isAcceptable,
      details: {
        selfie: selfie_quality,
        document: document_quality,
        message: isAcceptable
          ? "Both images meet the quality criteria."
          : message,
      },
    };
  } catch (error) {
    console.error("Error checking image quality:", error.message);
    throw new Error("Image quality check failed");
  }
};

module.exports = { checkImageQuality };
