const Kyc = require("../models/kyc");
const Moderation = require("../models/moderation");
const { buildFileUrl } = require("../utils/buildUrl");
const { deleteAssets } = require("../services/fileHandler");
const { deleteModerationsByKycId } = require("../services/moderation");

class KycService {
  // Fetch all KYC entries with specific fields
  static async getAllKycEntries(req, res) {
    try {
      // Retrieve page and limit from query parameters, setting default values if not provided
      const page = parseInt(req.query.page) || 1; // Default to first page
      const limit = parseInt(req.query.limit) || 10; // Default to 10 entries per page
      const customSkip = parseInt(req.query.skip) || 0; // Custom skip from query parameter, default is 0

      // Calculate skip value: custom skip if provided, otherwise calculated based on page and limit
      const skip = customSkip > 0 ? customSkip : (page - 1) * limit;

      // Fetch KYC entries, ensuring it populates based on UUID
      const kycs = await Kyc.find({}, "_id selfieImage userId idType kycStatus")
        .populate({
          path: "userId",
          model: "User", // Specify the model explicitly to reference the UUID-based User model
          select: "firstName lastName email",
          match: { _id: { $exists: true } }, // Ensures only valid UUID references are populated
        })
        .skip(skip)
        .limit(limit);

      // Format the data
      const formattedKycs = kycs.map((kyc) => ({
        id: kyc._id,
        documentType: kyc.idType,
        status: kyc.kycStatus,
        name: `${kyc.userId?.firstName || "N/A"} ${
          kyc.userId?.lastName || ""
        }`.trim(),
        email: kyc.userId?.email || "N/A",
        selfieImage: buildFileUrl(req, kyc.selfieImage),
      }));

      // Fetch total count of KYC entries for pagination metadata
      const totalKycs = await Kyc.countDocuments();
      const currentKycs = formattedKycs.length;
      const totalPages = Math.ceil(totalKycs / limit);

      const pagination = {
        totalKycs,
        totalPages,
        currentKycs,
        currentPage: page,
        pageSize: limit,
      };

      return { formattedKycs, pagination };
    } catch (error) {
      console.error("Error fetching KYC entries:", error);
      return res.status(500).json({
        message: "Error fetching KYC entries",
        error: error.message,
      });
    }
  }

  // Fetch KYC entries for a specific user with pagination
  static async getUserKycEntries(userId, req) {
    try {
      // Provide default values if `req.query` is not available
      const page = req?.query?.page ? parseInt(req.query.page) : 1;
      const limit = req?.query?.limit ? parseInt(req.query.limit) : 10;
      const customSkip = req?.query?.skip ? parseInt(req.query.skip) : 0;

      // Calculate skip
      const skip = customSkip > 0 ? customSkip : (page - 1) * limit;

      // Fetch KYC entries for the specific user with pagination
      const kycs = await Kyc.find({ userId }, "_id selfieImage idType")
        .skip(skip)
        .limit(limit);

      // Format the KYC entries
      const formattedKycs = kycs.map((kyc) => ({
        id: kyc._id,
        documentType: kyc.idType,
        selfieImage: req ? buildFileUrl(req, kyc.selfieImage) : null, // Handle cases where `req` is not provided
      }));

      // Fetch total count of KYC entries for pagination metadata
      const totalKycs = await Kyc.countDocuments({ userId });
      const totalPages = Math.ceil(totalKycs / limit);

      // Return the formatted results with pagination metadata
      return {
        kycs: formattedKycs,
        pagination: {
          totalKycs,
          totalPages,
          currentPage: page,
          pageSize: limit,
          skipUsed: skip,
        },
      };
    } catch (error) {
      throw new Error("Error fetching KYC entries for user: " + error.message);
    }
  }

