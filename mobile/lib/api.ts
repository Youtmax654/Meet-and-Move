import axios, { AxiosHeaders } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: This is a temporary solution for development. Replace with real authentication later.
api.interceptors.request.use(async (config) => {
  try {
    let debugUserId = null;

    if (Platform.OS === "web") {
      debugUserId = localStorage.getItem("debugUserId");
    } else {
      debugUserId = await SecureStore.getItemAsync("debugUserId");
    }

    if (debugUserId) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("X-Debug-User-Id", debugUserId);
      } else {
        const headers = config.headers as Record<string, string>;
        headers["X-Debug-User-Id"] = debugUserId;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du debugUserId", error);
  }
  return config;
});

// TODO: This is a temporary function for development. Replace with real authentication later.
export const getUserId = (): string | null => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("debugUserId");
    } else {
      return SecureStore.getItem("debugUserId");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du debugUserId", error);
    return null;
  }
};
