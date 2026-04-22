import type { Context } from "hono";

import usersService from "./users.service";
import { userProfileParamsSchema } from "./users.schema";

export const getUserProfile = async (c: Context) => {
  const paramsParsed = userProfileParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json({ error: "Invalid params", details: paramsParsed.error.issues }, 400);
  }

  try {
    const profile = await usersService.getUserProfileById(paramsParsed.data.id);
    if (!profile) return c.json({ error: "User not found" }, 404);
    return c.json(profile);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

