import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { authClient } from "./auth-client";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

type PickOptions = {
  /** Crop aspect ratio for the built-in editor, e.g. [1, 1] or [16, 9]. */
  aspect?: [number, number];
};

/**
 * Open the photo library and return the selected asset, or null if the user
 * cancels or denies permission. The asset is kept locally — nothing is uploaded
 * until the surrounding form is saved (see `uploadImageAsset`).
 */
export async function pickImage(
  options: PickOptions = {},
): Promise<ImagePicker.ImagePickerAsset | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: options.aspect,
    quality: 0.7,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0];
}

/**
 * Send a JSON payload and, in the same request, an optional picked image to a
 * POST/PATCH/PUT route. The body is `multipart/form-data` with a `data` field
 * (JSON) and an optional `file` field. The API uploads the image as part of
 * that single request and returns the updated resource.
 *
 * We use `fetch` (not axios) so React Native sets the correct
 * `multipart/form-data` boundary itself; the auth cookie is forwarded the same
 * way the axios interceptor does on native.
 */
export async function requestWithOptionalImage<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "PUT",
  data: unknown,
  asset: ImagePicker.ImagePickerAsset | null,
): Promise<T> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (asset) {
    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName ?? `image-${Date.now()}.jpg`,
      type: asset.mimeType ?? "image/jpeg",
    } as unknown as Blob);
  }

  const headers: Record<string, string> = {};
  if (Platform.OS !== "web") {
    const cookie = authClient.getCookie();
    if (cookie) {
      headers.Cookie = cookie;
    }
  }

  const response = await fetch(`${baseURL}${path}`, {
    method,
    body: formData,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Request failed (${response.status}): ${detail}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}
