import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate caption + mood
export async function analyzeMemory(note) {
  try {
    const prompt = `
    You are an emotional memory assistant.
    
    Analyze this memory and return:

    1. A SHORT romantic or emotional caption (max 12 words)
    2. Mood from one of these:
       happy, sad, romantic, nostalgic, excited, neutral

    Memory:
    "${note}"

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
    console.error("AI error:", err.message);
    return { caption: "", mood: "neutral" };
  }
}
