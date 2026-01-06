const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const auth = require("../middleware/authMiddleware");
const partnerMiddleware = require("../middleware/partnerMiddleware");

// GET All Packages (Public - for browsing)
router.get("/", async (req, res) => {
  const packages = await Package.find().populate("partnerId", "name email");
  res.json(packages);
});

// GET Single Package (Public)
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate("partnerId", "name email");
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD Package (Partner only)
router.post("/", auth, partnerMiddleware, async (req, res) => {
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
      partnerId: req.user.id  // Set partner ownership
    });
    
    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

