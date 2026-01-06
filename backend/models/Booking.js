const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: "Active" },
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model("Booking", bookingSchema);

