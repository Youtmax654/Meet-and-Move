import { AwsClient } from "aws4fetch";

/**
 * S3-compatible object storage helper.
 *
 * In local development this targets MinIO (see db/compose.yaml). In production
 * the same env vars can point at Cloudflare R2 or AWS S3 — the SigV4 signing
 * done by `aws4fetch` works against any S3-compatible endpoint, and it runs on
 * the Workers runtime (Web Crypto + fetch) without the heavy AWS SDK.
 */

type S3Config = {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

function getConfig(): S3Config {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.S3_BUCKET;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "Missing S3 configuration: S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY and S3_BUCKET are required.",
    );
  }

  return {
    endpoint: endpoint.replace(/\/$/, ""),
    region: process.env.S3_REGION || "us-east-1",
    accessKeyId,
    secretAccessKey,
    bucket,
    publicUrl: (process.env.S3_PUBLIC_URL || `${endpoint}/${bucket}`).replace(
      /\/$/,
      "",
    ),
  };
}

/**
 * Upload an object to the bucket and return its public URL.
 *
 * @param key         Object key, e.g. "avatars/<uuid>.jpg"
 * @param body        Raw bytes of the object
 * @param contentType MIME type, e.g. "image/jpeg"
 */
export async function uploadObject(
  key: string,
  body: ArrayBuffer | Uint8Array,
  contentType: string,
): Promise<string> {
  const { endpoint, region, accessKeyId, secretAccessKey, bucket, publicUrl } =
    getConfig();

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    region,
    service: "s3",
  });

  // Path-style addressing (`<endpoint>/<bucket>/<key>`) — required by MinIO and
  // supported by R2/S3.
  const url = `${endpoint}/${bucket}/${encodeURIComponent(key).replace(
    /%2F/g,
    "/",
  )}`;

  const response = await client.fetch(url, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `S3 upload failed (${response.status} ${response.statusText}): ${detail}`,
    );
  }

  return `${publicUrl}/${key}`;
}

/**
 * Fetch an object from the bucket with a signed GET request. Returns the raw
 * `fetch` Response so the caller can stream the body and read headers
 * (Content-Type, Content-Length). A missing object yields a non-`ok` response
 * (404) rather than throwing.
 */
export async function getObject(key: string): Promise<Response> {
  const { endpoint, region, accessKeyId, secretAccessKey, bucket } =
    getConfig();

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    region,
    service: "s3",
  });

  // 1. On nettoie l'endpoint pour enlever le "https://" si présent
  const cleanEndpoint = endpoint.replace(/^https?:\/\//, "");

  // 2. On construit l'URL au format Virtual-Hosted (bucket.endpoint)
  const url = new URL(`https://${bucket}.${cleanEndpoint}/${key}`);

  // 3. AwsClient va intercepter la requête, calculer les signatures AWS v4 et l'envoyer
  return client.fetch(url.toString(), {
    method: "GET",
  });
}
