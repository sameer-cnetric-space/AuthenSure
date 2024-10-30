const Kyc = require("../models/kyc");
const { buildFileUrl } = require("../utils/buildUrl");

class KycController {
  /**
   * Create a new KYC entry
   */
  static async createKyc(req, res) {
    try {
      const {
        nationality,
        dob,
        idType,
        idNumber,
        idIssueDate,
        idExpiryDate,
        idIssuingCountry,
        countryOfResidence,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
      } = req.body;

      // Get the authenticated user's ID from req.user (set by userAuth middleware)
      const userId = req.user._id;

      // Create a new KYC record
      const kyc = new Kyc({
        userId,
        nationality,
        dob,
        idType,
        idNumber,
        idIssueDate,
        idExpiryDate,
        idIssuingCountry,
        countryOfResidence,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        kycStatus: "Pending", // Default status
      });

      await kyc.save();

      const formattedRes = {
        id: kyc._id,
        userId: kyc.userId,
        nationality: kyc.nationality,
        dob: kyc.dob,
        idType: kyc.idType,
        idNumber: kyc.idNumber,
        idIssueDate: kyc.idIssueDate,
        idExpiryDate: kyc.idExpiryDate,
        idIssuingCountry: kyc.idIssuingCountry,
        countryOfResidence: kyc.countryOfResidence,
        addressLine1: kyc.addressLine1,
        addressLine2: kyc.addressLine2,
        city: kyc.city,
        state: kyc.state,
        zipCode: kyc.zipCode,
        kycStatus: kyc.kycStatus,
      };

      return res
        .status(201)
        .json({ message: "KYC entry created successfully", kyc: formattedRes });
    } catch (error) {
      console.error(error);
      // Handle duplicate key error (E11000)
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.idNumber
      ) {
        return res.status(409).json({
          message: "Duplicate entry",
          error: `KYC Entry with ID number ${req.body.idNumber} already exists.`,
        });
      }
      return res
        .status(500)
        .json({ message: "Error creating KYC entry", error: error.message });
    }
  }

  /**
   * Handle uploading KYC assets (selfie and document) and saving KYC details
   */
  static async uploadKycAssets(req, res) {
    try {
      const kycId = req.params.kycId;

      // Ensure both files (selfie and document) are uploaded
      if (!req.files || !req.files.selfie || !req.files.document) {
        return res.status(400).json({
          message: "Both selfie and document images are required.",
        });
      }

      // Get the paths for the uploaded files
      const selfiePath = `/public/kycAssets/${kycId}/selfie-${kycId}.${
        req.files.selfie[0].mimetype.split("/")[1]
      }`;
      const documentPath = `/public/kycAssets/${kycId}/doc-${kycId}.${
        req.files.document[0].mimetype.split("/")[1]
      }`;

      // Build full URLs for selfie and document paths
      const selfieUrl = buildFileUrl(req, selfiePath);
      const documentUrl = buildFileUrl(req, documentPath);

      // Update the KYC entry in the database with the file paths
      const kyc = await Kyc.findByIdAndUpdate(
        kycId,
        {
          selfieImage: selfiePath,
          documentImage: documentPath,
        },
        { new: true }
      );

      if (!kyc) {
        return res.status(404).json({ message: "KYC not found" });
      }

      const formattedRes = {
        id: kyc._id,
        selfieImage: selfieUrl,
        documentImage: documentUrl,
      };

      return res.status(200).json({
        message: "KYC assets uploaded successfully",
        kyc: formattedRes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error uploading KYC assets",
        error: error.message,
      });
    }
  }

  /**
   * Fetch KYC details by KYC ID
   */
  static async getKycById(req, res) {
    try {
      const kycId = req.params.id;
      const kyc = await Kyc.findById(kycId);

      if (!kyc) {
        return res.status(404).json({ message: "KYC not found" });
      }

      // Build full URLs for selfie and document paths
      const selfieUrl = buildFileUrl(req, kyc.selfieImage);
      const documentUrl = buildFileUrl(req, kyc.documentImage);

      return res.status(200).json({
        ...kyc.toObject(),
        selfieImage: selfieUrl,
        documentImage: documentUrl,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error fetching KYC data",
        error: error.message,
      });
    }
  }

  /**
   * Update the KYC status (e.g., Verified, Rejected)
   */
  static async updateKycStatus(req, res) {
    try {
      const { kycStatus } = req.body;
      const kycId = req.params.id;

      // Ensure valid status is provided
      if (!["Pending", "Verified", "Rejected"].includes(kycStatus)) {
        return res.status(400).json({
          message: "Invalid KYC status provided",
        });
      }

      // Update the KYC status
      const kyc = await Kyc.findByIdAndUpdate(
        kycId,
        { kycStatus },
        { new: true }
      );

      if (!kyc) {
        return res.status(404).json({ message: "KYC not found" });
      }

      return res.status(200).json({
        message: `KYC status updated to ${kycStatus}`,
        kyc,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error updating KYC status",
        error: error.message,
      });
    }
  }
}

module.exports = KycController;
