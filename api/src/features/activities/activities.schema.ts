import { z } from "zod";

export const activityIdParamsSchema = z.object({
  id: z.uuid(),
});

export const createActivityBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  categoryId: z.uuid(),
  tags: z.array(z.string()).default([]),
  maxParticipants: z.number().int().positive(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  locationCity: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  pricePerPerson: z.number().nonnegative().default(0),
  fees: z.number().nonnegative().default(0),
  priceBreakdown: z
    .array(
      z.object({
        label: z.string(),
        amount: z.number().nonnegative(),
        color: z.string(),
      }),
    )
    .default([]),
  photos: z.array(z.string()).default([]),
  coverImage: z.string().nullable().optional(),
});

export const updateActivityBodySchema = createActivityBodySchema.partial().extend({
  title: z.string().min(1).optional(),
  categoryId: z.uuid().optional(),
  maxParticipants: z.number().int().positive().optional(),
});

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
  tags: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
  coverImage: z.string().nullable().optional(),
  locationCity: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  eventDate: z.coerce.date().nullable(),
});

export const joinedActivitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number().nonnegative().nullable().optional(),
  latitude: z.union([z.number().min(-90).max(90), z.string()]).nullable(),
  longitude: z.union([z.number().min(-180).max(180), z.string()]).nullable(),
  max_participants: z.number().int().positive().nullable(),
  enrolledCount: z.number(),
  host: z.object({
    id: z.uuid(),
    username: z.string(),
  }),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
  eventDate: z.coerce.date().nullable(),
  coverImage: z.string(),
  locationCity: z.string(),
  chatId: z.uuid().optional(),
});

export const joinedActivitiesSchema = z.array(joinedActivitySchema);
