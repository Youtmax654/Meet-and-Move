import { z } from "zod";

export const homeFeedActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  eventDate: z.coerce.date().nullable(),
  price: z.number().nonnegative().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  durationHours: z.number().nullable().optional(),
  latitude: z.union([z.number(), z.string()]).nullable(),
  longitude: z.union([z.number(), z.string()]).nullable(),
  distance: z.number().nullable().optional(),
  locationCity: z.string().nullable().optional(),
  maxParticipants: z.number().int().positive().nullable(),
  enrolledCount: z.number(),
  participants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable().optional(),
    })
  ),
  host: z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string().nullable(),
    emailVerified: z.boolean(),
  }),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  image: z.string().optional(),
  priceBreakdown: z.array(
    z.object({
      label: z.string(),
      amount: z.number(),
      color: z.string(),
    })
  ),
});

export const feedPageSchema = z.object({
  activities: z.array(homeFeedActivitySchema),
  hasMore: z.boolean(),
  total: z.number().int(),
});

export const homeFeedSchema = z.array(homeFeedActivitySchema);

export type Activity = z.infer<typeof homeFeedActivitySchema>;
export type FeedPage = z.infer<typeof feedPageSchema>;
export type UpcomingActivity = Activity;

export const topRatedActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  isFeatured: z.boolean(),
});

export type TopRatedActivity = z.infer<typeof topRatedActivitySchema>;
