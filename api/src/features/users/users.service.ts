import { and, eq, inArray, lt } from "drizzle-orm";

import { getDb } from "../../db";
import { activities, activityParticipants, chats, interests, users } from "../../db/schema";
import { getActivityImageUrl, getAvatarUrl } from "../../utils/image";
import { userProfileSchema } from "./users.schema";

function toCoverImage(details: any, categoryName?: string, activityId?: string) {
  return (
    details?.coverImage ||
    details?.photos?.[0] ||
    details?.image ||
    getActivityImageUrl(categoryName, activityId)
  );
}

const usersService = {
  getUserProfileById: async (userId: string) => {
    const db = getDb();

    const user = await db.query.users.findFirst({
      where: (u, { eq: equal }) => equal(u.id, userId),
    });
    if (!user) return null;

    const createdRows = await db
      .select({
        activity: activities,
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activities)
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .where(eq(activities.hostId, userId));

    const now = new Date();
    const pastJoinedRows = await db
      .select({
        activity: activities,
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activityParticipants)
      .innerJoin(activities, eq(activityParticipants.activityId, activities.id))
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .where(
        and(
          eq(activityParticipants.userId, userId),
          eq(activityParticipants.status, "accepted"),
          lt(activities.eventDate, now),
        ),
      );

    const allActivityIds = [
      ...createdRows.map((r) => r.activity.id),
      ...pastJoinedRows.map((r) => r.activity.id),
    ];

    const participantCounts = new Map<string, number>();
    if (allActivityIds.length > 0) {
      const participants = await db
        .select({ activityId: activityParticipants.activityId })
        .from(activityParticipants)
        .where(
          and(
            inArray(activityParticipants.activityId, allActivityIds),
            eq(activityParticipants.status, "accepted"),
          ),
        );
      for (const p of participants) {
        participantCounts.set(p.activityId, (participantCounts.get(p.activityId) ?? 0) + 1);
      }
    }

    const chatRows = allActivityIds.length
      ? await db
          .select({ id: chats.id, activityId: chats.activityId })
          .from(chats)
          .where(inArray(chats.activityId, allActivityIds))
      : [];
    const chatByActivityId = new Map<string, string>();
    for (const row of chatRows) {
      if (row.activityId) chatByActivityId.set(row.activityId, row.id);
    }

    const createdActivities = createdRows.map((row) => {
      const details = (row.activity.specificDetails as any) || {};
      const category = row.category?.id && row.category?.name ? row.category : null;
      return {
        id: row.activity.id,
        title: row.activity.title,
        description: row.activity.description,
        eventDate: row.activity.eventDate,
        coverImage: toCoverImage(details, row.category?.name || undefined, row.activity.id),
        locationCity: details.locationCity || "Localité",
        enrolledCount: participantCounts.get(row.activity.id) ?? 0,
        category,
        chatId: chatByActivityId.get(row.activity.id),
      };
    });

    const pastActivities = pastJoinedRows.map((row) => {
      const details = (row.activity.specificDetails as any) || {};
      const category = row.category?.id && row.category?.name ? row.category : null;
      return {
        id: row.activity.id,
        title: row.activity.title,
        description: row.activity.description,
        eventDate: row.activity.eventDate,
        coverImage: toCoverImage(details, row.category?.name || undefined, row.activity.id),
        locationCity: details.locationCity || "Localité",
        enrolledCount: participantCounts.get(row.activity.id) ?? 0,
        category,
        chatId: chatByActivityId.get(row.activity.id),
      };
    });

    const acceptedParticipations = await db
      .select({ activityId: activityParticipants.activityId })
      .from(activityParticipants)
      .where(and(eq(activityParticipants.userId, userId), eq(activityParticipants.status, "accepted")));

    const ratingValues = createdRows
      .map((row) => Number((row.activity.specificDetails as any)?.rating))
      .filter((value) => Number.isFinite(value) && value >= 0 && value <= 5);
    const averageRating =
      ratingValues.length > 0
        ? Number((ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length).toFixed(1))
        : null;

    const location = createdActivities.find((activity) => activity.locationCity)?.locationCity ?? null;
    const coverImage = createdActivities[0]?.coverImage ?? null;

    return userProfileSchema.parse({
      id: user.id,
      username: user.username,
      bio: user.bio,
      location,
      avatar: getAvatarUrl(user.id),
      coverImage,
      isVerified: user.isVerified,
      gamificationLevel: user.gamificationLevel,
      stats: {
        createdCount: createdActivities.length,
        participationsCount: acceptedParticipations.length,
        averageRating,
      },
      createdActivities,
      pastActivities,
    });
  },
};

export default usersService;

