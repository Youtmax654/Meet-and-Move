import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { activities, interests } from "../../db/schema";
import { getActivityImageUrl } from "../../utils/image";

const usersService = {
  getUserById: async (id: string) => {
    return getDb().query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  },

  getUserActivities: async (userId: string) => {
    const db = getDb();

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
};

export default usersService;
