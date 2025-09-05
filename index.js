const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userAuthRouter = require('./routes/authectication/userAuth');
const adminUserRouter = require('./routes/admin/userRoutes');
const fileRoutes = require("./routes/files/fileRoutes");
const connectToMongo = require('./config/config');
const user = require("./models/user");

connectToMongo(); // Connect to MongoDB

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/users', adminUserRouter);
app.use('/api/auth', userAuthRouter);
app.use('/api/file', fileRoutes);

// Test view route
app.get('/test-upload', (req, res) => {
    console.log("Rendering testUpload view...");
  res.render('testUpload');
});

app.get('/hello', (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => {
  console.log("Server started on port : " + port);
});