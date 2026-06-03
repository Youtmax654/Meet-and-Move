import type { Context } from "hono";
import feedService from "./feed.service";
import { getErrorMessage } from "../../utils/errors";

export const getAllActivities = async (c: Context) => {
  try {
    const activities = await feedService.getAllActivities();

    if (!activities || activities.length === 0) {
      return c.json([], 200);
    }

    return c.json(activities);
  } catch (error: unknown) {
    console.error("Error fetching activities:", error);
    const message = getErrorMessage(error) ?? String(error);
    return c.json({ error: message }, 500);
  }
};
