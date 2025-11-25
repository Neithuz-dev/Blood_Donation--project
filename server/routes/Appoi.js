const express = require('express');
const router = express.Router();
const Appointment = require('../models/appoi');

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { staffId, staffName, service, center, dateISO, time, donor } = req.body;

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      center,
      staffName,
      dateISO,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Appointment slot already booked' });
    }

    const appointment = new Appointment({
      staffId,
      staffName,
      service,
      center,
      dateISO,
      time,
      donor,
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments by center
router.get('/center/:center', async (req, res) => {
  try {
    const appointments = await Appointment.find({ center: req.params.center });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by center:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments by donor email
router.get('/donor/:email', async (req, res) => {
  try {
    const appointments = await Appointment.find({ 'donor.email': req.params.email });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by donor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
