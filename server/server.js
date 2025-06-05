require("dotenv").config(); // Make sure this is at the top!
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const authRoutes = require('./routes/auth');
const trackerRoutes = require('./routes/tracker');
const diaryRoutes = require('./routes/diary');
const chatbotRoutes = require('./routes/chatbot');
const userRoutes = require('./routes/user');
const { verifyToken } = require('./middleware/auth');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/tracker', verifyToken, trackerRoutes);
app.use('/diary', verifyToken, diaryRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/user', verifyToken, userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//npm init -y
//npm install express mongoose cors dotenv bcryptjs jsonwebtoken
