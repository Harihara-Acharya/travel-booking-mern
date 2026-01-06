const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");

// CREATE Booking
router.post("/", auth, async (req, res) => {
  try {
    // Check for duplicate booking
    const existing = await Booking.findOne({
      userId: req.user.id,
      packageId: req.body.packageId,
      status: "Active"
    });

    if (existing) {
      return res.status(400).json({ message: "You have already booked this package!" });
    }

    const booking = new Booking({
      userId: req.user.id,
      packageId: req.body.packageId,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    await booking.save();
    res.json({ message: "Booking successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Logged-in User Bookings
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id, status: "Active" })
      .populate("packageId")
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CANCEL Booking
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Instead of deleting, set status to Cancelled
    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

