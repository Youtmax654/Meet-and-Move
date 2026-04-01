import { Context } from 'hono';
import { getActivityById } from './activities.service';

export const getActivity = async (c: Context) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: "Missing ID" }, 400);
  }

  try {
    const activity = await getActivityById(id);

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    return c.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
