import express from "express";
import Memory from "../models/Memory.js";
import multer from "multer";
import OpenAI from "openai";

const router = express.Router();

// ✅ multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @route POST /api/memories
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, note, date } = req.body;

    // 🧠 AI caption + mood generation
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a romantic memory assistant. Generate a short emotional caption and detect mood (happy, romantic, nostalgic, sad, excited). Respond ONLY in JSON: {\"caption\":\"...\",\"mood\":\"...\"}",
        },
        {
          role: "user",
          content: `Title: ${title}\nNote: ${note}`,
        },
      ],
      temperature: 0.7,
    });

    let caption = "";
    let mood = "neutral";

    try {
      const parsed = JSON.parse(aiResponse.choices[0].message.content);
      caption = parsed.caption;
      mood = parsed.mood;
    } catch {
      console.log("AI parse failed — using fallback");
    }

    // ✅ save memory
    const memory = new Memory({
      title,
      note,
      date,
      imageUrl: "",
      caption,
      mood,
    });

    const savedMemory = await memory.save();
    res.status(201).json(savedMemory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   GET /api/memories
 * @desc    Get all memories
 */
router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @route   DELETE /api/memories/:id
 * @desc    Delete a memory
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Memory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json({ message: "Memory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
