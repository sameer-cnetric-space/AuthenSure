const express = require("express");
const KycController = require("../controllers/kyc");
const validate = require("../middlewares/validate");
const { kycSchema } = require("../validations/kyc");
const { upload } = require("../services/fileUpload");
const userAuth = require("../middlewares/auth/user");
const {
  checkExistingModeration,
} = require("../middlewares/moderationValidator");

const {
  checkKycExists,
  checkKycStatus,
} = require("../middlewares/kycValidator");
const router = express.Router();

// Create a new KYC entry (User must be authenticated)
router.post(
  "/",
  userAuth,
  validate(kycSchema),
  checkKycStatus,
  KycController.createKyc
);

// KYC submission (with Joi validation and Multer for file upload) (User must be authenticated)
router.post(
  "/:kycId/upload",
  userAuth,
  checkKycExists,
  checkExistingModeration,
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  KycController.uploadKycAssets
);

// Get KYC details by ID (User must be authenticated)
router.get("/:id", userAuth, KycController.getKycById);

// Update KYC status (User must be authenticated)
router.put("/:id/status", userAuth, KycController.updateKycStatus);

module.exports = router;
