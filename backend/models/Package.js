const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 }
});

const availableDateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlots: [timeSlotSchema]
});

const packageSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  duration: String,
  images: {
    type: [String],
    default: []
  },
  description: String,
  // Availability configuration per date and time slot
  availableDates: [availableDateSchema],
  // Package ownership - required for partner packages
  partnerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Package", packageSchema);

