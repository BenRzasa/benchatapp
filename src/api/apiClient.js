// apiClient.js
import axios from "axios";

const SERVER_URL = "https://quality-visually-stinkbug.ngrok-free.app";

const apiClient = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true, // Ensure cookies are included in requests
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default apiClient;