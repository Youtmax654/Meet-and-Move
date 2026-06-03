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
  maxParticipants: z.number().int().positive().nullable().optional(),
  minAge: z.number().int().positive().nullable().optional(),
  maxAge: z.number().int().positive().nullable().optional(),
  autoValidate: z.boolean().optional(),
  eventDate: z.coerce.date().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  durationHours: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
  priceBreakdown: z.array(priceBreakdownItemSchema).optional(),
  coverImage: z.string().nullable().optional(),
  locationCity: z.string().nullable().optional(),
});

export type CreateActivityBody = z.infer<typeof createActivityBodySchema>;
