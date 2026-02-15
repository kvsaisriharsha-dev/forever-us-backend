import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String },

    caption: { type: String },
    mood: { type: String, default: "neutral" },
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);
