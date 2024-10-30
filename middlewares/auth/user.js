const jwt = require("jsonwebtoken");
const User = require("../../models/user"); // Assuming the User model is here
const JWTsecret = process.env.JWT_SECRET;

const userAuth = async (req, res, next) => {
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

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    // Attach user to request object
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = userAuth;
