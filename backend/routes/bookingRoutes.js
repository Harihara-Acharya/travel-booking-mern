const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Package = require("../models/Package");
const auth = require("../middleware/authMiddleware");

/**
 * Check availability for a specific date and time slot
 * Returns remaining capacity for the slot
 */
const checkSlotAvailability = async (packageId, travelDate, timeSlot, requestedPersons) => {
  // Find the package and specific date/time slot
  const pkg = await Package.findById(packageId);
  if (!pkg) return { available: false, error: "Package not found" };

  // Normalize dates for comparison (set to midnight)
  const requestedDate = new Date(travelDate);
  requestedDate.setHours(0, 0, 0, 0);

  // Find matching date in availableDates
  const availableDate = pkg.availableDates.find(ad => {
    const adDate = new Date(ad.date);
    adDate.setHours(0, 0, 0, 0);
    return adDate.getTime() === requestedDate.getTime();
  });

  if (!availableDate) {
    return { available: false, error: "No availability for this date" };
  }

  // Find matching time slot
  const slotConfig = availableDate.timeSlots.find(
    ts => ts.start === timeSlot.start && ts.end === timeSlot.end
  );

  if (!slotConfig) {
    return { available: false, error: "Time slot not available" };
  }

  // Calculate already booked persons for this slot (excluding cancelled bookings)
  const bookedPersons = await Booking.aggregate([
    {
      $match: {
        packageId: pkg._id,
        travelDate: {
          $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
          $lt: new Date(requestedDate.setHours(23, 59, 59, 999))
        },
        "timeSlot.start": timeSlot.start,
        "timeSlot.end": timeSlot.end,
        status: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: null,
        totalPersons: { $sum: "$persons" }
      }
    }
  ]);

  const alreadyBooked = bookedPersons.length > 0 ? bookedPersons[0].totalPersons : 0;
  const remainingCapacity = slotConfig.capacity - alreadyBooked;

  if (remainingCapacity < requestedPersons) {
    return {
      available: false,
      error: `Time slot is fully booked. Only ${remainingCapacity} spot${remainingCapacity !== 1 ? 's' : ''} remaining.`,
      remainingCapacity
    };
  }

  return { available: true, remainingCapacity };
};

// CREATE Booking
router.post("/", auth, async (req, res) => {
  try {
    const { packageId, travelDate, timeSlot, persons } = req.body;

    // Validate required fields
    if (!travelDate || !timeSlot || !persons) {
      return res.status(400).json({ message: "Please provide travel date, time slot, and number of persons" });
    }

    // Fetch package to get price
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Check slot availability and capacity
    const availabilityCheck = await checkSlotAvailability(
      packageId,
      travelDate,
      timeSlot,
      persons
    );

    if (!availabilityCheck.available) {
      return res.status(400).json({ message: availabilityCheck.error });
    }

    // Calculate total price
    const totalPrice = persons * pkg.price;

    const booking = new Booking({
      userId: req.user.id,
      packageId,
      travelDate,
      timeSlot,
      persons,
      totalPrice,
      status: "pending"
    });

    await booking.save();
    res.json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Logged-in User Bookings
router.get("/my", auth, async (req, res) => {
  try {
    // Use "pending" status for consistency with new schema
    const bookings = await Booking.find({ 
      userId: req.user.id, 
      status: { $in: ["pending", "confirmed"] }
    })
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

    // Set status to "cancelled" (lowercase to match enum)
    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

