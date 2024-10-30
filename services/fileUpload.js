const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // For image conversion

// Use multer's memoryStorage to store files in memory as buffers
const storage = multer.memoryStorage();

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

// A utility to save files and convert .jpg to .jpeg if necessary
const saveFileFromBuffer = async (buffer, filePath, mimetype) => {
  if (mimetype === "image/jpg") {
    const jpegFilePath = filePath.replace(/\.jpg$/, ".jpeg"); // Convert .jpg to .jpeg
    await sharp(buffer).toFormat("jpeg").toFile(jpegFilePath);
    return jpegFilePath; // Return the new path
  } else {
    // For other image formats, just save the file as it is
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(filePath);
      });
    });
  }
};

// A utility to ensure directory existence and file saving
const saveKycAssets = async (req) => {
  const kycId = req.params.kycId;

  // Define the folder path
  const folderPath = path.join(__dirname, "../public/kycAssets", kycId);

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Define the relative file paths for both selfie and document
  let selfieRelativePath = `/public/kycAssets/${kycId}/selfie-${kycId}.${
    req.files.selfie[0].mimetype.split("/")[1]
  }`;
  let documentRelativePath = `/public/kycAssets/${kycId}/doc-${kycId}.${
    req.files.document[0].mimetype.split("/")[1]
  }`;

  // Define the absolute file paths for both selfie and document
  let selfieAbsolutePath = path.join(__dirname, `..${selfieRelativePath}`);
  let documentAbsolutePath = path.join(__dirname, `..${documentRelativePath}`);

  // Save the files from buffers to disk (convert .jpg to .jpeg if necessary)
  selfieAbsolutePath = await saveFileFromBuffer(
    req.files.selfie[0].buffer,
    selfieAbsolutePath,
    req.files.selfie[0].mimetype
  );
  documentAbsolutePath = await saveFileFromBuffer(
    req.files.document[0].buffer,
    documentAbsolutePath,
    req.files.document[0].mimetype
  );

  // Update relative paths if conversion occurred
  if (selfieAbsolutePath !== selfieRelativePath) {
    selfieRelativePath = `/public/kycAssets/${kycId}/${path.basename(
      selfieAbsolutePath
    )}`;
  }
  if (documentAbsolutePath !== documentRelativePath) {
    documentRelativePath = `/public/kycAssets/${kycId}/${path.basename(
      documentAbsolutePath
    )}`;
  }

  return {
    selfie: {
      relativePath: selfieRelativePath,
      absolutePath: selfieAbsolutePath,
    },
    document: {
      relativePath: documentRelativePath,
      absolutePath: documentAbsolutePath,
    },
  };
};

module.exports = { upload, saveKycAssets };
