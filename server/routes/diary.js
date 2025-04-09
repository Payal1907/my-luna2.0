const express = require('express');
const Diary = require('../models/Diary');
const router = express.Router();

// Create a diary entry
router.post('/', async (req, res) => {
  const {
    date,
    entry,
    mood,
    food,
    stressLevel,
    sleepHours,
    screenTime,
    harmonyScore
  } = req.body;

  try {
    const newEntry = new Diary({
      userId: req.user.id, // make sure authentication middleware adds req.user
      date,
      entry,
      mood,
      food,
      stressLevel,
      sleepHours,
      screenTime,
      harmonyScore
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all diary entries for a user
router.get('/', async (req, res) => {
  try {
    const entries = await Diary.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
