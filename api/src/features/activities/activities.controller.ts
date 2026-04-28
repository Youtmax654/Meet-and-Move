import { Context } from "hono";
import { activityIdParamsSchema } from "./activities.schema";
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

export const modifyActivity = async (c: Context) => {
  const paramsParsed = activityIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const { id } = paramsParsed.data;

  try {
    const body = await c.req.json();
    const activity = await activitiesService.modifyActivity(id, body);

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    return c.json(activity);
  } catch (error) {
    console.error("Error modifying activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
