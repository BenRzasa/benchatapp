import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://quality-visually-stinkbug.ngrok-free.app",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token if required
  },
});

export default apiClient;