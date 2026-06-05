import { z } from "zod";

const participantSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
});

const hostSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string().nullable().optional(),
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
  description: z.string().nullable(),
  image: z.string().optional(),
  price: z.number().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  durationHours: z.number().optional().nullable(),
  latitude: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.coerce.number().optional(),
  ),
  longitude: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.coerce.number().optional(),
  ),
  maxParticipants: z.number().optional().nullable(),
  enrolledCount: z.number().optional(),
  participants: z.array(participantSchema).optional(),
  host: hostSchema.optional(),
  category: categorySchema.optional().nullable(),
  priceBreakdown: z.array(priceBreakdownItemSchema).optional(),
  eventDate: z.coerce.date().optional().nullable(),
  chatId: z.string().optional(),
});

export type ActivityDetails = z.infer<typeof activityDetailsSchema>;
