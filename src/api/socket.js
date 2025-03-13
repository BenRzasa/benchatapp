import { io } from "socket.io-client";

const SERVER_URL = "https://quality-visually-stinkbug.ngrok-free.app";

const socket = io(SERVER_URL, {
  withCredentials: true,
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default socket;