import { z } from "zod";

export const userActivitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  coverImage: z.string(),
  locationCity: z.string().nullable(),
  eventDate: z.coerce.date().nullable(),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .optional()
    .nullable(),
});

export const userActivitiesSchema = z.array(userActivitySchema);

export const profileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  phoneNumber: z.string().nullable(),
  phoneVerified: z.boolean(),
  birthDate: z.coerce.date().nullable(),
  gender: z.string().nullable(),
  image: z.url().nullable(),
  bio: z.string().nullable(),
  meetcoinsBalance: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type UserActivity = z.infer<typeof userActivitySchema>;
