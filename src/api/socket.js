// src/api/socket.js
import { io } from "socket.io-client";

const SERVER_URL = "https://quality-visually-stinkbug.ngrok-free.app";

const socket = io(SERVER_URL, {
  withCredentials: true,
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Log connection status
socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);
});

export default socket;