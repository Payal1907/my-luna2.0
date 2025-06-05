// const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const router = express.Router();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const chatHistories = new Map();

// const initialQuestions = [
//   "Hi! I'm Devi 😊. Let's get to know you better. First, what's your age group? (e.g., under 18, 18-24, 25-30, etc.)",
//   "How would you describe your current health or mood?",
// ];

// router.post("/analyze", async (req, res) => {
//   const { message, userId } = req.body;


//   if (!message || !userId) {
//     return res.status(400).json({ reply: "Missing message or user ID." });
//   }

//   if (!chatHistories.has(userId)) {
//     chatHistories.set(userId, []);
//   }

//   const userHistory = chatHistories.get(userId);
//   userHistory.push({ role: "user", parts: [{ text: message }] });

//   let prompt = message;

//   // Add guidance to Gemini for bullet points and brevity
//   const systemPrompt = `
//     You are Devi, a friendly AI assistant. 
//     Please respond with short and helpful answers, ideally using bullet points when offering suggestions.
//     Avoid long paragraphs. Be concise and supportive.
//   `;

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   try {
//     const chat = model.startChat({
//       history: [
//         { role: "user", parts: [{ text: systemPrompt }] },
//         ...userHistory
//       ],
//     });

//     const result = await chat.sendMessage(prompt);
//     const reply = result.response.text();

//     // Add bot's reply to history
//     userHistory.push({ role: "model", parts: [{ text: reply }] });

//     // Ask next question in flow if under 3 messages
//     let nextPrompt = "";
//     if (userHistory.length <= initialQuestions.length * 2) {
//       const nextIndex = Math.floor(userHistory.length / 2);
//       nextPrompt = `\n\n${initialQuestions[nextIndex] || ""}`;
//     }

//     res.status(200).json({
//       reply: reply + nextPrompt
//     });
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     res.status(500).json({ reply: "Something went wrong while talking to Luna." });
//   }
// });

// module.exports = router;
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatHistories = new Map();

const initialQuestions = [
  "Hi! I'm Devi 😊. Let's get to know you better. First, what's your age group? (e.g., under 18, 18-24, 25-30, etc.)",
  "How would you describe your current health or mood?",
];

// List of keywords to identify period-related queries
const periodKeywords = [
  "period", "menstruation", "cramps", "cycle", "menstrual",
  "PMS", "pads", "tampons", "flow", "spotting", "ovulation", "period pain"
];

// Utility to check if message is period-related
function isPeriodRelated(message) {
  const msg = message.toLowerCase();
  return periodKeywords.some(keyword => msg.includes(keyword));
}

router.post("/analyze", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ reply: "Missing message or user ID." });
  }

  // If it's not period-related and not part of the onboarding questions, reject it
  if (
    !isPeriodRelated(message) &&
    !initialQuestions.some(q => message.toLowerCase().includes(q.toLowerCase()))
  ) {
    return res.status(200).json({
      reply: `⚠️ I'm designed to assist only with menstruation or period-related questions. Please ask something relevant.`
    });
  }

  // Initialize user history if not present
  if (!chatHistories.has(userId)) {
    chatHistories.set(userId, []);
  }

  const userHistory = chatHistories.get(userId);
  userHistory.push({ role: "user", parts: [{ text: message }] });

  const systemPrompt = `
    You are Devi, a friendly AI assistant for menstrual health.
    Only answer questions related to menstruation, periods, PMS, cycle tracking, cramps, or general period health.
    If the question is unrelated, politely say you cannot answer.
    Use short and helpful answers, preferably with bullet points.
    Be empathetic, concise, and avoid long paragraphs.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...userHistory
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // Save AI response in history
    userHistory.push({ role: "model", parts: [{ text: reply }] });

    // Ask next question in the onboarding flow
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
    res.status(500).json({ reply: "Something went wrong while talking to Devi." });
  }
});

module.exports = router;







  


  




