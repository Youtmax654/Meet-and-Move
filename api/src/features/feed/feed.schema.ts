import { z } from 'zod';

export const activitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  price: z.number().optional(),
  difficulty: z.string().optional(),
  duration_hours: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  max_participants: z.number().optional(),
  host: z.object({
    id: z.string().uuid(),
    username: z.string(),
    bio: z.string().optional(),
  }).optional(),
  category: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }).optional(),
  price_breakdown: z.array(z.object({
    label: z.string(),
    amount: z.number(),
    color: z.string(),
  })).optional(),
});