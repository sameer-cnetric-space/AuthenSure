const Moderation = require("../models/moderation");
const ocrService = require("./ocr");
const faceRecogService = require("./faceRecog");

const runModerationChecks = async (
  kycId,
  documentPath,
  selfiePath,
  kycData
) => {
  try {
    // Step 1: OCR Service
    const ocrData = await ocrService.extractDataFromDocument(documentPath);
    if (ocrData.hasOwnProperty("sex")) {
      delete ocrData["sex"];
    }

    if (ocrData.hasOwnProperty("gender")) {
      delete ocrData["gender"];
    }

    // Step 2: Compare OCR data with KYC form data
    const { isMatch, mismatchResults } = ocrService.compareDocumentByType(
      kycData.idType,
      ocrData,
      kycData
    );

    // Step 3: Face Recognition and Liveliness Check
    const faceRecogResult = await faceRecogService.compareFacesAndLiveliness(
      selfiePath,
      documentPath
    );

    // Step 4: Store moderation result in the database
    const moderation = new Moderation({
      kycId,
      ocrData: ocrData, // Store the OCR data extracted from the document
      ocrMatch: isMatch, // Whether all fields match
      ocrMismatchDetails: mismatchResults, // Store the mismatch details
      faceMatch: {
        match: faceRecogResult.match,
        matchConfidence: faceRecogResult.match_confidence,
      },
      liveliness: {
        passed: faceRecogResult.liveliness,
        livelinessDetails: faceRecogResult.liveliness_details,
        livelinessResults: {
          sharpness: {
            passed: faceRecogResult.liveliness_results.checks.sharpness.passed,
            score: faceRecogResult.liveliness_results.checks.sharpness.score,
          },
          symmetry: {
            passed: faceRecogResult.liveliness_results.checks.symmetry.passed,
            score: faceRecogResult.liveliness_results.checks.symmetry.score,
          },
          texture: {
            passed: faceRecogResult.liveliness_results.checks.texture.passed,
            score: faceRecogResult.liveliness_results.checks.texture.score,
          },
          moire: {
            passed: faceRecogResult.liveliness_results.checks.moire.passed,
            score: faceRecogResult.liveliness_results.checks.moire.score,
          },
          depth: {
            passed: faceRecogResult.liveliness_results.checks.depth.passed,
            score: faceRecogResult.liveliness_results.checks.depth.score,
          },
          edgeNoise: {
            passed: faceRecogResult.liveliness_results.checks.edge_noise.passed,
            score: faceRecogResult.liveliness_results.checks.edge_noise.score,
          },
          blink: {
            passed: faceRecogResult.liveliness_results.checks.blink.passed,
            score: faceRecogResult.liveliness_results.checks.blink.score,
          },
          size: {
            passed: faceRecogResult.liveliness_results.checks.size.passed,
            score: faceRecogResult.liveliness_results.checks.size.score,
          },
        },
      },
    });

    // Save the moderation result to the database
    await moderation.save();

    // Return the moderation result
    return moderation;
  } catch (error) {
    console.error("Error in moderation service:", error.message);
    throw new Error("Moderation checks failed");
  }
};

module.exports = { runModerationChecks };
