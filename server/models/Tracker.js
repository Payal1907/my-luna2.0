const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  symptoms: [String],
  notes: String,
  flowLevel: { type: String, enum: ['Light', 'Medium', 'Heavy'] }, // new
  painLevel: { type: Number, min: 0, max: 10 }, // new
  mood: String // new
});

module.exports = mongoose.model('Tracker', trackerSchema);
