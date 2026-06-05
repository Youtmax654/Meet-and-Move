import { Platform } from "react-native";
import type { ImageSource } from "expo-image";
import { authClient } from "./auth-client";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

/**
 * Build an expo-image source for an image field returned by the API.
 *
 * - A relative path (e.g. `/activities/<id>/image`) is served by our own
 *   authenticated API route, so the session cookie is attached as a header
 *   (native). On web the browser sends it automatically for same-origin.
 * - An absolute URL (external fallback) is returned untouched.
 */
export function apiImageSource(
  image: string | undefined | null,
  fallback: string,
): ImageSource {
  if (!image) {
    return { uri: fallback };
  }

  if (!image.startsWith("/")) {
    return { uri: image };
  }

  const uri = `${baseURL}${image}`;

  if (Platform.OS === "web") {
    return { uri };
  }

  const cookie = authClient.getCookie();
  return cookie ? { uri, headers: { Cookie: cookie } } : { uri };
}
