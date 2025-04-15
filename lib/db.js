// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("✅ MongoDB already connected");
    return mongoose.connections[0]; // Return the existing connection
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
    return mongoose.connections[0]; // Return the active connection
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
