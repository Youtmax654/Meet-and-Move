import { and, eq } from "drizzle-orm";
import {
  activities,
  activityParticipants,
  chatMembers,
  chats,
  interests,
  user,
} from "../../db/schema";
import {
  getActivityImageUrl,
  getAvatarUrl,
  publicUserImage,
} from "../../utils/image";
import {
  activitySchema,
  joinedActivitiesSchema,
  type CreateActivityBody,
} from "./schemas";
import { db } from "../../db";
import { assertValidImage, uploadImageToKey } from "../uploads/uploads.service";
import { getObject } from "../../utils/s3";

const activitiesService = {
  getActivityById: async (id: string) => {
    const result = await db
      .select({
        activity: activities,
        host: {
          id: user.id,
          name: user.name,
          bio: user.bio,
          image: user.image,
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
        name: user.name,
        image: user.image,
      })
      .from(activityParticipants)
      .innerJoin(user, eq(activityParticipants.userId, user.id))
      .where(
        and(
          eq(activityParticipants.activityId, id),
          eq(activityParticipants.status, "accepted"),
        ),
      );

    // Format participants with their avatars. When a participant uploaded a
    // profile photo we expose it through the authenticated API route
    // (`/users/<id>/image`); otherwise we fall back to a generated avatar.
    const participantsWithAvatars = participantsListFiltered.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: publicUserImage(p.id, p.image) ?? getAvatarUrl(p.id),
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
      // When a cover has been uploaded, expose it through the authenticated API
      // route (the mobile attaches the session cookie). Otherwise fall back to a
      // generated external image.
      image: details.image
        ? `/activities/${row.activity.id}/image`
        : getActivityImageUrl(row.category?.name || undefined, row.activity.id),
      price: details.price,
      difficulty: details.difficulty,
      durationHours: details.durationHours,
      latitude: row.activity.latitude,
      longitude: row.activity.longitude,
      maxParticipants: row.activity.maxParticipants,
      enrolledCount: participantsWithAvatars.length,
      participants: participantsWithAvatars,
      chatId,
      host: {
        id: row.host.id,
        name: row.host.name,
        bio: row.host.bio,
        avatar:
          publicUserImage(row.host.id, row.host.image) ??
          getAvatarUrl(row.host.id),
      },
      category: normalizedCategory,
      priceBreakdown: details.priceBreakdown || [],
      eventDate: row.activity.eventDate,
    });
  },

  joinActivity: async (
    activityId: string,
    userId: string,
  ): Promise<{ success: boolean }> => {
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
    const result = await db
      .select({
        activity: activities,
        host: {
          id: user.id,
          name: user.name,
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
          maxParticipants: row.activity.maxParticipants,
          enrolledCount: participantsList.length,
          host: row.host,
          category: normalizedCategory,
          eventDate: row.activity.eventDate,
          coverImage:
            details.coverImage ||
            "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80",
          locationCity: details.locationCity || "Localite",
          chatId,
        };
      }),
    );
    return joinedActivitiesSchema.parse(joinedActivities);
  },

  createActivity: async (
    hostId: string,
    payload: CreateActivityBody,
    image?: { contentType: string; bytes: ArrayBuffer } | null,
  ) => {
    // Validate the image up front so an invalid file rejects the whole request
    // before any activity row is created.
    if (image) {
      assertValidImage(image.contentType, image.bytes.byteLength);
    }

    const specificDetailsRaw = {
      price: payload.price ?? undefined,
      difficulty: payload.difficulty ?? undefined,
      durationHours: payload.durationHours ?? undefined,
      image: payload.image ?? undefined,
      priceBreakdown: payload.priceBreakdown ?? undefined,
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
          maxParticipants: payload.maxParticipants ?? null,
          minAge: payload.minAge ?? null,
          maxAge: payload.maxAge ?? null,
          autoValidate: payload.autoValidate ?? true,
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

    // Now that the activity exists, store its cover under a key derived from the
    // id (`activities/<id>/image`) so the public URL is stable.
    if (image) {
      const url = await uploadImageToKey(
        `activities/${activityId}/image`,
        image.contentType,
        image.bytes,
      );

      const [row] = await db
        .select({ specificDetails: activities.specificDetails })
        .from(activities)
        .where(eq(activities.id, activityId))
        .limit(1);

      const details = (row?.specificDetails as Record<string, unknown>) || {};
      await db
        .update(activities)
        .set({ specificDetails: { ...details, image: url, coverImage: url } })
        .where(eq(activities.id, activityId));
    }

    return activitiesService.getActivityById(activityId);
  },

  /**
   * Stream an activity's cover image from S3/MinIO. Returns the raw S3 Response
   * (caller checks `.ok` for a 404). The key is derived from the activity id.
   */
  getActivityImage: async (activityId: string) => {
    const key = `activities/${activityId}/image`;

    console.debug(
      `Fetching image for activity ${activityId} from S3 with key ${key}`,
    );
    const s3Response = await getObject(key);
    console.debug(`S3 response status:`, s3Response.status);

    if (!s3Response.ok) {
      throw new Error("Image introuvable");
    }

    const contentType = s3Response.headers.get("content-type") || "image/jpeg";
    const contentLength = s3Response.headers.get("content-length") || "";
    const imageBuffer = await s3Response.arrayBuffer();

    return {
      imageBuffer,
      contentType,
      contentLength,
    };
  },
};

export default activitiesService;
