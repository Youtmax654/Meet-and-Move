import { z } from "zod";

export const userActivitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  coverImage: z.string(),
  locationCity: z.string().nullable(),
  eventDate: z.coerce.date().nullable(),
  category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .nullable(),
});

export const userActivitiesSchema = z.array(userActivitySchema);

export const profileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  age: z.number().int().nullable(),
  gender: z.string().nullable(),
  role: z.string().nullable(),
  bio: z.string().nullable(),
  isVerified: z.boolean().nullable(),
  meetcoinsBalance: z.number().int().nullable(),
  gamificationLevel: z.number().int().nullable(),
  createdAt: z.coerce.date().nullable(),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type UserActivity = z.infer<typeof userActivitySchema>;
