const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodType: { type: String, required: true },
  age: { type: Number, required: true, min: 18 },
  city: { type: String, required: true }
});

module.exports = mongoose.model("Donor", donorSchema);
