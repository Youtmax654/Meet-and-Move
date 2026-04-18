import { sql as drizzleSql, eq } from "drizzle-orm";
import { getDb } from "../../db";
import {
  activities,
  activityParticipants,
  interests,
  userInterests,
  users,
} from "../../db/schema";
import { feedActivitiesSchema, feedGuidesSchema } from "./feed.schema";

const feedService = {
  getAllActivities: async () => {
    const db = getDb();

    const result = await db
      .select({
        activity: activities,
        host: {
          id: users.id,
          username: users.username,
          bio: users.bio,
          isVerified: users.isVerified,
        },
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activities)
      .innerJoin(users, eq(activities.hostId, users.id))
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .orderBy(activities.createdAt);

    if (result.length === 0) {
      return [];
    }

    const allParticipants = await db
      .select({
        activityId: activityParticipants.activityId,
        userId: users.id,
        username: users.username,
      })
      .from(activityParticipants)
      .innerJoin(users, eq(activityParticipants.userId, users.id))
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

  getGuides: async () => {
    const db = getDb();

    const result = await db
      .select({
        id: users.id,
        username: users.username,
        bio: users.bio,
        isVerified: users.isVerified,
        interests: drizzleSql<string>`string_agg(${interests.name}, ', ')`,
      })
      .from(users)
      .leftJoin(userInterests, eq(users.id, userInterests.userId))
      .leftJoin(interests, eq(userInterests.interestId, interests.id))
      .where(eq(users.role, "pro_guide"))
      .groupBy(users.id, users.username, users.bio, users.isVerified);

    const guides = result.map((g) => ({
      id: g.id,
      name: g.username,
      details: g.interests ? `Expert en : ${g.interests}` : g.bio || "",
      image: `https://i.pravatar.cc/150?u=${g.id}`,
      isVerified: g.isVerified,
    }));
    return feedGuidesSchema.parse(guides);
  },
};

export default feedService;
