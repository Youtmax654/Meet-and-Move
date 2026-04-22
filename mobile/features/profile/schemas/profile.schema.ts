import { z } from "zod";

const profileActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  eventDate: z.string().nullable(),
  coverImage: z.string(),
  locationCity: z.string(),
  enrolledCount: z.number(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  chatId: z.string().optional(),
});

export const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  avatar: z.string(),
  coverImage: z.string().nullable(),
  isVerified: z.boolean().nullable(),
  gamificationLevel: z.number().nullable(),
  stats: z.object({
    createdCount: z.number(),
    participationsCount: z.number(),
    averageRating: z.number().nullable(),
  }),
  createdActivities: z.array(profileActivitySchema),
  pastActivities: z.array(profileActivitySchema),
});

export type ProfileData = z.infer<typeof profileSchema>;

