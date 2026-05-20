import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import {
  activities,
  activityParticipants,
  interests,
  user,
} from "../../db/schema";
import { feedActivitiesSchema } from "./feed.schema";

const feedService = {
  getAllActivities: async () => {
    const db = getDb();

    const result = await db
      .select({
        activity: activities,
        host: {
          id: user.id,
          username: user.name,
          bio: user.bio,
          isVerified: user.emailVerified,
        },
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activities)
      .innerJoin(user, eq(activities.hostId, user.id))
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .orderBy(activities.createdAt);

    if (result.length === 0) {
      return [];
    }

    const allParticipants = await db
      .select({
        activityId: activityParticipants.activityId,
        userId: user.id,
        username: user.name,
      })
      .from(activityParticipants)
      .innerJoin(user, eq(activityParticipants.userId, user.id))
      .where(eq(activityParticipants.status, "accepted"));

    const participantsByActivity: Record<
      string,
      { id: string; username: string }[]
    > = {};
    allParticipants.forEach((p) => {
      if (!participantsByActivity[p.activityId]) {
        participantsByActivity[p.activityId] = [];
      }
      participantsByActivity[p.activityId].push({
        id: p.userId,
        username: p.username,
      });
    });

    const activitiesList = result.map((row) => {
      const details = (row.activity.specificDetails as any) || {};
      const participants = participantsByActivity[row.activity.id] || [];
      const normalizedCategory =
        row.category?.id && row.category?.name ? row.category : null;

      return {
        id: row.activity.id,
        title: row.activity.title,
        description: row.activity.description,
        event_date: row.activity.eventDate,
        isHostVerified: row.host.isVerified,
        price: details.price,
        difficulty: details.difficulty,
        duration_hours: details.duration_hours,
        latitude: row.activity.latitude,
        longitude: row.activity.longitude,
        max_participants: row.activity.maxParticipants,
        enrolledCount: participants.length,
        participants: participants,
        host: row.host,
        category: normalizedCategory,
        image: details.image,
        price_breakdown: details.price_breakdown || [],
      };
    });
    return feedActivitiesSchema.parse(activitiesList);
  },
};

export default feedService;
