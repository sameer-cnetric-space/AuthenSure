const AdminService = require("../services/admin");
const MetricService = require("../services/metrics");

class AdminController {
  /**
   * Register a new admin
   */
  static async register(req, res) {
    try {
      const { name, email, password, role, username } = req.body;

      const newAdmin = await AdminService.createAdmin({
        name,
        email,
        password,
        role,
        username,
      });

      const formattedRes = {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        username: newAdmin.username,
        role: newAdmin.role,
      };

      return res
        .status(201)
        .json({ message: "Admin created successfully", admin: formattedRes });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(409)
          .json({ message: "Email or Username already exists" });
      }
      return res
        .status(500)
        .json({ message: "Error registering admin", error: error.message });
    }
  }

  /**
   * Login an admin and generate a token
   */
  static async login(req, res) {
    try {
      const { login, password } = req.body;

      const token = await AdminService.getAdminToken({ login, password });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      if (
        error.message === "Admin not found" ||
        error.message === "Invalid credentials"
      ) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      return res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }

  /**
   * Get an admin by ID
   */
  static async getAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminService.getAdminById(id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json(admin);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching admin data", error: error.message });
    }
  }

  /**
   * Controller function to handle metric data for admin dashboard
   */
  static async getMetrics(req, res) {
    try {
      const metrics = await MetricService.getMetrics();

      return res.status(200).json({
        data: metrics,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return res.status(500).json({
        message: "Error fetching metrics",
        error: error.message,
      });
    }
  }
}

module.exports = AdminController;
