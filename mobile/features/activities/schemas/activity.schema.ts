import { z } from "zod";

export const activitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().optional(),
  price: z.number().nonnegative().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  duration_hours: z.number().nullable().optional(),
  latitude: z.union([z.number().min(-90).max(90), z.string()]).nullable(),
  longitude: z.union([z.number().min(-180).max(180), z.string()]).nullable(),
  max_participants: z.number().int().positive().nullable(),
  enrolledCount: z.number(),
  participants: z.array(
    z.object({
      id: z.uuid(),
      username: z.string(),
      avatar: z.string(),
    }),
  ),
  chatId: z.uuid().optional(),
  host: z.object({
    id: z.uuid(),
    username: z.string(),
    bio: z.string().nullable(),
    avatar: z.string(),
  }),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
  price_breakdown: z
    .array(
      z.object({
        label: z.string(),
        amount: z.number(),
        color: z.string(),
      }),
    )
    .default([]),
  eventDate: z.coerce.date().nullable(),
});
