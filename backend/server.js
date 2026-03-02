import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";   
import connectDB from "./config/db.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import { initSessionSocket } from "./socket/sessionSocket.js";
import moodRoutes from "./routes/moodRoutes.js";
import quotesRoutes from "./routes/quoteRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/sessions", sessionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("MannMitra Backend is Running 🚀");
});

// Import routes
import routes from "./routes/index.js";
app.use("/api", routes);

//Create HTTP Server
const server = http.createServer(app);

//Initialize Session Socket
initSessionSocket(server);

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => {
  console.log(`✅ Server with WebSocket running on port ${PORT}`);
});