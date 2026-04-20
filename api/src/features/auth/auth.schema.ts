import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

export const userPublicSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  email: z.email(),
  age: z.number().int().nullable(),
  gender: z.string().nullable(),
  role: z.string().nullable(),
  bio: z.string().nullable(),
  isVerified: z.boolean().nullable(),
  meetcoinsBalance: z.number().int().nullable(),
  gamificationLevel: z.number().int().nullable(),
  createdAt: z.date().nullable(),
});

export const usersPublicSchema = z.array(userPublicSchema);
