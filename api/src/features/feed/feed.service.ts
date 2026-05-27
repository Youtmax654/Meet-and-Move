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
          name: user.name,
          bio: user.bio,
          emailVerified: user.emailVerified,
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
        name: user.name,
      })
      .from(activityParticipants)
      .innerJoin(user, eq(activityParticipants.userId, user.id))
      .where(eq(activityParticipants.status, "accepted"));

    const participantsByActivity: Record<
      string,
      { id: string; name: string }[]
    > = {};
    allParticipants.forEach((p) => {
      if (!participantsByActivity[p.activityId]) {
        participantsByActivity[p.activityId] = [];
      }
      participantsByActivity[p.activityId].push({
        id: p.userId,
        name: p.name,
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
        eventDate: row.activity.eventDate,
        price: details.price,
        difficulty: details.difficulty,
        durationHours: details.durationHours,
        latitude: row.activity.latitude,
        longitude: row.activity.longitude,
        maxParticipants: row.activity.maxParticipants,
        enrolledCount: participants.length,
        participants: participants,
        host: row.host,
        category: normalizedCategory,
        image: details.image,
        priceBreakdown: details.priceBreakdown || [],
      };
    });
    return feedActivitiesSchema.parse(activitiesList);
  },
};

export default feedService;
