const express = require("express");
const Donor = require("../models/Donor");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password, bloodType, age, city } = req.body;

    if (!name || !email || !password || !bloodType || !age || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (age < 18) {
      return res.status(400).json({ message: "You must be at least 18 years old to donate blood" });
    }

    const donor = new Donor({ name, email, password, bloodType, age, city });
    await donor.save();
    res.status(201).json({ message: "✅ Donor registered successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

module.exports = router;
