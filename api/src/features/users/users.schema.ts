import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

export const userPublicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  phoneNumber: z.string().nullable(),
  phoneVerified: z.boolean(),
  birthDate: z.coerce.date().nullable(),
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

export const updateUserBodySchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.coerce.date(),
  gender: z.string().trim().min(1),
  bio: z.string().trim().min(1).nullable().optional(),
});

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
