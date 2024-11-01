const Kyc = require("../models/kyc");
const KycService = require("../services/kyc");
const { buildFileUrl } = require("../utils/buildUrl");
const ModerationService = require("../services/moderation");
const fs = require("fs");
const { saveKycAssets } = require("../services/fileUpload");

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

      // Save KYC assets (selfie and document) using the utility
      const { selfie, document } = await saveKycAssets(req);

      // Ensure the files exist after saving
      if (!fs.existsSync(selfie.absolutePath)) {
        throw new Error(`Selfie file not found at ${selfie.absolutePath}`);
      }
      if (!fs.existsSync(document.absolutePath)) {
        throw new Error(`Document file not found at ${document.absolutePath}`);
      }

      // Build full URLs for selfie and document paths
      const selfieUrl = buildFileUrl(req, selfie.relativePath);
      const documentUrl = buildFileUrl(req, document.relativePath);

      // Update the KYC entry in the database with the file paths
      const kyc = await Kyc.findByIdAndUpdate(
        kycId,
        {
          selfieImage: selfie.relativePath,
          documentImage: document.relativePath,
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

      const user = {
        id: req.user._id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        gender: req.user.gender,
      };

      // Combine KYC data with authenticated user data
      const wholeKyc = { ...kyc.toObject(), user };

      //----------------------****************------------------------------------------//
      // Trigger Moderation Service for Face Recognition and OCR asynchronously
      ModerationService.runModerationChecks(
        kycId,
        document.absolutePath,
        selfie.absolutePath,
        wholeKyc
      );
      //----------------------****************------------------------------------------//

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
   * Get all KYC entries with specific fields
   */
  static async getAllKycEntries(req, res) {
    try {
      const { formattedKycs, pagination } = await KycService.getAllKycEntries(
        req,
        res
      );
      return res.status(200).json({
        kycs: formattedKycs,
        pagination: pagination,
      });
    } catch (error) {
      console.error("Error fetching KYC entries:", error);
      return res.status(500).json({
        message: "Error fetching KYC entries",
        error: error.message,
      });
    }
  }

  /**
   * Fetch KYC details by KYC ID
   */
  static async getKycById(req, res) {
    try {
      const { id: kycId } = req.params;

      // Fetch the KYC entry data without moderation
      const kycData = await KycService.getKycById(kycId, req);

      if (!kycData) {
        return res.status(404).json({
          message: "KYC entry not found",
        });
      }

      return res.status(200).json({
        kyc: kycData,
      });
    } catch (error) {
      console.error("Error fetching KYC entry:", error);
      return res.status(500).json({
        message: "Error fetching KYC entry",
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

      const kyc = await KycService.updateKycStatus(kycId, kycStatus);

      if (!kyc) {
        return res.status(404).json({ message: "KYC not found" });
      }

      return res.status(200).json({
        message: `KYC status updated to ${kycStatus}`,
      });
    } catch (error) {
      console.error("Error updating KYC status:", error);
      const status = error.message.includes("Invalid KYC status") ? 400 : 500;
      return res.status(status).json({
        message: "Error updating KYC status",
        error: error.message,
      });
    }
  }

  // Fetch KYC entries for a specific user with pagination
  static async getUserKycEntries(req, res) {
    try {
      // Pass user ID and request object to the service
      const userId = req.user._id; // Assume userAuth middleware sets req.user
      const data = await KycService.getUserKycEntries(userId, req);

      return res.status(200).json({
        ...data,
      });
    } catch (error) {
      console.error("Error in getUserKycEntries controller:", error);
      return res.status(500).json({
        message: "Error fetching KYC entries for user",
        error: error.message,
      });
    }
  }

  // Fetch a single KYC entry with moderation details (for Admins)
  static async getKycWithModeration(req, res) {
    try {
      const kycId = req.params.id;
      const data = await KycService.getKycWithModeration(kycId, req);

      return res.status(200).json({
        kyc: data,
      });
    } catch (error) {
      console.error("Error in getKycWithModeration controller:", error);
      return res.status(500).json({
        message: "Error fetching KYC entry with moderation",
        error: error.message,
      });
    }
  }
}

module.exports = KycController;
