import { z } from "zod";

// The API returns activities in camelCase with `name` fields. The mobile UI
// consumes a snake_case shape with `username`, so this schema validates the API
// response and adapts it to what the components expect.
const apiActivitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().optional(),
  price: z.number().nonnegative().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  durationHours: z.number().nullable().optional(),
  latitude: z.union([z.number().min(-90).max(90), z.string()]).nullable(),
  longitude: z.union([z.number().min(-180).max(180), z.string()]).nullable(),
  maxParticipants: z.number().int().positive().nullable(),
  enrolledCount: z.number(),
  participants: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      avatar: z.string(),
    }),
  ),
  chatId: z.uuid().optional(),
  host: z.object({
    id: z.uuid(),
    name: z.string(),
    bio: z.string().nullable(),
    avatar: z.string(),
  }),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
  priceBreakdown: z
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

export const activitySchema = apiActivitySchema.transform((a) => ({
  id: a.id,
  title: a.title,
  description: a.description,
  image: a.image,
  price: a.price,
  difficulty: a.difficulty,
  duration_hours: a.durationHours,
  latitude: a.latitude,
  longitude: a.longitude,
  max_participants: a.maxParticipants,
  enrolledCount: a.enrolledCount,
  participants: a.participants.map((p) => ({
    id: p.id,
    username: p.name,
    avatar: p.avatar,
  })),
  chatId: a.chatId,
  host: {
    id: a.host.id,
    username: a.host.name,
    bio: a.host.bio,
    avatar: a.host.avatar,
  },
  category: a.category,
  price_breakdown: a.priceBreakdown,
  eventDate: a.eventDate,
}));

export type Activity = z.infer<typeof activitySchema>;
