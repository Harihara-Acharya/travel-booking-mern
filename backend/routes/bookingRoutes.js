const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");

// CREATE Booking
router.post("/", auth, async (req, res) => {
  const booking = new Booking({
    userId: req.user.id,
    packageId: req.body.packageId
  });

  await booking.save();
  res.json({ message: "Booking successful" });
});

// GET Logged-in User Bookings
router.get("/my", auth, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("packageId");

  res.json(bookings);
});

module.exports = router;

