import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String },

    aiCaption: { type: String },
    mood: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);
