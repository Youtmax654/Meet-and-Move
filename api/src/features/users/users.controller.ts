import type { Context } from "hono";
import {
  updateUserBodySchema,
  userActivitiesSchema,
  userPublicSchema,
} from "./users.schema";
import usersService from "./users.service";
import { requireUserId } from "../../utils/http";
import { parseBody } from "../../utils/http";

export const getCurrentUser = async (c: Context) => {
  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const user = await usersService.getUserById(userId);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(userPublicSchema.parse(user));
  } catch (error) {
    console.error("Error fetching current user:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const getCurrentUserActivities = async (c: Context) => {
  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const activities = await usersService.getUserActivities(userId);
    return c.json(userActivitiesSchema.parse(activities));
  } catch (error) {
    console.error("Error fetching current user activities:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const updateCurrentUser = async (c: Context) => {
  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }
  const { userId } = authResult;

  const parsed = await parseBody(c, updateUserBodySchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const updatedUser = await usersService.updateUserProfile(
      userId,
      parsed.data,
    );

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(userPublicSchema.parse(updatedUser));
  } catch (error) {
    console.error("Error updating current user:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
