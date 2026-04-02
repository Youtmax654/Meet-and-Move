import { Context } from 'hono';
import { getActivityById, joinActivity } from './activities.service';

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

export const handleJoinActivity = async (c: Context) => {
  const activityId = c.req.param('id');
  const userId = c.get('userId');

  if (!activityId || !userId) {
    return c.json({ error: "Missing activityId or userId" }, 400);
  }

  try {
    const result = await joinActivity(activityId, userId);
    return c.json(result);
  } catch (error: any) {
    if (error.message === "ALREADY_JOINED") {
      return c.json({ error: "Tu as déjà rejoint cette activité !" }, 409);
    }
    console.error("Error joining activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
