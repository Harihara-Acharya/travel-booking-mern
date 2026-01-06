const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  duration: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Package", packageSchema);

