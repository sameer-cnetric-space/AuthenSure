const axios = require("axios");
const FormData = require("form-data");

/**
 * Function to check image quality for both selfie and document images
 * @param {Object} selfie - Object containing buffer, mimetype, and originalname for selfie
 * @param {Object} document - Object containing buffer, mimetype, and originalname for document
 * @returns {Object} Result containing isAcceptable and quality details for each image
 */
const checkImageQuality = async (selfie, document) => {
  try {
    // Create form data for the request
    const formData = new FormData();
    formData.append("selfie", selfie.buffer, {
      contentType: selfie.mimetype,
      filename: selfie.originalname,
    });
    formData.append("document", document.buffer, {
      contentType: document.mimetype,
      filename: document.originalname,
    });

    // Send the request to the external service
    const response = await axios.post(
      `${process.env.FACE_RECOG_BASE_URL}/check_image_quality/`,
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

    // Check if both images are acceptable
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
