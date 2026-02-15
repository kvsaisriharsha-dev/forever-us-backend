import express from "express";
import Memory from "../models/Memory.js";
import multer from "multer";
import { analyzeMemory } from "../utils/aiHelper.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, note, date } = req.body;

    // 🧠 SAFE AI CALL
    let aiResult = { caption: "", mood: "neutral" };

    try {
      aiResult = await analyzeMemory(note);
    } catch (err) {
      console.log("AI failed — continuing without AI");
    }

    const memory = new Memory({
      title,
      note,
      date,
      imageUrl: "",
      caption: aiResult.caption,
      mood: aiResult.mood,
    });

    const savedMemory = await memory.save();
    res.status(201).json(savedMemory);
  } catch (error) {
    console.error("Memory save error:", error);
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
