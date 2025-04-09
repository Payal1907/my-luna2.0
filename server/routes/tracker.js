const express = require('express');
const Tracker = require('../models/Tracker');
const router = express.Router();

// Create tracker entry
router.post('/', async (req, res) => {
  const { periodStart, periodEnd, notes, symptoms, flowLevel, painLevel, mood } = req.body;
  try {
    const newEntry = new Tracker({
      userId: req.user.id,
      periodStart,
      periodEnd,
      notes,
      symptoms,
      flowLevel,
      painLevel,
      mood
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all tracker entries for a user
router.get('/', async (req, res) => {
  try {
    const entries = await Tracker.find({ userId: req.user.id }).sort({ periodStart: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

