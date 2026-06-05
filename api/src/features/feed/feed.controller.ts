import type { Context } from "hono";
import feedService from "./feed.service";
import { getErrorMessage } from "../../utils/errors";

export const getAllActivities = async (c: Context) => {
  try {
    const { lat, lng, radius, limit, offset, search } = c.req.query();

    const params = {
      lat: lat !== undefined ? Number(lat) : undefined,
      lng: lng !== undefined ? Number(lng) : undefined,
      radius: radius !== undefined ? Number(radius) : undefined,
      limit: limit !== undefined ? Math.min(Number(limit), 50) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    };

    // Validate that lat/lng are both present or both absent
    const hasLat = params.lat !== undefined && !isNaN(params.lat);
    const hasLng = params.lng !== undefined && !isNaN(params.lng);

    const result = await feedService.getActivities({
      lat: hasLat && hasLng ? params.lat : undefined,
      lng: hasLat && hasLng ? params.lng : undefined,
      radius: !isNaN(params.radius ?? NaN) ? params.radius : undefined,
      limit: !isNaN(params.limit ?? NaN) ? params.limit : undefined,
      offset: !isNaN(params.offset ?? NaN) ? params.offset : undefined,
      search: search?.trim() || undefined,
    });

    return c.json(result);
  } catch (error: unknown) {
    console.error("Error fetching activities:", error);
    const message = getErrorMessage(error) ?? String(error);
    return c.json({ error: message }, 500);
  }
};
