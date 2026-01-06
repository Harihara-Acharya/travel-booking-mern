const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  phone: String,
  city: String,
  gender: String,

  profilePic: {
    type: String,
    default: "https://i.imgur.com/placeholder.png"
  },

  role: { 
    type: String, 
    enum: ["user", "partner", "admin"],
    default: "user" 
  }
});

module.exports = mongoose.model("User", userSchema);

