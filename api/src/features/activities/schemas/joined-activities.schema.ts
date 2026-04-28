import { z } from "zod";

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
