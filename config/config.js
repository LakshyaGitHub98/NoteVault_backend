const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URL;
console.log("MONGO URL IS", mongoURI);

const connectToMongo = () => {
  mongoose.connect(mongoURI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected to MongoDB successfully");
  }).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
};

module.exports = connectToMongo;