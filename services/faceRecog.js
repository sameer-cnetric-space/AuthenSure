const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const faceRecogBaseUrlEnv = process.env.FACE_RECOG_BASE_URL;

/**
 * Function to compare faces and check liveliness using Python service
 * @param {String} selfiePath - The path to the selfie image
 * @param {String} documentPath - The path to the document image
 * @returns {Object} - The response from the Python service containing match, match_confidence, and liveliness results
 */
const compareFacesAndLiveliness = async (selfiePath, documentPath) => {
  try {
    // Create form data to send selfie and document images
    const form = new FormData();
    form.append("selfie", fs.createReadStream(path.resolve(selfiePath)));
    form.append("document", fs.createReadStream(path.resolve(documentPath)));

    // Send the request to the Python face recognition service
    const response = await axios.post(
      `${faceRecogBaseUrlEnv}/compare_faces/`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    // Handle the response from the Python service
    const { data } = response;

    // Return the match, match confidence, and liveliness results
    return {
      match: data.match,
      match_confidence: data.match_confidence,
      liveliness: data.liveliness,
      liveliness_details: data.liveliness_details,
      liveliness_results: data.liveliness_results,
    };
  } catch (error) {
    console.error(
      "Error comparing faces and checking liveliness:",
      error.message
    );
    throw new Error("Face comparison or liveliness check failed");
  }
};

module.exports = { compareFacesAndLiveliness };
