const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// 🛠️ Routes and Config
const userAuthRouter = require("./routes/authentication/userAuth");
const adminUserRouter = require("./routes/admin/userRoutes");
const fileRoutes = require("./routes/files/fileRoutes");
const connectToMongo = require("./config/config");
const { checkForAuthentication, requireVerified } = require("./middlewares/auth");

// 🔗 Connect to MongoDB
connectToMongo();

// 🔧 Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// 🎨 EJS View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🔓 Public Routes (no auth required)
app.use("/api/auth", userAuthRouter); 
// Includes: login, register, send-otp, verify-otp, forgot-password, reset-password

// 🔒 Private Routes (JWT + OTP verified required)
app.use("/api/users", checkForAuthentication, requireVerified, adminUserRouter);
app.use("/api/file", checkForAuthentication, requireVerified, fileRoutes);

// 🧪 Test Views (for dev only)
app.get("/test-upload", (req, res) => {
  res.render("testUpload");
});

app.get("/testView", (req, res) => {
  res.render("testView");
});

// smtp test route
app.get("/debug-smtp", async (req, res) => {
  const net = require("net");
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;

  const socket = net.createConnection({ host, port, timeout: 5000 });

  socket.on("connect", () => {
    socket.end();
    res.send("SMTP reachable ✔");
  });

  socket.on("timeout", () => {
    socket.destroy();
    res.send("SMTP timed out ❌");
  });

  socket.on("error", (err) => {
    res.send("SMTP error: " + err.message);
  });
});



// 🌐 Basic Route
app.get("/hello", (req, res) => {
  res.send("Hello World");
});

// 📡 Server Listener
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server started on port: ${port}`);
});