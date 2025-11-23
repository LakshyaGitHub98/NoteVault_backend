const crypto = require("crypto");
const User = require("../../models/user");
const authServices = require("../../services/auth/authServices");
const { sendOtpEmail } = require("../../services/auth/mailer");

class AuthController {
  // ---------------- LOGIN ----------------
  async handleLoginController(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // (Optional) Agar sirf verified users ko login allow karna ho:
      // if (!user.isVerified) {
      //   return res.status(403).json({ error: "Please verify your email first" });
      // }

      const token = authServices.setUser(user);
      return res.status(200).json({
        token,
        isVerified: user.isVerified,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // ---------------- REGISTER ----------------
  async handleRegisterController(req, res) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Username or email already exists" });
      }

      const newUser = new User({
        username,
        email,
        password,
        role: role || "NORMAL",
        // isVerified: false, // <-- agar schema me default nahi hai to ye add kar sakta hai
      });

      await newUser.save();
      return res.status(201).json({ message: "Registration successful" });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // ---------------- OTP HELPERS ----------------
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // POST /api/auth/send-otp
  async sendOtpController(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const otp = this.generateOtp();

      // Store OTP in-memory with expiry (demo). Use Redis/DB for production.
      req.app.locals.otpStore = req.app.locals.otpStore || {};
      req.app.locals.otpStore[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      const success = await sendOtpEmail(email, otp);
      if (!success) {
        // Agar mailer false return kare to proper error do
        return res
          .status(500)
          .json({ error: "Failed to send OTP email. Please try again." });
      }

      return res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (err) {
      console.error("Send OTP error:", err);
      return res
        .status(500)
        .json({ error: "Failed to send OTP. Please try again." });
    }
  }

  // POST /api/auth/verify-otp
  async verifyOtpController(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP required" });
      }

      const store = (req.app.locals.otpStore || {})[email];
      if (!store) {
        return res
          .status(400)
          .json({ error: "No OTP requested for this email" });
      }

      if (Date.now() > store.expiresAt) {
        delete req.app.locals.otpStore[email];
        return res.status(400).json({ error: "OTP expired" });
      }

      if (store.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // OTP valid — remove it
      delete req.app.locals.otpStore[email];

      // ✅ Mark user as verified
      const user = await User.findOne({ email });
      if (user) {
        user.isVerified = true;
        await user.save();
      }

      return res
        .status(200)
        .json({ message: "OTP verified, user marked as verified" });
    } catch (err) {
      console.error("Verify OTP error:", err);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }
  }

  // ---------------- RESET PASSWORD ----------------

  // POST /api/auth/forgot-password
  async forgotPasswordController(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal account existence
        return res
          .status(200)
          .json({ message: "If account exists, reset link sent" });
      }

      const rawToken = crypto.randomBytes(32).toString("hex");
      const hash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordToken = hash;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // TODO: yahan reset link email se bhejna hai (rawToken use karke)
      // Example: https://frontend/reset-password?token=${rawToken}

      return res.status(200).json({
        message: "Reset instructions sent (dev mode)",
        resetToken: rawToken, // ⚠️ only for testing; remove in production
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      return res
        .status(500)
        .json({ error: "Failed to process forgot password" });
    }
  }

  // POST /api/auth/reset-password
  async resetPasswordController(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res
          .status(400)
          .json({ error: "Token and new password required" });
      }

      const hash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hash,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      // ❗ Important:
      // Agar tumhare User model me `pre('save')` hook already password hash karta hai,
      // to yahan sirf plain password set karo:
      user.password = newPassword;

      // Agar koi pre-save hook NAHI hai, tab upar wali line ki jagah bcrypt se hash karna padega.
      // (Abhi maine assume kiya hai comparePassword ke saath tum pre-save use kar rahe ho.)

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ error: "Failed to reset password" });
    }
  }
}

module.exports = new AuthController();