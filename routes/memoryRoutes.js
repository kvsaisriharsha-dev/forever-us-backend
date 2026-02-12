import express from "express";
import Memory from "../models/Memory.js";

const router = express.Router();

/**
 * @route   POST /api/memories
 * @desc    Create a new memory
 */
router.post("/", async (req, res) => {
  try {
    const memory = new Memory(req.body);
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
