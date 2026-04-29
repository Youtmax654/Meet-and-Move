import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import {
  activities,
  activityParticipants,
  chatMembers,
  chats,
  interests,
  users,
} from "../../db/schema";
import { getActivityImageUrl, getAvatarUrl } from "../../utils/image";
import { activitySchema, joinedActivitiesSchema } from "./activities.schema";

const activitiesService = {
  getActivityById: async (id: string) => {
    const db = getDb();

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

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    const details = (row.activity.specificDetails as any) || {};
    const normalizedCategory =
      row.category?.id && row.category?.name ? row.category : null;

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
          eq(activityParticipants.status, "accepted"),
        ),
      );

    // Formater les participants avec leurs avatars pravatar
    const participantsWithAvatars = participantsListFiltered.map((p) => ({
      ...p,
      avatar: getAvatarUrl(p.id),
    }));

    // Récupérer l'ID du chat lié à l'activité
    const chatResult = await db
      .select({ id: chats.id })
      .from(chats)
      .where(eq(chats.activityId, id))
      .limit(1);

    const chatId = chatResult.length > 0 ? chatResult[0].id : undefined;

    return activitySchema.parse({
      id: row.activity.id,
      title: row.activity.title,
      description: row.activity.description,
      image:
        details.image ||
        getActivityImageUrl(row.category?.name || undefined, row.activity.id),
      price: details.price,
      difficulty: details.difficulty,
      duration_hours: details.duration_hours,
      latitude: row.activity.latitude,
      longitude: row.activity.longitude,
      max_participants: row.activity.maxParticipants,
      enrolledCount: participantsWithAvatars.length,
      participants: participantsWithAvatars,
      chatId,
      host: {
        ...row.host,
        avatar: getAvatarUrl(row.host.id),
      },
      category: normalizedCategory,
      price_breakdown: details.price_breakdown || [],
      eventDate: row.activity.eventDate,
    });
  },

  joinActivity: async (
    activityId: string,
    userId: string,
  ): Promise<{ success: boolean }> => {
    const db = getDb();

    const existing = await db
      .select()
      .from(activityParticipants)
      .where(
        and(
          eq(activityParticipants.activityId, activityId),
          eq(activityParticipants.userId, userId),
        ),
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

    const chatResult = await db
      .select({ id: chats.id })
      .from(chats)
      .where(eq(chats.activityId, activityId))
      .limit(1);

    if (chatResult.length > 0) {
      const chatId = chatResult[0].id;
      const existingMember = await db
        .select()
        .from(chatMembers)
        .where(
          and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, userId)),
        )
        .limit(1);

      if (existingMember.length === 0) {
        await db.insert(chatMembers).values({
          chatId,
          userId,
          joinedAt: new Date(),
        });
      }
    }

    return { success: true };
  },

  getUserJoinedActivities: async (userId: string) => {
    const db = getDb();

    const result = await db
      .select({
        activity: activities,
        host: {
          id: users.id,
          username: users.username,
        },
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activityParticipants)
      .innerJoin(activities, eq(activityParticipants.activityId, activities.id))
      .innerJoin(users, eq(activities.hostId, users.id))
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .where(
        and(
          eq(activityParticipants.userId, userId),
          eq(activityParticipants.status, "accepted"),
        ),
      );

    const joinedActivities = await Promise.all(
      result.map(async (row) => {
        const details = (row.activity.specificDetails as any) || {};

        const participantsList = await db
          .select({ id: activityParticipants.userId })
          .from(activityParticipants)
          .where(
            and(
              eq(activityParticipants.activityId, row.activity.id),
              eq(activityParticipants.status, "accepted"),
            ),
          );

        const chatResult = await db
          .select({ id: chats.id })
          .from(chats)
          .where(eq(chats.activityId, row.activity.id))
          .limit(1);

        const chatId = chatResult.length > 0 ? chatResult[0].id : undefined;
        const normalizedCategory =
          row.category?.id && row.category?.name ? row.category : null;

        return {
          id: row.activity.id,
          title: row.activity.title,
          description: row.activity.description,
          price: details.price,
          latitude: row.activity.latitude,
          longitude: row.activity.longitude,
          max_participants: row.activity.maxParticipants,
          enrolledCount: participantsList.length,
          host: row.host,
          category: normalizedCategory,
          eventDate: row.activity.eventDate,
          coverImage:
            details.coverImage ||
            "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80",
          locationCity: details.locationCity || "Localité",
          chatId,
        };
      }),
    );
    return joinedActivitiesSchema.parse(joinedActivities);
  },
  modifyActivity: async (id: string, updates: any) => {
    const db = getDb();

    const result = await db
      .select({ specificDetails: activities.specificDetails })
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const details = (result[0].specificDetails as any) || {};
    const directUpdates: any = {};

    // 1. Mise à jour des colonnes classiques de la table (description, maxParticipants)
    if (updates.description !== undefined) {
      directUpdates.description = updates.description;
    }
    
    if (updates.maxParticipants !== undefined) {
      directUpdates.maxParticipants = updates.maxParticipants;
    }

    // 2. Mise à jour du champ JSONB (specificDetails) pour la flexibilité (durée, difficulté)
    if (updates.duration_hours !== undefined) {
      details.duration_hours = updates.duration_hours;
    }

    if (updates.difficulty !== undefined) {
      details.difficulty = updates.difficulty;
    }

    if (updates.price_breakdown !== undefined) {
      details.price_breakdown = updates.price_breakdown;
    }

    if (updates.locationCity !== undefined) {
      details.locationCity = updates.locationCity;
    }

    if (updates.coverImage !== undefined) {
      details.coverImage = updates.coverImage;
    }

    // 3. Exécution de la requête UPDATE en base de données
    await db.update(activities).set({
      specificDetails: details,
      ...directUpdates
    }).where(eq(activities.id, id));

    return await activitiesService.getActivityById(id);
  },

};

export default activitiesService;
