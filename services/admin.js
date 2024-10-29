const AuthService = require("./auth");
const Admin = require("../models/admin"); // Assuming you have an Admin model defined with Mongoose

class AdminService {
  // Get admin by ID
  static getAdminById(id) {
    return Admin.findById(id);
  }

  // Get admin by email
  static getAdminByEmail(email) {
    return Admin.findOne({ email });
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
      role: role || "Moderator", // Default role is 'Moderator'
    });

    return await newAdmin.save();
  }

  // Generate token for admin login
  static async getAdminToken(payload) {
    const { email, password } = payload;
    const admin = await AdminService.getAdminByEmail(email);

    if (!admin) throw new Error("Admin not found");

    const isValidPassword = AuthService.validatePassword(password, admin);
    if (!isValidPassword) throw new Error("Invalid credentials");

    return AuthService.generateToken(admin);
  }
}

module.exports = AdminService;
