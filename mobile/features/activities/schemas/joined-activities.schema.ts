import { z } from "zod";

export const joinedActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  eventDate: z.string(),
  coverImage: z.string(),
  locationCity: z.string(),
  category: z
    .object({
      name: z.string(),
    })
    .optional(),
  enrolledCount: z.number(),
  chatId: z.string().optional(),
});

export const joinedActivitiesSchema = z.array(joinedActivitySchema);

export type JoinedActivity = z.infer<typeof joinedActivitySchema>;
