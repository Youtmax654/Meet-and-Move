import { eq } from "drizzle-orm";
import { db } from "../../db";
import { activities, interests, user } from "../../db/schema";
import { getActivityImageUrl } from "../../utils/image";
import { uploadImageToKey } from "../uploads/uploads.service";
import { getObject } from "../../utils/s3";
import type { UpdateUserBody } from "./users.schema";

const usersService = {
  getUserById: async (id: string) => {
    return db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  },

  getUserActivities: async (userId: string) => {
    const result = await db
      .select({
        activity: activities,
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activities)
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .where(eq(activities.hostId, userId))
      .orderBy(activities.createdAt);

    return result.map((row) => {
      const details = (row.activity.specificDetails as any) || {};
      const normalizedCategory =
        row.category?.id && row.category?.name ? row.category : null;

      return {
        id: row.activity.id,
        title: row.activity.title,
        coverImage:
          details.coverImage ||
          getActivityImageUrl(row.category?.name || undefined, row.activity.id),
        locationCity: details.locationCity || null,
        eventDate: row.activity.eventDate,
        category: normalizedCategory,
      };
    });
  },

  /**
   * Update the current user's profile and, if an avatar is provided in the same
   * request, upload it first. The avatar key is derived from the user id
   * (`profile/<userId>/image`), so its public URL is stable and each upload
   * overwrites the previous image.
   */
  updateUserProfile: async (
    userId: string,
    payload: UpdateUserBody,
    image?: { contentType: string; bytes: ArrayBuffer } | null,
  ) => {
    const imageUrl = image
      ? await uploadImageToKey(
          `profile/${userId}/image`,
          image.contentType,
          image.bytes,
        )
      : undefined;

    const [updatedUser] = await db
      .update(user)
      .set({
        name: payload.name,
        birthDate: payload.birthDate.toISOString(),
        gender: payload.gender,
        bio: payload.bio ?? null,
        ...(imageUrl ? { image: imageUrl } : {}),
      })
      .where(eq(user.id, userId))
      .returning();

    return updatedUser ?? null;
  },

  /**
   * Stream a user's avatar from S3/MinIO. Returns the raw S3 Response (caller
   * checks `.ok` for a 404). The key is derived from the user id.
   */
  getUserImage: async (userId: string) => {
    return getObject(`profile/${userId}/image`);
  },
};

export default usersService;
