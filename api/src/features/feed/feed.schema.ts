import { z } from "zod";

const participantSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

const hostSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  bio: z.string().nullable(),
  emailVerified: z.boolean(),
});

const categorySchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
  })
  .nullable();

const priceBreakdownSchema = z.object({
  label: z.string(),
  amount: z.number(),
  color: z.string(),
});

export const feedActivitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  eventDate: z.coerce.date().nullable(),
  price: z.number().nonnegative().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  durationHours: z.number().nullable().optional(),
  latitude: z.union([z.number().min(-90).max(90), z.string()]).nullable(),
  longitude: z.union([z.number().min(-180).max(180), z.string()]).nullable(),
  distance: z.number().nullable().optional(),
  locationCity: z.string().nullable().optional(),
  maxParticipants: z.number().int().positive().nullable(),
  enrolledCount: z.number(),
  participants: z.array(participantSchema),
  host: hostSchema,
  category: categorySchema,
  image: z.string().optional(),
  priceBreakdown: z.array(priceBreakdownSchema),
});

export const feedActivitiesSchema = z.array(feedActivitySchema);

export const feedResponseSchema = z.object({
  activities: feedActivitiesSchema,
  hasMore: z.boolean(),
  total: z.number().int(),
});

export const feedGuideSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  details: z.string(),
  image: z.string(),
  isVerified: z.boolean().nullable(),
});

export const feedGuidesSchema = z.array(feedGuideSchema);

export type FeedActivity = z.infer<typeof feedActivitySchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
