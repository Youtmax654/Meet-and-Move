import { z } from "zod";

const participantSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().optional(),
});

const hostSchema = z.object({
  id: z.string(),
  username: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const priceBreakdownItemSchema = z.object({
  label: z.string(),
  amount: z.number(),
  color: z.string(),
});

export const activityDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  price: z.number().optional(),
  difficulty: z.string().optional(),
  duration_hours: z.number().optional(),
  latitude: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.coerce.number().optional(),
  ),
  longitude: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.coerce.number().optional(),
  ),
  max_participants: z.number().optional(),
  enrolledCount: z.number().optional(),
  participants: z.array(participantSchema).optional(),
  host: hostSchema.optional(),
  category: categorySchema.optional(),
  price_breakdown: z.array(priceBreakdownItemSchema).optional(),
  eventDate: z.string().optional(),
  chatId: z.string().optional(),
});
