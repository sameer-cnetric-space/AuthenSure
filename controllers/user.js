const UserService = require("../services/user"); // Import the UserService

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

      const formattedRes = {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        gender: newUser.gender,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      };

      return res
        .status(201)
        .json({ message: "User created successfully", user: formattedRes });
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
   * Get a user by their ID
   * @param {Object} req - The request object containing the user ID
   * @param {Object} res - The response object to send the result
   */
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      // Call the getUserById function from UserService to get user details
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching user data", error: error.message });
    }
  }
}

module.exports = UserController;
