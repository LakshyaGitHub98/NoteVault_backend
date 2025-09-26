const bcrypt = require("bcrypt");
const User = require("../../models/user");
const authServices = require("../../services/auth/authServices");
const { sendOtpEmail } = require("../../services/auth/mailer");

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

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = authServices.setUser(user);
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
        role: role || "NORMAL",
      });

      await newUser.save();
      return res.status(201).json({ message: "Registration successful" });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // ------------ OTP helpers ------------
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // POST /api/auth/send-otp
  async sendOtpController(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      // OPTIONAL: rate-limit check here (or use express-rate-limit in routes)

      const otp = this.generateOtp();

      // Store OTP in-memory with expiry (demo). Use Redis/DB for production.
      req.app.locals.otpStore = req.app.locals.otpStore || {};
      req.app.locals.otpStore[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      };

      await sendOtpEmail(email, otp);
      return res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (err) {
      console.error("Send OTP error:", err);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  }

  // POST /api/auth/verify-otp
  async verifyOtpController(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

      const store = (req.app.locals.otpStore || {})[email];
      if (!store) return res.status(400).json({ error: "No OTP requested for this email" });

      if (Date.now() > store.expiresAt) {
        delete req.app.locals.otpStore[email];
        return res.status(400).json({ error: "OTP expired" });
      }

      if (store.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // OTP valid — remove it
      delete req.app.locals.otpStore[email];

      // OPTIONAL: mark user as verified or continue with flow
      return res.status(200).json({ message: "OTP verified" });
    } catch (err) {
      console.error("Verify OTP error:", err);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }
  }
}

module.exports = new AuthController();