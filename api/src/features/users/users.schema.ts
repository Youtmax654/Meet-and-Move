import { z } from "zod";
import { userPublicSchema } from "../auth/auth.schema";

export const userActivitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  coverImage: z.string(),
  locationCity: z.string().nullable(),
  eventDate: z.coerce.date().nullable(),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
});

export const userActivitiesSchema = z.array(userActivitySchema);

export { userPublicSchema };
