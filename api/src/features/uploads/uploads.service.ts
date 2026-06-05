import { uploadObject } from "../../utils/s3";

const ALLOWED_IMAGE_TYPES: Record<string, true> = {
  "image/jpeg": true,
  "image/jpg": true,
  "image/png": true,
  "image/webp": true,
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Error carrying an HTTP status + stable key for the controller to map. */
export class UploadError extends Error {
  constructor(
    public readonly key: string,
    public readonly status: 400 | 413 | 415,
    message: string,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

/**
 * Validate an image's type and size, throwing an `UploadError` otherwise. Call
 * this early (before mutating anything) when the actual upload must happen later
 * — e.g. once an entity has been created and its id is known.
 */
export function assertValidImage(contentType: string, byteLength: number): void {
  if (!ALLOWED_IMAGE_TYPES[contentType.toLowerCase()]) {
    throw new UploadError(
      "UNSUPPORTED_TYPE",
      415,
      "Unsupported image type. Allowed: JPEG, PNG, WebP.",
    );
  }

  if (byteLength === 0) {
    throw new UploadError("EMPTY_FILE", 400, "Uploaded file is empty.");
  }

  if (byteLength > MAX_IMAGE_BYTES) {
    throw new UploadError("FILE_TOO_LARGE", 413, "Image exceeds the 5 MB limit.");
  }
}

/**
 * Validate an image and store it at a deterministic `key` (e.g.
 * `profile/<userId>/image`). Re-uploading to the same key overwrites the
 * previous image. Returns the public URL.
 */
export async function uploadImageToKey(
  key: string,
  contentType: string,
  bytes: ArrayBuffer,
): Promise<string> {
  assertValidImage(contentType, bytes.byteLength);
  return uploadObject(key, bytes, contentType);
}
