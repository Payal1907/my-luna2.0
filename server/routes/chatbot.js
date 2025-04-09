const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatHistories = new Map();

const initialQuestions = [
  "Hi! I'm Devi 😊. Let's get to know you better. First, what's your age group? (e.g., under 18, 18-24, 25-30, etc.)",
  "How would you describe your current health or mood?",
];

router.post("/analyze", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ reply: "Missing message or user ID." });
  }

  if (!chatHistories.has(userId)) {
    chatHistories.set(userId, []);
  }

  const userHistory = chatHistories.get(userId);
  userHistory.push({ role: "user", parts: [{ text: message }] });

  let prompt = message;

  // Add guidance to Gemini for bullet points and brevity
  const systemPrompt = `
    You are Devi, a friendly AI assistant. 
    Please respond with short and helpful answers, ideally using bullet points when offering suggestions.
    Avoid long paragraphs. Be concise and supportive.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...userHistory
      ],
    });

    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();

    // Add bot's reply to history
    userHistory.push({ role: "model", parts: [{ text: reply }] });

    // Ask next question in flow if under 3 messages
    let nextPrompt = "";
    if (userHistory.length <= initialQuestions.length * 2) {
      const nextIndex = Math.floor(userHistory.length / 2);
      nextPrompt = `\n\n${initialQuestions[nextIndex] || ""}`;
    }

    res.status(200).json({
      reply: reply + nextPrompt
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ reply: "Something went wrong while talking to Luna." });
  }
});

module.exports = router;






  


  




