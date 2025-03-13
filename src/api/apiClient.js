
import axios from "axios";

const SERVER_URL = "https://quality-visually-stinkbug.ngrok-free.app";

const apiClient = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning page
  },
});

export default apiClient;