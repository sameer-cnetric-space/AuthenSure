const buildFileUrl = (req, filePath) => {
  if (!filePath) return null;
  // Get protocol (http or https) and host (e.g., localhost:3005 or domain)
  // Use `X-Forwarded-Proto` header to determine the correct protocol, fallback to req.protocol
  const protocol = req.get("X-Forwarded-Proto") || req.protocol;
  const host = req.get("host"); // Returns the domain name or IP with the port

  // Build the complete URL by concatenating the protocol, host, and file path
  return `${protocol}://${host}${filePath}`;
};

module.exports = { buildFileUrl };
