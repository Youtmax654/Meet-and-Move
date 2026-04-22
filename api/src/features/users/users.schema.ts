import { z } from "zod";

export const userProfileParamsSchema = z.object({
  id: z.uuid(),
});

const profileActivitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  eventDate: z.coerce.date().nullable(),
  coverImage: z.string(),
  locationCity: z.string(),
  enrolledCount: z.number().int().nonnegative(),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
  chatId: z.uuid().optional(),
});

export const userProfileSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  avatar: z.string(),
  coverImage: z.string().nullable(),
  isVerified: z.boolean().nullable(),
  gamificationLevel: z.number().int().nullable(),
  stats: z.object({
    createdCount: z.number().int().nonnegative(),
    participationsCount: z.number().int().nonnegative(),
    averageRating: z.number().min(0).max(5).nullable(),
  }),
  createdActivities: z.array(profileActivitySchema),
  pastActivities: z.array(profileActivitySchema),
});

