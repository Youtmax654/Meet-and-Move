import { Context } from 'hono';
import { getAllActivities as fetchAllActivities, getGuides as fetchGuides } from './feed.service';
import { mapActivityToCard } from './activities.mapper';

export const getAllActivities = async (c: Context) => {
  const databaseUrl = c.env?.DATABASE_URL as string;

  if (!databaseUrl) {
    return c.json({ error: "Database URL not configured in environment" }, 500);
  }

  try {
    const activities = await fetchAllActivities(databaseUrl);

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
  const databaseUrl = c.env?.DATABASE_URL as string;

  if (!databaseUrl) {
    return c.json({ error: "Database URL not configured in environment" }, 500);
  }

  try {
    const guides = await fetchGuides(databaseUrl);
    return c.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};