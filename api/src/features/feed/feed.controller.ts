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

export const getGuides = async (c: Context) => {
  try {
    const guides = await feedService.getGuides();
    return c.json(guides || []);
  } catch (error) {
    console.error("Error fetching guides:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