  // Fetch a single KYC entry with its moderation data
  static async getKycWithModeration(kycId, req) {
    try {
      // Fetch the KYC entry by ID with populated user details
      const kyc = await Kyc.findById(kycId).populate({
        path: "userId",
        model: "User", // Explicitly reference the UUID-based User model
        select: "firstName lastName email phone",
        match: { _id: { $exists: true } }, // Populate only valid UUID references
      });

      if (!kyc) {
        throw new Error("KYC entry not found");
      }

      // Fetch the moderation details related to this KYC ID
      const moderation = await Moderation.findOne({ kycId });
      let formattedModeration;
      if (moderation) {
        formattedModeration = {
          id: moderation._id,
          status: moderation.status,
          errorLogs: moderation.errorLogs,
          ocr: {
            ocrData: moderation.ocrData, // This includes any OCR data details
            ocrMatch: moderation.ocrMatch, // Indicates if OCR data matched the KYC data
            ocrMismatchDetails: moderation.ocrMismatchDetails,
          },
          faceMatch: {
            match: moderation.faceMatch.match,
            matchConfidence: moderation.faceMatch.matchConfidence,
          },
          liveliness: {
            passed: moderation.liveliness.passed,
            livelinessDetails: moderation.liveliness.livelinessDetails,
            livelinessResults: moderation.liveliness.livelinessResults,
          },
          createdAt: moderation.createdAt,
          updatedAt: moderation.updatedAt,
        };
      }

      // Format KYC entry and moderation details
      const formattedKyc = {
        id: kyc._id,
        documentType: kyc.idType,
        name: `${kyc.userId?.firstName || "N/A"} ${
          kyc.userId?.lastName || ""
        }`.trim(),
        email: kyc.userId?.email || "N/A",
        phone: kyc.userId?.phone || "N/A",
        selfieImage: buildFileUrl(req, kyc.selfieImage),
        documentImage: buildFileUrl(req, kyc.documentImage),
        kycStatus: kyc.kycStatus,
        nationality: kyc.nationality,
        dob: kyc.dob,
        idNumber: kyc.idNumber,
        idIssueDate: kyc.idIssueDate,
        idExpiryDate: kyc.idExpiryDate,
        idIssuingCountry: kyc.idIssuingCountry,
        countryOfResidence: kyc.countryOfResidence,
        addressLine1: kyc.addressLine1,
        addressLine2: kyc.addressLine2 || "N/A",
        city: kyc.city,
        state: kyc.state,
        zipCode: kyc.zipCode,
        moderation: formattedModeration || "No moderation data available",
      };

      return formattedKyc;
    } catch (error) {
      throw new Error("Error fetching KYC with moderation: " + error.message);
    }
  }

  // Update the KYC status
  static async updateKycStatus(kycId, kycStatus) {
    const validStatuses = ["Pending", "Verified", "Rejected"];
    if (!validStatuses.includes(kycStatus)) {
      throw new Error("Invalid KYC status provided");
    }

    return Kyc.findByIdAndUpdate(kycId, { kycStatus }, { new: true });
  }

  //Fetch a single KYC entry
  static async getKycById(kycId, req) {
    try {
      // Fetch KYC entry by ID, populating user details without moderation
      const kyc = await Kyc.findById(kycId).populate({
        path: "userId",
        model: "User", // Specify the model explicitly to reference the UUID-based User model
        select: "firstName lastName email",
        match: { _id: { $exists: true } }, // Ensures only valid UUID references are populated
      });

      if (!kyc) {
        return null;
      }

      // Format the KYC entry data
      return {
        id: kyc._id,
        documentType: kyc.idType,
        nationality: kyc.nationality,
        dob: kyc.dob,
        idNumber: kyc.idNumber,
        idIssueDate: kyc.idIssueDate,
        idExpiryDate: kyc.idExpiryDate,
        idIssuingCountry: kyc.idIssuingCountry,
        countryOfResidence: kyc.countryOfResidence,
        addressLine1: kyc.addressLine1,
        addressLine2: kyc.addressLine2 || "N/A",
        city: kyc.city,
        state: kyc.state,
        zipCode: kyc.zipCode,
        name: `${kyc.userId?.firstName || "N/A"} ${
          kyc.userId?.lastName || ""
        }`.trim(),
        email: kyc.userId?.email || "N/A",
        selfieImage: buildFileUrl(req, kyc.selfieImage),
        documentImage: buildFileUrl(req, kyc.documentImage),
        kycStatus: kyc.kycStatus,
        createdAt: kyc.createdAt,
        updatedAt: kyc.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching KYC by ID:", error);
      throw new Error("Could not fetch KYC data");
    }
  }

  // Get KYC Stats for User
  static async getUserKycStats(userId) {
    try {
      // Fetch KYC entries for the user with only relevant fields
      const kycs = await Kyc.find(
        { userId },
        "_id selfieImage documentImage idType kycStatus" // Select only required fields
      );

      if (!kycs) throw new Error("No KYC Entries Found");

      // Map the KYC data to the desired format
      const formattedKycs = kycs.map((kyc) => ({
        kycId: kyc._id,
        idType: kyc.idType,
        status: kyc.kycStatus,
        avlAssets: !!(kyc.selfieImage && kyc.documentImage), // Check if both assets are available
      }));

      return formattedKycs;
    } catch (error) {
      throw new Error("Error fetching KYC stats for user: " + error.message);
    }
  }

  static async deleteKycEntry(kycId) {
    try {
      const kyc = await Kyc.findById(kycId);
      if (!kyc) throw new Error("No KYC Entry Found");

      // Delete associated assets
      await deleteAssets(kycId);

      //Delete the related moderations
      await deleteModerationsByKycId(kycId);

      // Remove KYC entry from the database
      await Kyc.findByIdAndDelete(kycId);

      return { message: "KYC Entry and assets deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting KYC entry and assets: " + error.message);
    }
  }
}

module.exports = KycService;
