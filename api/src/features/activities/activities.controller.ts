import type { Context } from "hono";
import { activityIdParamsSchema, createActivityBodySchema } from "./schemas";
import activitiesService from "./activities.service";
import { getErrorCode } from "../../utils/errors";
import { mapJoinActivityError } from "./activities.errors";
import {
  parseBodyWithImage,
  parseParams,
  requireUserId,
} from "../../utils/http";
import { UploadError } from "../uploads/uploads.service";

export const getActivity = async (c: Context) => {
  const paramsParsed = parseParams(c, activityIdParamsSchema);
  if (!paramsParsed.ok) {
    return paramsParsed.response;
  }

  const { id } = paramsParsed.data;

  try {
    const activity = await activitiesService.getActivityById(id);

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    return c.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const getActivityImage = async (c: Context) => {
  const paramsParsed = parseParams(c, activityIdParamsSchema);
  if (!paramsParsed.ok) {
    return paramsParsed.response;
  }

  const { id } = paramsParsed.data;

  try {
    const { imageBuffer, contentType, contentLength } =
      await activitiesService.getActivityImage(id);

    return c.body(imageBuffer, 200, {
      "Content-Type": contentType,
      "Content-Length": contentLength,
      "Cache-Control": "private, max-age=3600",
    });
  } catch (error: any) {
    if (error.message === "Image introuvable") {
      return c.json({ error: "Image not found" }, 404);
    }

    console.error("Error reading activity image:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const joinActivity = async (c: Context) => {
  const paramsParsed = parseParams(c, activityIdParamsSchema);
  if (!paramsParsed.ok) {
    return paramsParsed.response;
  }

  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }
  const { userId } = authResult;

  const { id: activityId } = paramsParsed.data;

  try {
    const result = await activitiesService.joinActivity(activityId, userId);
    return c.json(result);
  } catch (error: unknown) {
    const mapped = mapJoinActivityError(error);
    if (mapped) {
      return c.json(
        { error: mapped.message, errorKey: mapped.key },
        mapped.status,
      );
    }
    console.error("Error joining activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const getJoinedActivities = async (c: Context) => {
  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const activities = await activitiesService.getUserJoinedActivities(userId);
    return c.json(activities);
  } catch (error) {
    console.error("Error fetching user joined activities:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const createActivity = async (c: Context) => {
  const authResult = requireUserId(c);
  if (!authResult.ok) {
    return authResult.response;
  }
  const { userId } = authResult;

  const parsed = await parseBodyWithImage(c, createActivityBodySchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const image = parsed.file
      ? {
          contentType: parsed.file.type,
          bytes: await parsed.file.arrayBuffer(),
        }
      : null;

    const activity = await activitiesService.createActivity(
      userId,
      parsed.data,
      image,
    );

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    return c.json(activity, 201);
  } catch (error: unknown) {
    if (error instanceof UploadError) {
      return c.json(
        { error: error.message, errorKey: error.key },
        error.status,
      );
    }
    // 23503 = the provided category ID doesn't exist
    if (getErrorCode(error) === "23503") {
      return c.json({ error: "Category not found" }, 404);
    }
    console.error("Error creating activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
