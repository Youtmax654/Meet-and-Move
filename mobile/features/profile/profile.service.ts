import { api } from "@/lib/api";
import {
  ProfileData,
  profileSchema,
  userActivitiesSchema,
  UserActivity,
} from "./schemas/profile.schema";

export async function getCurrentUser(): Promise<ProfileData> {
  try {
    const response = await api.get("/users/me");
    return profileSchema.parse(response.data);
  } catch (error) {
    console.error("Error loading profile data:", error);
    throw new Error("Profil indisponible");
  }
}

export async function getCurrentUserActivities(): Promise<UserActivity[]> {
  try {
    const response = await api.get("/users/me/activities");
    return userActivitiesSchema.parse(response.data);
  } catch (error) {
    console.error("Error loading user activities:", error);
    throw new Error("Activités indisponibles");
  }
}
