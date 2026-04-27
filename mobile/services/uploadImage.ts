import * as ImagePicker from "expo-image-picker";
import { api } from "../lib/api";

type PresignResponse = {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
};

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function normalizeContentType(mimeType?: string | null) {
  if (!mimeType) return null;
  if ((ALLOWED_CONTENT_TYPES as readonly string[]).includes(mimeType)) {
    return mimeType as (typeof ALLOWED_CONTENT_TYPES)[number];
  }
  return null;
}

export async function uploadActivityImage(
  activityId: string,
  opts?: { authToken?: string },
): Promise<{ objectKey: string; publicUrl: string } | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: false,
    quality: 0.9,
  });

  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (!asset?.uri) return null;

  const contentType = normalizeContentType(asset.mimeType);
  if (!contentType) {
    throw new Error("Unsupported image type. Please use JPEG, PNG or WEBP.");
  }

  const filename =
    asset.fileName ||
    `activity-${activityId}.${contentType === "image/jpeg" ? "jpg" : contentType.split("/")[1]}`;

  const presign = await api.post<PresignResponse>(
    "/uploads/presign",
    { filename, contentType, activityId },
    {
      headers: opts?.authToken ? { Authorization: `Bearer ${opts.authToken}` } : undefined,
    },
  );

  // Upload direct vers MinIO via l'URL pré-signée (pas de transit des bytes par l'API).
  const fileBlob = await (await fetch(asset.uri)).blob();
  const putRes = await fetch(presign.data.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: fileBlob,
  });

  if (!putRes.ok) {
    throw new Error(`Upload failed: ${putRes.status}`);
  }

  return { objectKey: presign.data.objectKey, publicUrl: presign.data.publicUrl };
}

