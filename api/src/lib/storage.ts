import { S3Client } from "@aws-sdk/client-s3";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
const MINIO_REGION = process.env.MINIO_REGION ?? "us-east-1";
export const BUCKET_NAME = process.env.MINIO_BUCKET;
const PUBLIC_BASE_URL = process.env.MINIO_PUBLIC_BASE_URL;

if (!MINIO_ENDPOINT) throw new Error("Missing env: MINIO_ENDPOINT");
if (!MINIO_ACCESS_KEY) throw new Error("Missing env: MINIO_ACCESS_KEY");
if (!MINIO_SECRET_KEY) throw new Error("Missing env: MINIO_SECRET_KEY");
if (!BUCKET_NAME) throw new Error("Missing env: MINIO_BUCKET");
if (!PUBLIC_BASE_URL) throw new Error("Missing env: MINIO_PUBLIC_BASE_URL");

// MinIO est compatible S3, mais nécessite le mode path-style (bucket dans le chemin).
export const s3 = new S3Client({
  region: MINIO_REGION,
  endpoint: MINIO_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
});

export function getPublicUrl(key: string): string {
  return `${PUBLIC_BASE_URL}/${BUCKET_NAME}/${key}`;
}

