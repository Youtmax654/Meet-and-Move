import type { Context } from "hono";
import {
  updateUserBodySchema,
  userActivitiesSchema,
  userIdParamsSchema,
  userPublicSchema,
} from "./users.schema";
import usersService from "./users.service";
import { publicUserImage } from "../../utils/image";
import { parseBodyWithImage, parseParams, requireUserId } from "../../utils/http";
import { UploadError } from "../uploads/uploads.service";

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

    return c.json(
      userPublicSchema.parse({
        ...user,
        image: publicUserImage(user.id, user.image),
      }),
    );
  } catch (error) {
    console.error("Error fetching current user:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const getUserImage = async (c: Context) => {
  const paramsParsed = parseParams(c, userIdParamsSchema);
  if (!paramsParsed.ok) {
    return paramsParsed.response;
  }

  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }

  const { id } = paramsParsed.data;

  try {
    const object = await usersService.getUserImage(id);

    if (!object.ok || !object.body) {
      return c.json({ error: "Image not found" }, 404);
    }

    return new Response(object.body, {
      status: 200,
      headers: {
        "Content-Type":
          object.headers.get("content-type") ?? "application/octet-stream",
        "Content-Length": object.headers.get("content-length") ?? "",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error reading user image:", error);
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

  const parsed = await parseBodyWithImage(c, updateUserBodySchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const image = parsed.file
      ? { contentType: parsed.file.type, bytes: await parsed.file.arrayBuffer() }
      : null;

    const updatedUser = await usersService.updateUserProfile(
      userId,
      parsed.data,
      image,
    );

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(
      userPublicSchema.parse({
        ...updatedUser,
        image: publicUserImage(updatedUser.id, updatedUser.image),
      }),
    );
  } catch (error) {
    if (error instanceof UploadError) {
      return c.json(
        { error: error.message, errorKey: error.key },
        error.status,
      );
    }
    console.error("Error updating current user:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
