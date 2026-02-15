import express from "express";
import Memory from "../models/Memory.js";
import multer from "multer";

const router = express.Router();

//  multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route   POST /api/memories
 * @desc    Create a new memory (AI safe version)
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, note, date } = req.body;

    //  Default values (VERY IMPORTANT)
    let aiCaption = "";
    let mood = "neutral";

    // ===============================
    // 🤖 AI BLOCK (SAFE — won't crash)
    // ===============================
    try {
      //  TODO: Your OpenAI call will go here later

      // Example placeholder logic:
      if (note) {
        aiCaption = `Memory about: ${note.substring(0, 30)}`;
        mood = "happy"; // temporary mock
      }

    } catch (aiError) {
      console.log("⚠️ AI failed, continuing without it:", aiError.message);
    }

    // ===============================
    //  SAVE MEMORY
    // ===============================
    const memory = new Memory({
      title,
      note,
      date,
      imageUrl: "", // we'll enhance later
      aiCaption,
      mood
    });

    const savedMemory = await memory.save();

    res.status(201).json(savedMemory);

  } catch (error) {
    console.error("❌ Memory creation failed:", error);
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
