import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { initSessionSocket } from "./socket/sessionSocket.js";
import routes from "./routes/index.js";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Note: express-mongo-sanitize is incompatible with Express 5 (req.query is read-only)
// Security is maintained via rate limiting and input validation in controllers

// Rate Limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api", apiLimiter);

app.use("/api", routes);

// Custom Error Handler Middleware
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.send("MannMitra Backend is Running 🚀");
});

//Create HTTP Server
const server = http.createServer(app);

//Initialize Session Socket
initSessionSocket(server);

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => {
  console.log(`✅ Server with WebSocket running on port ${PORT}`);
});