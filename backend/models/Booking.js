const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  bookingDate: { type: Date, default: Date.now },
  // Travel date for the trip
  travelDate: { type: Date, required: true },
  // Time slot for the booking
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  // Number of persons booking
  persons: { type: Number, required: true, min: 1 },
  // Calculated total price
  totalPrice: { type: Number, required: true },
  // Booking status with enum values
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  }
});

module.exports = mongoose.model("Booking", bookingSchema);

