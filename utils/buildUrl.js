const buildFileUrl = (req, filePath) => {
  // Get protocol (http or https) and host (e.g., localhost:3005 or domain)
  const protocol = req.protocol;
  const host = req.get("host"); // Returns the domain name or IP with the port

  // Build the complete URL by concatenating the protocol, host, and file path
  return `${protocol}://${host}${filePath}`;
};

module.exports = { buildFileUrl };
