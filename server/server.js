const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

if (!uri) {
  console.error("❌ Missing MONGODB_URI. Check server/.env and variable name.");
  process.exit(1);
}

app.get("/", (_req, res) => res.send("Blood Donation API running"));

app.use("/api/donors", require("./routes/donors"));
app.use("/api/appointments", require("./routes/Appoi"));

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(` API listening on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });