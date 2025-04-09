const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  entry: { type: String, required: true },
  mood: { type: String, enum: ['Happy', 'Sad', 'Angry', 'Anxious', 'Neutral'], required: true },
  food: String,
  stressLevel: { type: Number, min: 0, max: 10 },
  sleepHours: Number,
  screenTime: Number,
  harmonyScore: Number
});

module.exports = mongoose.model('Diary', diarySchema);



