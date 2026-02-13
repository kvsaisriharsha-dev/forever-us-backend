import express from "express";
import Memory from "../models/Memory.js";
import multer from "multer";

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

    let imageUrl = "";

    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    const memory = new Memory({
      title,
      note,
      date,
      imageUrl,
    });

    const savedMemory = await memory.save();
    res.status(201).json(savedMemory);
  } catch (error) {
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

export default router;
