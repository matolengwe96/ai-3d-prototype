import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assets = [
  {
    id: "hard-hat",
    name: "Yellow Hard Hat",
    category: "PPE",
    modelPath: "/models/hard-hat.glb",
    keywords: [
      "helmet",
      "hard hat",
      "construction helmet",
      "safety helmet",
      "head protection",
      "protective gear",
      "safety equipment",
      "construction safety",
      "ppe",
      "head safety"
    ]
  }
];

// 👇 NEW ROOT ROUTE
app.get("/", (req, res) => {
  res.send("AI 3D Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/match-asset", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: "Query is required."
      });
    }

    const prompt = `
You are an assistant that matches a user query to the best 3D training asset.

User query:
"${query}"

Available assets:
${JSON.stringify(assets, null, 2)}

Return valid JSON only in this format:
{
  "matchedAssetId": "hard-hat",
  "reason": "Explain briefly why this asset is the best match.",
  "educationalSummary": "Write a short 2-3 sentence educational explanation."
}

If nothing fits, return:
{
  "matchedAssetId": null,
  "reason": "Explain why no asset fits.",
  "educationalSummary": "No suitable training asset found."
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    const matchedAsset =
      assets.find((asset) => asset.id === parsed.matchedAssetId) || null;

    res.json({
      matchedAsset,
      reason: parsed.reason || "",
      educationalSummary: parsed.educationalSummary || ""
    });
  } catch (error) {
    console.error("AI error:", error);

    res.status(500).json({
      error: "AI matching failed."
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});