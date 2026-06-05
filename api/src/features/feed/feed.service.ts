import { and, count, eq, ilike, inArray, isNotNull, sql } from "drizzle-orm";
import {
  activities,
  activityParticipants,
  interests,
  user,
} from "../../db/schema";
import { feedResponseSchema } from "./feed.schema";
import { db } from "../../db";

const DEFAULT_RADIUS_KM = 50;
const DEFAULT_LIMIT = 20;

interface FeedParams {
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  search?: string;
}

// Haversine formula — returns distance in km
// LEAST(1.0, ...) guards against floating-point domain errors in acos
const buildDistanceExpr = (lat: number, lng: number) =>
  sql<number>`(6371 * acos(LEAST(1.0, cos(radians(${lat})) * cos(radians(CAST(${activities.latitude} AS FLOAT))) * cos(radians(CAST(${activities.longitude} AS FLOAT)) - radians(${lng})) + sin(radians(${lat})) * sin(radians(CAST(${activities.latitude} AS FLOAT))))))`;

const feedService = {
  getActivities: async ({
    lat,
    lng,
    radius = DEFAULT_RADIUS_KM,
    limit = DEFAULT_LIMIT,
    offset = 0,
    search,
  }: FeedParams) => {
    const hasLocation = lat !== undefined && lng !== undefined;
    const distanceExpr = hasLocation
      ? buildDistanceExpr(lat!, lng!)
      : null;

    const whereClause = and(
      hasLocation ? isNotNull(activities.latitude) : undefined,
      hasLocation ? isNotNull(activities.longitude) : undefined,
      hasLocation ? sql`${distanceExpr} <= ${radius}` : undefined,
      search?.trim() ? ilike(activities.title, `%${search.trim()}%`) : undefined,
    );

    // Count total matching activities for hasMore calculation
    const countResult = await db
      .select({ count: count() })
      .from(activities)
      .innerJoin(user, eq(activities.hostId, user.id))
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);

    if (total === 0) {
      return feedResponseSchema.parse({ activities: [], hasMore: false, total: 0 });
    }

    // Build select — include distance only when location is provided
    const selectFields = {
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
      ...(distanceExpr ? { distance: distanceExpr } : {}),
    } as const;

    const result = await db
      .select(selectFields)
      .from(activities)
      .innerJoin(user, eq(activities.hostId, user.id))
      .leftJoin(interests, eq(activities.categoryId, interests.id))
      .where(whereClause)
      .orderBy(distanceExpr ?? activities.createdAt)
      .limit(limit)
      .offset(offset);

    if (result.length === 0) {
      return feedResponseSchema.parse({ activities: [], hasMore: false, total });
    }

    // Only fetch participants for the current page's activities
    const activityIds = result.map((r) => r.activity.id);

    const allParticipants = await db
      .select({
        activityId: activityParticipants.activityId,
        userId: user.id,
        name: user.name,
        image: user.image,
      })
      .from(activityParticipants)
      .innerJoin(user, eq(activityParticipants.userId, user.id))
      .where(
        and(
          eq(activityParticipants.status, "accepted"),
          inArray(activityParticipants.activityId, activityIds)
        )
      );

    const participantsByActivity: Record<
      string,
      { id: string; name: string; image: string | null }[]
    > = {};
    allParticipants.forEach((p) => {
      if (!participantsByActivity[p.activityId]) {
        participantsByActivity[p.activityId] = [];
      }
      participantsByActivity[p.activityId].push({
        id: p.userId,
        name: p.name,
        image: p.image ?? null,
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
        distance: "distance" in row ? (row as any).distance ?? null : null,
        locationCity: details.locationCity ?? null,
        maxParticipants: row.activity.maxParticipants,
        enrolledCount: participants.length,
        participants,
        host: row.host,
        category: normalizedCategory,
        image: details.image,
        priceBreakdown: details.priceBreakdown || [],
      };
    });

    return feedResponseSchema.parse({
      activities: activitiesList,
      hasMore: offset + limit < total,
      total,
    });
  },
};

export default feedService;
