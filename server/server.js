import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./sockets/socket.js";

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://chat-app-three-taupe-56.vercel.app",
  credentials: true
}));

// test route
app.get("/", (req, res) => {
  res.send("Server is live 🚀");
});

app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", messageRouter);

// ✅ correct port for Render
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
