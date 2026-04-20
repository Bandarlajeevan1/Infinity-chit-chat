import mongoose from "mongoose";

export const connectToDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI environment variable. Check backend/.env and dotenv configuration.");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDb is connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connect error:", error);
    throw error;
  }
};
