import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? `http://${process.env.EXPO_PUBLIC_API_URL}`
  : "http://localhost:8787";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
