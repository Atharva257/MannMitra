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
import { runGlobalSafetyAudit } from "./services/safetyService.js";

import helmet from "helmet";
import compression from "compression";

connectDB();

const app = express();

// PRODUCTION: Trust first proxy (Crucial for rate limiting behind Vercel/Nginx/etc)
app.set("trust proxy", 1);

app.use(helmet()); // Basic security headers
app.use(compression()); // Gzip compression
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Fallback to * for dev, but highly recommended to set this in prod
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Rate Limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] IP Blocked: ${req.ip} triggered ${options.message.message}`);
    res.status(options.statusCode).send(options.message);
  },
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});

// Stricter Rate Limiting for Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.warn(`[SECURITY] AUTH RATE LIMIT HIT: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
});

app.use("/api", apiLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

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

  // Start the background safety audit (3-day inactivity check)
  // PRODUCTION: Set to 12 or 24 hours (43200000 ms)
  // DEMO: Set to 1 minute (60000 ms)
  setInterval(() => {
    runGlobalSafetyAudit();
  }, 43200000); // Set to 12 hours
});