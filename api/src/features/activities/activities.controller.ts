import { Context } from "hono";
import {
  activityIdParamsSchema,
  createActivityBodySchema,
  updateActivityBodySchema,
} from "./activities.schema";
import activitiesService from "./activities.service";

export const getActivity = async (c: Context) => {
  const paramsParsed = activityIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const { id } = paramsParsed.data;

  try {
    const activity = await activitiesService.getActivityById(id);

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    return c.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const joinActivity = async (c: Context) => {
  const paramsParsed = activityIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { id: activityId } = paramsParsed.data;

  try {
    const result = await activitiesService.joinActivity(activityId, userId);
    return c.json(result);
  } catch (error: any) {
    if (error.message === "ALREADY_JOINED" || error.code === "23505") {
      return c.json({ error: "Tu as déjà rejoint cette activité !" }, 409);
    }
    if (error.code === "23503") {
      return c.json({ error: "Activité introuvable" }, 404);
    }
    console.error("Error joining activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const getJoinedActivities = async (c: Context) => {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const activities = await activitiesService.getUserJoinedActivities(userId);
    return c.json(activities);
  } catch (error) {
    console.error("Error fetching user joined activities:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const createActivity = async (c: Context) => {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json().catch(() => null);
  const parsed = createActivityBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Invalid body", details: parsed.error.issues },
      400,
    );
  }

  try {
    const created = await activitiesService.createActivity(userId, parsed.data);
    return c.json(created, 201);
  } catch (error) {
    console.error("Error creating activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const updateActivity = async (c: Context) => {
  const userId = c.get("userId");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const paramsParsed = activityIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const body = await c.req.json().catch(() => null);
  const parsed = updateActivityBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Invalid body", details: parsed.error.issues },
      400,
    );
  }

  const { id } = paramsParsed.data;

  try {
    const result = await activitiesService.updateActivity(id, userId, parsed.data);
    if (!result.ok) {
      if (result.reason === "NOT_FOUND") return c.json({ error: "Activity not found" }, 404);
      if (result.reason === "FORBIDDEN") return c.json({ error: "Forbidden" }, 403);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
