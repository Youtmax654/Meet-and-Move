import { z } from "zod";

const priceBreakdownItemSchema = z.object({
  label: z.string(),
  amount: z.number(),
  color: z.string(),
});

export const createActivityBodySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).nullable().optional(),
  categoryId: z.uuid().nullable().optional(),
  latitude: z
    .union([z.number().min(-90).max(90), z.string()])
    .nullable()
    .optional(),
  longitude: z
    .union([z.number().min(-180).max(180), z.string()])
    .nullable()
    .optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  min_age: z.number().int().positive().nullable().optional(),
  max_age: z.number().int().positive().nullable().optional(),
  auto_validate: z.boolean().optional(),
  eventDate: z.coerce.date().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  duration_hours: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
  price_breakdown: z.array(priceBreakdownItemSchema).optional(),
  coverImage: z.string().nullable().optional(),
  locationCity: z.string().nullable().optional(),
});

export type CreateActivityBody = z.infer<typeof createActivityBodySchema>;
