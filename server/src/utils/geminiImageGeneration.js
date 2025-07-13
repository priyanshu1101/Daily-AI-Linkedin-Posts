import axios from "axios";

export default async function generateGeminiImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  };

  try {
    const { data } = await axios.post(
      url,
      {
        ...body,
        model: "gemini-2.0-flash-preview-image-generation",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const parts = data?.candidates?.[0]?.content?.parts || [];

    const imagePart = parts.find(part => part?.inlineData?.mimeType?.startsWith("image/"));

    if (imagePart) {
      const mimeType = imagePart.inlineData.mimeType;
      const base64 = imagePart.inlineData.data;
      return `data:${mimeType};base64,${base64}`;
    } else {
      console.log("No image found in Gemini response.");
      return null;
    }

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    return null;
  }
}
