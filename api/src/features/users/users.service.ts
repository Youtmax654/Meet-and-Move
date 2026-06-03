import { eq } from "drizzle-orm";
import { db } from "../../db";
import { activities, interests, user } from "../../db/schema";
import { getActivityImageUrl } from "../../utils/image";
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

  updateUserProfile: async (userId: string, payload: UpdateUserBody) => {
    const [updatedUser] = await db
      .update(user)
      .set({
        name: payload.name,
        birthDate: payload.birthDate.toISOString(),
        gender: payload.gender,
        image: payload.image ?? null,
        bio: payload.bio ?? null,
      })
      .where(eq(user.id, userId))
      .returning();

    return updatedUser ?? null;
  },
};

export default usersService;
