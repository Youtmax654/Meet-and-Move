import { AxiosError } from "axios";
import type { JoinActivityParams, JoinOutcome } from "./schemas/experience.types";

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.status === 401) {
    return "Sélectionne d'abord un utilisateur dans le menu de debug (icône bug) !";
  }

  if (
    error instanceof AxiosError &&
    typeof error.response?.data === "object" &&
    error.response?.data !== null &&
    "error" in error.response.data &&
    typeof (error.response.data as { error?: unknown }).error === "string"
  ) {
    return (error.response.data as { error: string }).error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue";
}

export async function runJoinActivityFlow({
  activity,
  hasJoined,
  joinRequest,
}: JoinActivityParams): Promise<JoinOutcome> {
  if (!activity) {
    return { type: "noop" };
  }

  if (hasJoined) {
    if (activity.chatId) {
      return { type: "open-chat", chatId: activity.chatId };
    }

    return {
      type: "error",
      message: "La discussion n'est pas encore disponible.",
    };
  }

  try {
    await joinRequest(activity.id);

    return {
      type: "joined",
      successMessage: `Bravo ! Tu as rejoint l'activité "${activity.title}"`,
      redirectTo: "/(tabs)",
      redirectDelayMs: 1500,
      shouldInvalidateInbox: true,
    };
  } catch (error: unknown) {
    return {
      type: "error",
      message: extractErrorMessage(error),
    };
  }
}
