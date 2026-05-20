import { Context } from "hono";
import { mapActivityToCard } from "./activities.mapper";
import feedService from "./feed.service";

export const getAllActivities = async (c: Context) => {
  try {
    const activities = await feedService.getAllActivities();

    if (!activities || activities.length === 0) {
      return c.json([], 200);
    }

    const mapped = activities.map(mapActivityToCard);
    return c.json(mapped);
  } catch (error: any) {
    console.error("Error fetching activities:", error);
    return c.json({ error: error.message || String(error) }, 500);
  }
};
