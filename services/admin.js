const AuthService = require("./auth");
const Admin = require("../models/admin"); // Assuming you have an Admin model defined with Mongoose

class AdminService {
  // Get admin by ID
  static getAdminById(id) {
    return Admin.findById(id);
  }

  // Get admin by email or username
  static getAdminByEmailOrUsername(login) {
    if (login.includes("@")) {
      // If the login contains '@', treat it as an email
      return Admin.findOne({ email: login });
    } else {
      // Otherwise, treat it as a username
      return Admin.findOne({ username: login });
    }
  }

  // Create a new admin
  static async createAdmin(payload) {
    const { name, email, password, role } = payload;
    const salt = AuthService.generateSalt();
    const hashedPassword = AuthService.generateHash(salt, password);

    const newAdmin = new Admin({
      name,
      email,
      salt,
      password: hashedPassword,
      role: role || "Super Admin", // Default role is 'Super Admin'
    });

    return await newAdmin.save();
  }

  // Generate token for admin login
  static async getAdminToken(payload) {
    const { login, password } = payload;

    // Check if login is an email or username
    const admin = await AdminService.getAdminByEmailOrUsername(login);

    if (!admin) throw new Error("Admin not found");

    const isValidPassword = AuthService.validatePassword(password, admin);
    if (!isValidPassword) throw new Error("Invalid credentials");
    const tokenExpiry = process.env.JWT_EXPIRES_IN_ADMIN || "2h";

    return AuthService.generateToken(admin, tokenExpiry);
  }
}

module.exports = AdminService;
