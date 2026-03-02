// socket/sessionSocket.js
import { Server } from "socket.io";

/**
 * Initializes the Socket.io signaling server for video sessions
 * @param {import("http").Server} server - The HTTP server instance
 */
export const initSessionSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // When a user joins a session room
    socket.on("join-room", (roomId, userName) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", userName);
      console.log(`👥 ${userName} joined room ${roomId}`);
    });

    // When one peer sends an offer
    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", data.offer);
    });

    // When another peer sends an answer
    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", data.answer);
    });

    // Handle ICE candidates
    socket.on("candidate", (data) => {
      socket.to(data.roomId).emit("candidate", data.candidate);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  console.log("⚙️  Session Socket initialized");
};
