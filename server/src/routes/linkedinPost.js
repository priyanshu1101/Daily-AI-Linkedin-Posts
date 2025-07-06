const express = require("express");
const router = express.Router();

const { callDeepSeek } = require("../utils/Deepseek");
const { createTextPost } = require("../utils/LinkedinAPI");


router.post("/data", async (req, res) => {
  const prompt = `
  Generate the text for a LinkedIn post about a **random technology-related topic**.
  
  **Instructions:**
  
  - Start with "# Day X of AI Post" (where X is a random integer from 1 to 30).
  
  - Pick a single, interesting tech topic (e.g. AI agents, quantum computing, cybersecurity trends, prompt engineering, green tech, tech leadership tips).
  
  - Write in a **human, conversational tone** as if the author is sharing something cool they learned or noticed.
  
  - Keep the post **short and punchy (approx. 150-250 words, max ~1200-1500 characters).**
  
  - Use **bullet points, short sentences, or lists** to improve readability.
  
  - Sprinkle in a few natural emojis (no more than 1-2 per paragraph).
  
  - Include a quick example, stat, or real-world application, but avoid overly technical detail.
  
  - End with a single **engaging question** for the audience.
  
  - Add **3-5 relevant hashtags at the end**, each with an emoji, e.g. #AI 🤖 #Innovation 🚀
  
  - Output only the final text of the LinkedIn post, with no extra explanations or notes.
  
  `.trim();
  
  try {
    const response = await callDeepSeek(prompt);

    const formattedPost = response
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\")
      .trim();

    const post = await createTextPost(formattedPost, process.env.LINKEDIN_ACCESS_TOKEN);

    res.status(200).json({ post: post });
  } catch (error) {
    console.error("[/data] Error generating LinkedIn post:", error);
    res.status(500).json({
      error: "An error occurred while generating the LinkedIn post. Please try again later.",
    });
  }
});

module.exports = router;
