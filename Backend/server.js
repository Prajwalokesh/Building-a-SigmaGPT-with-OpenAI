import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("Loaded API Key:", process.env.GOOGLE_API_KEY);


const app = express();
const PORT = 8080;

app.use(express.json());

const client = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

app.post("/test", async (req, res) => {
  try {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: req.body.message }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    // Extract text
    const text =
      result.response.candidates[0].content.parts
        .map((part) => part.text)
        .join("") || "No response generated.";

    res.send(text);
  } catch (err) {
  console.error("❌ Gemini API Error:", err);
  res.status(500).send(err.message || "Error generating response.");
}
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
