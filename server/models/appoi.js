// server/modules/appoi.js
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.Mixed },
    staffName: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    center: { type: String, required: true, trim: true },
    dateISO: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    donor: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      note: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

AppointmentSchema.index(
  { center: 1, staffName: 1, dateISO: 1, time: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Appointment", AppointmentSchema, "appoi");
