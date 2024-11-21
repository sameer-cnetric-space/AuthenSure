const AuthService = require("./auth");
const User = require("../models/user");
const KycService = require("./kyc");
const kyc = require("../models/kyc");

class UserService {
  // Get user by ID
  static getUserById(id) {
    return User.findById(id);
  }

  // Get user by email or username
  static getUserByEmailOrUsername(login) {
    // Check if login is an email (simple regex to check '@' character)
    if (login.includes("@")) {
      return User.findOne({ email: login });
    } else {
      return User.findOne({ username: login });
    }
  }

  // Create a new user
  static async createUser(payload) {
    const { firstName, lastName, email, password, gender, username, phone } =
      payload;
    const salt = AuthService.generateSalt();
    const hashedPassword = AuthService.generateHash(salt, password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      salt,
      password: hashedPassword,
      gender,
      username,
      phone,
    });

    const newUesr = await newUser.save();
    // Generate token for immediate login after registration
    const tokenExpiry = process.env.JWT_EXPIRES_IN_USER || "1h";
    const token = AuthService.generateToken(newUser, tokenExpiry);

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

    return { formattedRes, token };
  }

  // Generate token for user login (can use either email or username)
  static async getUserToken(payload) {
    const { login, password } = payload; // `login` can be email or username
    const user = await UserService.getUserByEmailOrUsername(login);

    if (!user) throw new Error("User not found");

    const isValidPassword = AuthService.validatePassword(password, user);
    if (!isValidPassword) throw new Error("Invalid credentials");
    const tokenExpiry = process.env.JWT_EXPIRES_IN_USER || "1h";

    return AuthService.generateToken(user, tokenExpiry);
  }

  //Delete User and all associated documents and assets
  static async deleteUser(id) {
    try {
      // Fetch the user by ID
      const user = await UserService.getUserById(id);
      if (!user) throw new Error("User not found");

      // Fetch all KYC entries associated with the user
      const kycs = await KycService.getUserKycEntries(user._id);

      if (kycs.kycs.length > 0) {
        // Delete each KYC entry and its associated assets
        for (const kyc of kycs.kycs) {
          console.log(kyc.id);
          await KycService.deleteKycEntry(kyc.id); // Use KycService to delete KYC and its assets
        }
      }

      // Delete the user from the database
      await User.findByIdAndDelete(id);

      return {
        message: "User and all associated KYC data deleted successfully",
      };
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  }
}

module.exports = UserService;
