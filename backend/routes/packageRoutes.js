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
  const newPackage = new Package(req.body);
  await newPackage.save();
  res.json({ message: "Package added" });
});

module.exports = router;

