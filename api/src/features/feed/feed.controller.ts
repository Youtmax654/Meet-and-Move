import { Context } from 'hono';
import { getAllActivities as fetchAllActivities, getGuides as fetchGuides } from './feed.service';
import { mapActivityToCard } from './activities.mapper';

export const getAllActivities = async (c: Context) => {
  try {
    const activities = await fetchAllActivities();

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
    const guides = await fetchGuides();
    return c.json(guides || []);
  } catch (error) {
    console.error("Error fetching guides:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};