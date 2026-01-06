const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");
const partnerMiddleware = require("../middleware/partnerMiddleware");

// All routes require authentication and partner role
router.use(auth, partnerMiddleware);

// GET Partner's Own Packages
router.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find({ partnerId: req.user.id }).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Single Package (Partner's own)
router.get("/packages/:id", async (req, res) => {
  try {
    const pkg = await Package.findOne({ 
      _id: req.params.id, 
      partnerId: req.user.id 
    });
    
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or not owned by you" });
    }
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE New Package
router.post("/packages", async (req, res) => {
  try {
    const { title, location, price, duration, description, images, availableDates } = req.body;
    
    const newPackage = new Package({
      title,
      location,
      price,
      duration,
      images: images || [],
      description,
      availableDates: availableDates || [],
      partnerId: req.user.id
    });
    
    await newPackage.save();
    res.status(201).json({ message: "Package created successfully", package: newPackage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Package (Partner's own only)
router.put("/packages/:id", async (req, res) => {
  try {
    const { title, location, price, duration, description, images, availableDates } = req.body;
    
    // Find package and ensure partner owns it
    const pkg = await Package.findOne({ 
      _id: req.params.id, 
      partnerId: req.user.id 
    });
    
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or not owned by you" });
    }
    
    // Update fields
    pkg.title = title || pkg.title;
    pkg.location = location || pkg.location;
    pkg.price = price !== undefined ? price : pkg.price;
    pkg.duration = duration || pkg.duration;
    pkg.description = description || pkg.description;
    pkg.images = images || pkg.images;
    pkg.availableDates = availableDates || pkg.availableDates;
    
    await pkg.save();
    res.json({ message: "Package updated successfully", package: pkg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Package (Partner's own only)
router.delete("/packages/:id", async (req, res) => {
  try {
    const pkg = await Package.findOneAndDelete({ 
      _id: req.params.id, 
      partnerId: req.user.id 
    });
    
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or not owned by you" });
    }
    
    // Also delete all bookings for this package
    await Booking.deleteMany({ packageId: req.params.id });
    
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Partner's Bookings (Bookings for their packages)
router.get("/bookings", async (req, res) => {
  try {
    // Find all packages owned by this partner
    const partnerPackages = await Package.find({ partnerId: req.user.id }).select("_id");
    const packageIds = partnerPackages.map(p => p._id);
    
    // Find bookings for these packages
    const bookings = await Booking.find({ packageId: { $in: packageIds } })
      .populate("userId", "name email phone")
      .populate("packageId", "title location price")
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Partner Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const partnerPackages = await Package.find({ partnerId: req.user.id }).select("_id");
    const packageIds = partnerPackages.map(p => p._id);
    
    const totalPackages = packageIds.length;
    
    const bookings = await Booking.find({ 
      packageId: { $in: packageIds },
      status: { $ne: "cancelled" }
    });
    
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Count by status
    const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    
    res.json({
      totalPackages,
      totalBookings,
      totalRevenue,
      confirmedBookings,
      pendingBookings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

