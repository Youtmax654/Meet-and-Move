import { api } from "@/lib/api";
import { activitySchema } from "./schemas/activity.schema";

export type CreateActivityPayload = {
  title: string;
  description: string | null;
  categoryId: string | null;
  locationCity: string | null;
  eventDate: Date | null;
  auto_validate: boolean;
  duration_hours: number | null;
  price: number | null;
  max_participants: number | null;
  difficulty: string | null;
};

export async function createActivity(payload: CreateActivityPayload) {
  const response = await api.post("/activities", payload);
  return activitySchema.parse(response.data);
}
