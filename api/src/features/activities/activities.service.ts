import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import {
  activities,
  activityParticipants,
  chatMembers,
  chats,
  interests,
  user,
} from "../../db/schema";
import { getActivityImageUrl, getAvatarUrl } from "../../utils/image";
import {
  activitySchema,
  joinedActivitiesSchema,
  type CreateActivityBody,
} from "./schemas";

const activitiesService = {
  getActivityById: async (id: string) => {
    const db = getDb();

    const result = await db
      .select({
        activity: activities,
        host: {
          id: user.id,
          username: user.name,
          bio: user.bio,
        },
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activities)
      .innerJoin(user, eq(activities.hostId, user.id))
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

    // Fetch the list of accepted participants
    const participantsListFiltered = await db
      .select({
        id: user.id,
        username: user.name,
      })
      .from(activityParticipants)
      .innerJoin(user, eq(activityParticipants.userId, user.id))
      .where(
        and(
          eq(activityParticipants.activityId, id),
          eq(activityParticipants.status, "accepted"),
        ),
      );

    // Format participants with their avatars
    const participantsWithAvatars = participantsListFiltered.map((p) => ({
      ...p,
      avatar: getAvatarUrl(p.id),
    }));

    // Fetch the chat ID linked to the activity
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

    const activityResult = await db
      .select({ maxParticipants: activities.maxParticipants })
      .from(activities)
      .where(eq(activities.id, activityId))
      .limit(1);

    if (activityResult.length === 0) {
      throw new Error("ACTIVITY_NOT_FOUND");
    }

    const maxParticipants = activityResult[0].maxParticipants;

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

    if (typeof maxParticipants === "number") {
      if (maxParticipants <= 0) {
        throw new Error("ACTIVITY_FULL");
      }

      const acceptedParticipants = await db
        .select({ userId: activityParticipants.userId })
        .from(activityParticipants)
        .where(
          and(
            eq(activityParticipants.activityId, activityId),
            eq(activityParticipants.status, "accepted"),
          ),
        )
        .limit(maxParticipants);

      if (acceptedParticipants.length >= maxParticipants) {
        throw new Error("ACTIVITY_FULL");
      }
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
          id: user.id,
          username: user.name,
        },
        category: {
          id: interests.id,
          name: interests.name,
        },
      })
      .from(activityParticipants)
      .innerJoin(activities, eq(activityParticipants.activityId, activities.id))
      .innerJoin(user, eq(activities.hostId, user.id))
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

  createActivity: async (hostId: string, payload: CreateActivityBody) => {
    const db = getDb();

    const specificDetailsRaw = {
      price: payload.price ?? undefined,
      difficulty: payload.difficulty ?? undefined,
      duration_hours: payload.duration_hours ?? undefined,
      image: payload.image ?? undefined,
      price_breakdown: payload.price_breakdown ?? undefined,
      coverImage: payload.coverImage ?? undefined,
      locationCity: payload.locationCity ?? undefined,
    };
    const specificDetails = Object.fromEntries(
      Object.entries(specificDetailsRaw).filter(
        ([, value]) => value !== undefined,
      ),
    );

    const { activityId } = await db.transaction(async (tx) => {
      const [createdActivity] = await tx
        .insert(activities)
        .values({
          hostId,
          title: payload.title,
          description: payload.description ?? null,
          categoryId: payload.categoryId ?? null,
          specificDetails:
            specificDetails && Object.keys(specificDetails).length > 0
              ? specificDetails
              : null,
          latitude:
            payload.latitude !== undefined && payload.latitude !== null
              ? payload.latitude.toString()
              : null,
          longitude:
            payload.longitude !== undefined && payload.longitude !== null
              ? payload.longitude.toString()
              : null,
          maxParticipants: payload.max_participants ?? null,
          minAge: payload.min_age ?? null,
          maxAge: payload.max_age ?? null,
          autoValidate: payload.auto_validate ?? true,
          eventDate: payload.eventDate ? new Date(payload.eventDate) : null,
        })
        .returning({ id: activities.id });

      if (!createdActivity) {
        tx.rollback();
        throw new Error("ACTIVITY_CREATE_FAILED");
      }

      const [createdChat] = await tx
        .insert(chats)
        .values({
          activityId: createdActivity.id,
          type: "group",
        })
        .returning({ id: chats.id });

      if (!createdChat) {
        tx.rollback();
        throw new Error("CHAT_CREATE_FAILED");
      }

      await Promise.all([
        tx.insert(activityParticipants).values({
          activityId: createdActivity.id,
          userId: hostId,
          status: "accepted",
          joinedAt: new Date(),
        }),
        tx.insert(chatMembers).values({
          chatId: createdChat.id,
          userId: hostId,
          joinedAt: new Date(),
        }),
      ]);

      return { activityId: createdActivity.id };
    });

    return activitiesService.getActivityById(activityId);
  },
};

export default activitiesService;
