const { createHmac, randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const JWTsecret = process.env.JWT_SECRET; // Use env variable for JWT secret

class AuthService {
  // Hash password with salt
  static generateHash(salt, password) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  // Generate salt for password hashing
  static generateSalt() {
    return randomBytes(32).toString("hex");
  }

  // Generate JWT token
  static generateToken(user, expiryTime) {
    return jwt.sign({ id: user._id, email: user.email }, JWTsecret, {
      expiresIn: expiryTime,
    });
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWTsecret);
    } catch (err) {
      throw new Error("Invalid Token");
    }
  }

  // Validate hashed password
  static validatePassword(inputPassword, user) {
    const hashedPassword = AuthService.generateHash(user.salt, inputPassword);
    return hashedPassword === user.password;
  }
}

module.exports = AuthService;
