import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function callOpenAI(prompt) {
  try {
    const response = await axios.post(
      "https://api.chatanywhere.tech/v1/chat/completions",
      {
        model: "gpt-4", // or "gpt-3.5-turbo" etc.
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("OpenAI API error:", error?.response?.data || error.message);
    throw error;
  }
}
