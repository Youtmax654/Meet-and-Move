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
import {
  activitySchema,
  createActivityBodySchema,
  joinedActivitiesSchema,
  updateActivityBodySchema,
} from "./activities.schema";
import type { z } from "zod";

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
        details.coverImage ||
        details.photos?.[0] ||
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
      tags: details.tags || [],
      photos: details.photos || [],
      coverImage: details.coverImage ?? null,
      locationCity: details.locationCity ?? null,
      address: details.address ?? null,
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

  createActivity: async (
    hostId: string,
    input: z.infer<typeof createActivityBodySchema>,
  ) => {
    const db = getDb();

    const totalPrice = (input.pricePerPerson ?? 0) + (input.fees ?? 0);

    const specificDetails = {
      price: totalPrice,
      price_breakdown: input.priceBreakdown ?? [],
      tags: input.tags ?? [],
      photos: input.photos ?? [],
      coverImage: input.coverImage ?? input.photos?.[0] ?? null,
      image: input.coverImage ?? input.photos?.[0] ?? null,
      locationCity: input.locationCity ?? null,
      address: input.address ?? null,
    };

    const inserted = await db
      .insert(activities)
      .values({
        hostId,
        title: input.title,
        description: input.description ?? null,
        categoryId: input.categoryId,
        maxParticipants: input.maxParticipants,
        latitude: input.latitude?.toString() ?? null,
        longitude: input.longitude?.toString() ?? null,
        specificDetails,
        autoValidate: true,
      })
      .returning({ id: activities.id });

    return { id: inserted[0]?.id };
  },

  updateActivity: async (
    activityId: string,
    userId: string,
    input: z.infer<typeof updateActivityBodySchema>,
  ) => {
    const db = getDb();

    const existing = await db
      .select({ hostId: activities.hostId, specificDetails: activities.specificDetails })
      .from(activities)
      .where(eq(activities.id, activityId))
      .limit(1);

    if (existing.length === 0) {
      return { ok: false as const, reason: "NOT_FOUND" as const };
    }

    if (existing[0].hostId !== userId) {
      return { ok: false as const, reason: "FORBIDDEN" as const };
    }

    const currentDetails = (existing[0].specificDetails as any) || {};

    const pricePerPerson = input.pricePerPerson ?? 0;
    const fees = input.fees ?? 0;
    const totalPrice = pricePerPerson + fees;
    const nextPhotos = typeof input.photos !== "undefined" ? input.photos : currentDetails.photos;
    const nextCoverImage =
      typeof input.coverImage !== "undefined"
        ? input.coverImage ?? input.photos?.[0] ?? null
        : currentDetails.coverImage ?? nextPhotos?.[0] ?? null;

    const mergedDetails = {
      ...currentDetails,
      ...(typeof input.tags !== "undefined" ? { tags: input.tags } : {}),
      ...(typeof input.photos !== "undefined" ? { photos: nextPhotos } : {}),
      ...(typeof input.coverImage !== "undefined" ? { coverImage: nextCoverImage } : {}),
      ...(typeof input.coverImage !== "undefined" || typeof input.photos !== "undefined"
        ? { image: nextCoverImage }
        : {}),
      ...(typeof input.locationCity !== "undefined" ? { locationCity: input.locationCity } : {}),
      ...(typeof input.address !== "undefined" ? { address: input.address } : {}),
      ...(typeof input.priceBreakdown !== "undefined" ? { price_breakdown: input.priceBreakdown } : {}),
      ...(typeof input.pricePerPerson !== "undefined" || typeof input.fees !== "undefined"
        ? { price: totalPrice }
        : {}),
    };

    await db
      .update(activities)
      .set({
        ...(typeof input.title !== "undefined" ? { title: input.title } : {}),
        ...(typeof input.description !== "undefined" ? { description: input.description } : {}),
        ...(typeof input.categoryId !== "undefined" ? { categoryId: input.categoryId } : {}),
        ...(typeof input.maxParticipants !== "undefined"
          ? { maxParticipants: input.maxParticipants }
          : {}),
        ...(typeof input.latitude !== "undefined"
          ? { latitude: input.latitude?.toString() ?? null }
          : {}),
        ...(typeof input.longitude !== "undefined"
          ? { longitude: input.longitude?.toString() ?? null }
          : {}),
        specificDetails: mergedDetails,
      })
      .where(eq(activities.id, activityId));

    return { ok: true as const };
  },
};

export default activitiesService;
