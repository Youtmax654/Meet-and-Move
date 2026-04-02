import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { activities, activityParticipants, interests, users } from "../../db/schema";

export const getActivityById = async (id: string) => {
  const db = getDb();
  try {
    const result = await db
      .select({
        activity: activities,
        host: {
          id: users.id,
          username: users.username,
          bio: users.bio,
        },
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activities)
      .innerJoin(users, eq(activities.hostId, users.id))
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .where(eq(activities.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];
    const details = (row.activity.specificDetails as any) || {};

    // Récupérer la liste des participants acceptés
    const participantsList = await db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(activityParticipants)
      .innerJoin(users, eq(activityParticipants.userId, users.id))
      .where(
        and(
          eq(activityParticipants.activityId, id),
          eq(activityParticipants.status, "accepted")
        )
      );

    return {
      id: row.activity.id,
      title: row.activity.title,
      description: row.activity.description,
      price: details.price,
      difficulty: details.difficulty,
      duration_hours: details.duration_hours,
      latitude: row.activity.latitude,
      longitude: row.activity.longitude,
      max_participants: row.activity.maxParticipants,
      enrolledCount: participantsList.length,
      participants: participantsList,
      host: row.host,
      category: row.category,
      price_breakdown: details.price_breakdown || [],
      eventDate: row.activity.eventDate,
    };
  } catch (error) {
    console.error("Drizzle Query Error:", error);
    throw error;
  }
};

export const joinActivity = async (activityId: string, userId: string): Promise<{ success: boolean }> => {
  const db = getDb();

  const existing = await db
    .select()
    .from(activityParticipants)
    .where(
      and(
        eq(activityParticipants.activityId, activityId),
        eq(activityParticipants.userId, userId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("ALREADY_JOINED");
  }

  await db.insert(activityParticipants).values({
    activityId,
    userId,
    status: "accepted",
    joinedAt: new Date(),
  });

  return { success: true };
};

