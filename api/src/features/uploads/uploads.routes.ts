import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { getDb } from "../../db";
import { activities } from "../../db/schema";
import { BUCKET_NAME, getPublicUrl, s3 } from "../../lib/storage";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const presignBodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  activityId: z.uuid(),
});

function contentTypeToExt(contentType: (typeof ALLOWED_CONTENT_TYPES)[number]) {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
  }
}

type UploadsEnv = {
  Variables: {
    userId: string;
  };
};

const uploadsRoute = new Hono<UploadsEnv>();

uploadsRoute.post("/presign", async (c) => {
  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  const parsed = presignBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid body", details: parsed.error.issues }, 400);
  }

  const { contentType, activityId } = parsed.data;
  const db = getDb();

  // Sécurité: on ne génère une URL signée que si l'activité appartient au host authentifié.
  const owned = await db
    .select({ id: activities.id })
    .from(activities)
    .where(and(eq(activities.id, activityId), eq(activities.hostId, userId)))
    .limit(1);

  if (owned.length === 0) {
    return c.json({ error: "Forbidden" }, 403);
  }

  // Nommage stable côté backend (jamais basé sur le filename utilisateur).
  const ext = contentTypeToExt(contentType);
  const objectKey = `activities/${activityId}/${crypto.randomUUID()}.${ext}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 });
  const publicUrl = getPublicUrl(objectKey);

  return c.json({ uploadUrl, objectKey, publicUrl });
});

export default uploadsRoute;

