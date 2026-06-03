import type { Context } from "hono";
import { userIdParamsSchema } from "./auth.schema";
import authService from "./auth.service";
import { userPublicSchema, usersPublicSchema } from "../users/users.schema";
import { parseParams } from "../../utils/http";

export const getDevUsers = async (c: Context) => {
  const allUsers = await authService.getAllUsers();
  return c.json(usersPublicSchema.parse(allUsers));
};

export const getDevUserById = async (c: Context) => {
  const paramsParsed = parseParams(c, userIdParamsSchema);
  if (!paramsParsed.ok) {
    return paramsParsed.response;
  }

  const { id } = paramsParsed.data;
  const user = await authService.getUserById(id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(userPublicSchema.parse(user));
};
