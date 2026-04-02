import { getDb } from "../../db";
import { activities, users, interests, activityParticipants } from "../../db/schema";
import { eq, sql as drizzleSql, and } from "drizzle-orm";
import { getAvatarUrl, getActivityImageUrl } from "../../utils/image";

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
    const participantsListFiltered = await db
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

    // Formater les participants avec leurs avatars pravatar
    const participantsWithAvatars = participantsListFiltered.map(p => ({
      ...p,
      avatar: getAvatarUrl(p.id)
    }));

    return {
      id: row.activity.id,
      title: row.activity.title,
      description: row.activity.description,
      image: details.image || getActivityImageUrl(row.category?.name || undefined, row.activity.id),
      price: details.price,
      difficulty: details.difficulty,
      duration_hours: details.duration_hours,
      latitude: row.activity.latitude,
      longitude: row.activity.longitude,
      max_participants: row.activity.maxParticipants,
      enrolledCount: participantsWithAvatars.length,
      participants: participantsWithAvatars,
      host: {
        ...row.host,
        avatar: getAvatarUrl(row.host.id)
      },
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

