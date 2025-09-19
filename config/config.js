const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

console.log("🔗 MongoDB URI loaded:", `"${mongoURI.replace(/:[^@]+@/, ':<hidden>@')}"`);

const connectToMongo = () => {
  mongoose.connect(mongoURI.trim(), {
    dbName: 'notevault',
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
  });
};

module.exports = connectToMongo;