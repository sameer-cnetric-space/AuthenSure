const AuthService = require("./auth");
const User = require("../models/user");

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

    return await newUser.save();
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
}

module.exports = UserService;
