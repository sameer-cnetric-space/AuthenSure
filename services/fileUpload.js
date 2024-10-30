const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const kycId = req.params.kycId; // Assume kycId is passed as a URL parameter

    // Define the folder path
    const folderPath = path.join(__dirname, "../public/kycAssets", kycId);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath); // Set the destination folder
  },
  filename: function (req, file, cb) {
    const kycId = req.params.kycId;

    // Define a filename based on the file type (selfie or document)
    if (file.fieldname === "selfie") {
      cb(null, `selfie-${kycId}${path.extname(file.originalname)}`);
    } else if (file.fieldname === "document") {
      cb(null, `doc-${kycId}${path.extname(file.originalname)}`);
    }
  },
});

// Set file filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg", // JPEG
    "image/png", // PNG
    "image/jpg", // JPG
    "image/webp", // WebP
    "image/heic", // HEIC
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type, only JPEG, JPG, PNG, WebP, and HEIC are allowed!"
      ),
      false
    );
  }
};

// Create the multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

module.exports = upload;
