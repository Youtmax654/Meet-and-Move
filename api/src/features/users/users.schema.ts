import { z } from "zod";

export const userPublicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  phoneNumber: z.string().nullable(),
  phoneVerified: z.boolean(),
  age: z.number().int().nullable(),
  gender: z.string().nullable(),
  image: z.string().nullable(),
  bio: z.string().nullable(),
  meetcoinsBalance: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const usersPublicSchema = z.array(userPublicSchema);

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
    .nullable(),
});

export const userActivitiesSchema = z.array(userActivitySchema);
