import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String },
    
    aiCaption: { type: String },
    mood: { type: String, default: "neutral" },
    spotifyUrl: { type: String },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);
