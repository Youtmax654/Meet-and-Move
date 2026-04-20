import { z } from "zod";

export const homeFeedActivitySchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  location: z.string(),
  isHostVerified: z.boolean().optional(),
  avatars: z.array(z.string()),
  extra: z.string(),
  price: z.string(),
  image: z.string(),
});

export const homeFeedSchema = z.array(homeFeedActivitySchema);

export const topRatedActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  isFeatured: z.boolean(),
});

export const nearbyGuideSchema = z.object({
  id: z.string(),
  name: z.string(),
  details: z.string(),
  image: z.string(),
  isVerified: z.boolean().optional(),
});

export type Activity = z.infer<typeof homeFeedActivitySchema>;
export type UpcomingActivity = Activity;
export type TopRatedActivity = z.infer<typeof topRatedActivitySchema>;
export type Guide = z.infer<typeof nearbyGuideSchema>;
