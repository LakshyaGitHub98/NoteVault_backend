const authServices = require("../services/auth/authServices");

// 🔑 Middleware: Check JWT and attach user
function checkForAuthentication(req, res, next) {
  req.user = null;

  const authorizationHeaderValue =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) {
    // 🔕 Silent fallback for public routes
    return next();
  }

  const token = authorizationHeaderValue.split("Bearer ")[1];

  let user;
  try {
    user = authServices.getUser(token); // decode + verify JWT
  } catch (err) {
    console.log("❌ Token parsing error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }

  if (!user || !user.role) {
    console.log("⚠️ Invalid token or missing role:", user);
    return res.status(401).json({ error: "Unauthorized: Invalid token or missing role" });
  }

  req.user = user;
  console.log("🛡️ Auth middleware triggered for:", req.method, req.url);
  next();
}

// 🔒 Middleware: Restrict access to specific roles
function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      console.log("🚫 Access denied: No user or role");
      return res.status(403).json({ error: "Access denied: No user or role" });
    }

    console.log("🔍 User Role:", req.user.role);
    console.log("🔐 Allowed Roles:", roles.join(", "));

    if (!roles.includes(req.user.role)) {
      console.log("⛔ Unauthorized role:", req.user.role);
      return res.status(403).json({ error: "Unauthorized: Insufficient role" });
    }

    next(); // ✅ Role is allowed
  };
}

// ✅ Middleware: Ensure user has verified OTP
function requireVerified(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user" });
  }
  console.log("🔍 isVerified:", req.method,req.url);
  if (!req.user.isVerified) {
    return res.status(403).json({ error: "Forbidden: OTP verification required" });
  }

  next();
}

module.exports = {
  checkForAuthentication,
  restrictTo,
  requireVerified,
};