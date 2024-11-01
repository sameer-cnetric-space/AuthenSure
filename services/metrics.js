const User = require("../models/user");
const Kyc = require("../models/kyc");
const Moderation = require("../models/moderation");

class MetricService {
  // Function to get key metrics for the dashboard
  static async getMetrics() {
    try {
      // Aggregate basic metrics
      const totalUsers = await User.countDocuments({});
      const totalKycEntries = await Kyc.countDocuments({});

      // Count KYC entries by status
      const pendingKycCount = await Kyc.countDocuments({
        kycStatus: "Pending",
      });
      const verifiedKycCount = await Kyc.countDocuments({
        kycStatus: "Verified",
      });
      const rejectedKycCount = await Kyc.countDocuments({
        kycStatus: "Rejected",
      });

      // Optionally, add metrics related to moderation if needed
      const totalModerationChecks = await Moderation.countDocuments({});
      //   const approvedModerations = await Moderation.countDocuments({
      //     "liveliness.passed": true,
      //     "faceMatch.match": true,
      //   });
      //   const failedModerations = totalModerationChecks - approvedModerations;

      return {
        totalUsers,
        totalKycEntries,
        pendingKycCount,
        verifiedKycCount,
        rejectedKycCount,
        totalModerationChecks,
        // approvedModerations,
        // failedModerations,
      };
    } catch (error) {
      console.error("Error in fetching metrics:", error);
      throw new Error("Could not fetch metrics");
    }
  }
}

module.exports = MetricService;
