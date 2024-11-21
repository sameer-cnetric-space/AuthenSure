const UserService = require("../services/user"); // Import the UserService

const KycService = require("../services/kyc");

class UserController {
  /**
   * Register a new user
   * @param {Object} req - The request object containing user data
   * @param {Object} res - The response object to send the result
   */
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, gender, username, phone } =
        req.body;

      // Call the createUser function from UserService to create a new user
      const newUser = await UserService.createUser({
        firstName,
        lastName,
        email,
        password,
        gender,
        username,
        phone,
      });

      return res.status(201).json({
        message: "User created successfully",
        token: newUser.token,
        user: newUser.formattedRes,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate email or username error
        return res
          .status(409)
          .json({ message: "Email or Username already exists" });
      }
      return res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }

  /**
   * Login a user and generate a token
   * @param {Object} req - The request object containing login data (email/username, password)
   * @param {Object} res - The response object to send the result
   */
  static async login(req, res) {
    try {
      const { login, password } = req.body; // Accept `login` which can be either email or username

      // Call the getUserToken function from UserService to generate a token
      const token = await UserService.getUserToken({ login, password });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      if (
        error.message === "User not found" ||
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
   * Get the logged-in user's details
   * @param {Object} req - The request object containing the user token
   * @param {Object} res - The response object to send the result
   */
  static async getUserMe(req, res) {
    try {
      // Retrieve the user ID from the authenticated request object
      const userId = req.user._id;

      // Call the getUserById function from UserService to get user details
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const kycStats = await KycService.getUserKycStats(userId);

      // Format the response to exclude sensitive fields like password and salt
      const formattedUser = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        gender: user.gender,
        phone: user.phone,
        createdAt: user.createdAt,
        kycs: kycStats,
      };

      return res.status(200).json(formattedUser);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching user data", error: error.message });
    }
  }

  /**
   * Delete a user and all their associated KYC entries and assets
   * @param {Object} req - The request object containing the user ID
   * @param {Object} res - The response object to send the result
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params; // Extract user ID from request parameters

      // Call the deleteUser function from UserService
      const result = await UserService.deleteUser(id);

      return res.status(200).json(result); // Return success response
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
