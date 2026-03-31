import { Hono } from "hono";
import { z } from "zod";

const activitiesRoute = new Hono();

const CreateActivitySchema = z.object({
  hostId: z.number().int().positive(),
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int().positive().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maxParticipants: z.number().int().positive().optional(),
  minAge: z.number().int().nonnegative().optional(),
  maxAge: z.number().int().nonnegative().optional(),
  autoValidate: z.boolean().optional(),
  eventDate: z.string().datetime().optional(),
  specificDetails: z.record(z.unknown()).optional(),
});

type Activity = {
  id: number;
  hostId: number;
  title: string;
  description?: string;
  categoryId?: number;
  latitude?: number;
  longitude?: number;
  maxParticipants?: number;
  minAge?: number;
  maxAge?: number;
  autoValidate: boolean;
  eventDate?: string;
  specificDetails?: Record<string, unknown>;
  createdAt: string;
};

let nextId = 1;
const activities: Activity[] = [];

activitiesRoute.get("/", (c) => {
  return c.json(activities);
});

activitiesRoute.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = CreateActivitySchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { message: "Invalid payload", issues: parsed.error.issues },
      400
    );
  }

  const now = new Date().toISOString();
  const created: Activity = {
    id: nextId++,
    hostId: parsed.data.hostId,
    title: parsed.data.title,
    description: parsed.data.description,
    categoryId: parsed.data.categoryId,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    maxParticipants: parsed.data.maxParticipants,
    minAge: parsed.data.minAge,
    maxAge: parsed.data.maxAge,
    autoValidate: parsed.data.autoValidate ?? true,
    eventDate: parsed.data.eventDate,
    specificDetails: parsed.data.specificDetails,
    createdAt: now,
  };

  activities.unshift(created);
  return c.json(created, 201);
});

export default activitiesRoute;

