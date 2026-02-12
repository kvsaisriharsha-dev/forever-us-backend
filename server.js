import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import memoryRoutes from "./routes/memoryRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/memories", memoryRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Forever Us Backend Running 💜" });
});

// Port configuration
const PORT = process.env.PORT || 10000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });
