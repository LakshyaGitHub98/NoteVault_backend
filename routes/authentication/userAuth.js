const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/AuthController");
const {
  checkForAuthentication,
  requireVerified,
} = require("../../middlewares/auth");

// ---------------- Auth routes ----------------
router.post("/login", authController.handleLoginController.bind(authController));
router.post("/register", authController.handleRegisterController.bind(authController));

// ---------------- OTP routes (public) ----------------
router.post("/send-otp", authController.sendOtpController.bind(authController));
router.post("/verify-otp", authController.verifyOtpController.bind(authController));

// ---------------- Reset password routes (public) ----------------
router.post("/forgot-password", authController.forgotPasswordController.bind(authController));
router.post("/reset-password", authController.resetPasswordController.bind(authController));

// ---------------- Example protected route ----------------
// ✅ Only accessible if user has valid JWT + isVerified = true
router.get(
  "/profile",
  checkForAuthentication,
  requireVerified,
  (req, res) => {
    return res.json({
      message: "Welcome to your profile",
      user: req.user,
    });
  }
);

module.exports = router;