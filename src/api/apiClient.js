import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://quality-visually-stinkbug.ngrok-free.app", // Replace with your backend URL
  withCredentials: true, // Ensures cookies are included in cross-site requests
  headers: {
    "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
  },
});

export default apiClient;