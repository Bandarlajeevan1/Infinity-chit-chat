import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import cors from "cors";
import { connectToDB } from "./database/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CLIENT_BUILD_PATH = path.join(__dirname, "../frontend/dist");

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  if (fs.existsSync(CLIENT_BUILD_PATH)) {
    app.use(express.static(CLIENT_BUILD_PATH));

    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
    });
  } else {
    console.warn(
      `Production mode: frontend build not found at ${CLIENT_BUILD_PATH}. Static frontend serving is disabled.`
    );
  }
}

const startServer = async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup aborted because MongoDB connection failed.");
    process.exit(1);
  }
};

startServer();
