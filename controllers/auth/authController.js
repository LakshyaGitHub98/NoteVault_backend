// controllers/auth/AuthController.js

const bcrypt = require("bcrypt");
const User = require("../../models/user");
const authServices = require("../../services/auth/authServices");

class AuthController {
  async handleLoginController(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password); // ✅ Using model method
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = authServices.setUser(user); // ✅ Should exclude password internally
      return res.status(200).json({ token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async handleRegisterController(req, res) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ error: "Username or email already exists" });
      }

      const newUser = new User({
        username,
        email,
        password,
        role: role || "NORMAL", // ✅ Optional role override
      });

      await newUser.save(); // ✅ Triggers password hashing
      return res.status(201).json({ message: "Registration successful" });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new AuthController();