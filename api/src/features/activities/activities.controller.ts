import { Context } from 'hono';
import { getActivityById } from './activities.service';

export const getActivity = async (c: Context) => {
  const id = c.req.param('id');
  // Access environment variable DATABASE_URL from Hono context
  const databaseUrl = c.env?.DATABASE_URL as string;

  if (!databaseUrl) {
    return c.json({ error: "Database URL not configured in environment" }, 500);
  }

  if (!id) {
    return c.json({ error: "Missing ID" }, 400);
  }

  try {
    const activity = await getActivityById(id, databaseUrl);

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    return c.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
