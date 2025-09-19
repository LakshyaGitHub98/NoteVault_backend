const authServices = require("../services/auth/authServices");

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
    user = authServices.getUser(token);
  } catch (err) {
    console.log("❌ Token parsing error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }

  if (!user || !user.role) {
    console.log("⚠️ Invalid token or missing role:", user);
    return res.status(401).json({ error: "Unauthorized: Invalid token or missing role" });
  }

  req.user = user;
  // console.log("✅ Authenticated User:", user);
  console.log("🛡️ Auth middleware triggered for:", req.method, req.url);
  next();
}

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

    next(); // Role is allowed
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};