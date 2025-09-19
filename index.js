const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// 🛠️ Routes and Config
const userAuthRouter = require("./routes/authentication/userAuth"); // ✅ Fixed typo: 'authectication' → 'authentication'
const adminUserRouter = require("./routes/admin/userRoutes");
const fileRoutes = require("./routes/files/fileRoutes");
const connectToMongo = require("./config/config");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

// 🔗 Connect to MongoDB
connectToMongo();

// 🔧 Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthentication); // ✅ Auth middleware applied globally
// for trial
app.use(express.static('public')); // assuming your HTML is in /public

app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log("📨 Incoming POST:", req.url);
  }
  next();
});


// 🎨 EJS View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🚀 API Routes
app.use("/api/users", adminUserRouter);
app.use("/api/auth", userAuthRouter);
app.use("/api/file", fileRoutes);

// 🧪 Test View Routes
app.get("/test-upload", (req, res) => {
  console.log("🧪 Rendering testUpload view...");
  res.render("testUpload");
});

app.get("/testView", (req, res) => {
  console.log("🧪 Rendering testView...");
  res.render("testView");
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