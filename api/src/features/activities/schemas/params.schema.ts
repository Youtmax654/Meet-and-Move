import { z } from "zod";

export const activityIdParamsSchema = z.object({
  id: z.uuid(),
});
