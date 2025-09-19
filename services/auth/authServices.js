// services/auth/authServices.js

const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const Secret_key = process.env.JWT_SECRET; // ✅ Make sure this is set in your .env file

class AuthServices {
  async authenticateUser(username, password) {
    const user = await User.findOne({ username });
    return user || null;
  }

  async registerUser(username, email, password, role = "NORMAL") {
    try {
      const newUser = new User({ username, email, password, role }); // ✅ Role included
      await newUser.save(); // 🔐 Password gets hashed via pre-save hook
      return true;
    } catch (error) {
      console.error("❌ Registration error:", error);
      return false;
    }
  }

  setUser(user) {
    return jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role // ✅ Role added to token
      },
      Secret_key,
      { expiresIn: "7d" } // ✅ Optional expiry for safety
    );
  }

  getUser(token) {
    if (!token) return null;
    try {
      return jwt.verify(token, Secret_key); // ✅ Decodes { _id, email, role }
    } catch (error) {
      console.log("❌ Token verification failed:", error.message);
      return null;
    }
  }
}

module.exports = new AuthServices();