import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate caption + mood
export async function analyzeMemory(note) {
  try {
    const prompt = `
    Analyze this memory note and return:
    1. A short emotional caption
    2. Mood (happy, sad, romantic, nostalgic, etc)

    Memory: "${note}"

    Respond ONLY in JSON:
    { "caption": "...", "mood": "..." }
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    return JSON.parse(text);
  } catch (err) {
    console.error("AI error:", err);
    return { caption: "", mood: "neutral" };
  }
}
