import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);
