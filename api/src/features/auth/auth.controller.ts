import type { Context } from "hono";
import {
  userIdParamsSchema,
  userPublicSchema,
  usersPublicSchema,
} from "./auth.schema";
import authService from "./auth.service";

export const getDevUsers = async (c: Context) => {
  const allUsers = await authService.getAllUsers();
  return c.json(usersPublicSchema.parse(allUsers));
};

export const getDevUserById = async (c: Context) => {
  const paramsParsed = userIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const { id } = paramsParsed.data;
  const user = await authService.getUserById(id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(userPublicSchema.parse(user));
};
