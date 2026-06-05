import type { ImagePickerAsset } from "expo-image-picker";
import { requestWithOptionalImage } from "@/lib/upload";
import { activitySchema } from "./schemas/activity.schema";

export type CreateActivityPayload = {
  title: string;
  description: string | null;
  categoryId: string | null;
  locationCity: string | null;
  eventDate: Date | null;
  autoValidate: boolean;
  durationHours: number | null;
  price: number | null;
  maxParticipants: number | null;
  difficulty: string | null;
};

export async function createActivity(
  payload: CreateActivityPayload,
  coverAsset: ImagePickerAsset | null = null,
) {
  // The cover image (if any) is uploaded within the same POST request.
  const data = await requestWithOptionalImage(
    "/activities",
    "POST",
    payload,
    coverAsset,
  );
  return activitySchema.parse(data);
}
