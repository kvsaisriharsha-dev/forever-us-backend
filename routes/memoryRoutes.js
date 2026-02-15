import express from "express";
import Memory from "../models/Memory.js";
import multer from "multer";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();
const storage=multer.memoryStorage();
const upload = multer({ storage });
/**
 * @route   POST /api/memories
 * @desc    Create a new memory
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, note, date } = req.body;

    // AI analysis
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You analyze memories. Return ONLY JSON with fields: caption and mood."
        },
        {
          role: "user",
          content: `Memory title: ${title}\nMemory note: ${note}`
        }
      ],
      temperature: 0.7
    });

    // parse AI response
    let aiCaption = "";
    let mood = "";

    try {
      const parsed = JSON.parse(aiResponse.choices[0].message.content);
      aiCaption = parsed.caption;
      mood = parsed.mood;
    } catch {
      aiCaption = "Beautiful memory 💜";
      mood = "nostalgic";
    }
    // Save memory
    const memory = new Memory({
      title,
      note,
      date,
      imageUrl: "",
      aiCaption,
      mood
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
