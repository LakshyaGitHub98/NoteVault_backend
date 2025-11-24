// services/auth/authServices.js

const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

class AuthServices {
  async authenticateUser(username, password) {
    const user = await User.findOne({ username });
    return user || null;
  }

  async registerUser(username, email, password, role = "NORMAL") {
    try {
      const newUser = new User({ username, email, password, role });
      await newUser.save();
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  // CREATE JWT TOKEN
  setUser(user) {
    // 🧠 IMPORTANT: include isVerified inside JWT!
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,   // 🔥 FIXED HERE
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
  }

  // VERIFY JWT TOKEN
  getUser(token) {
    if (!token) return null;
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.error("Token verify error:", error.message);
      return null;
    }
  }
}

module.exports = new AuthServices();