const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const auth = require("../middleware/authMiddleware");

// GET All Packages
router.get("/", async (req, res) => {
  const packages = await Package.find();
  res.json(packages);
});

// ADD Package (Admin only – simple version)
router.post("/", auth, async (req, res) => {
  try {
    const { title, location, price, duration, description, images } = req.body;
    
    const newPackage = new Package({
      title,
      location,
      price,
      duration,
      images: images || [],
      description
    });
    
    await newPackage.save();
    res.json({ message: "Package added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

