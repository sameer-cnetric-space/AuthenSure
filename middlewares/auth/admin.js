const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin"); // Assuming the Admin model is here
const JWTsecret = process.env.JWT_SECRET;

// Middleware to authorize any authenticated admin
const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWTsecret);

    // Find the admin by decoded ID
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin not found" });
    }

    // Attach admin to request object
    req.admin = admin;

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token is not valid", error: err.message });
  }
};

module.exports = { adminAuth };
