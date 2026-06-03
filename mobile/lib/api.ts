import axios, { AxiosHeaders } from "axios";
import { authClient } from "./auth-client";
import { Platform } from "react-native";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  try {
    if (Platform.OS !== "web") {
      const cookies = authClient.getCookie();

      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      if (config.headers instanceof AxiosHeaders && cookies) {
        config.headers.set("Cookie", cookies);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du cookie", error);
  }
  return config;
});
