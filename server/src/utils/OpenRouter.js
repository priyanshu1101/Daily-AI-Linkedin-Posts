import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function callDeepSeekAPI(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Please provide 500 words, detailed responses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\")
      .trim();
  } catch (error) {
    console.error(
      "OpenRouter API error:",
      error?.response?.data || error.message
    );
    throw error;
  }
}
