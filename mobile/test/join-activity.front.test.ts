import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { runJoinActivityFlow } from "../features/experience/experience.service";
import type { Activity } from "../types/activity";

describe("runJoinActivityFlow", () => {
  const joinRequest = vi.fn(async (_activityId: string) => undefined);

  const activity: Activity = {
    id: "activity-123",
    title: "Escalade",
    description: "Test activity",
    participants: [],
    chatId: "chat-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns joined outcome on success", async () => {
    const result = await runJoinActivityFlow({
      activity,
      hasJoined: false,
      joinRequest,
    });

    expect(joinRequest).toHaveBeenCalledWith("activity-123");
    expect(result).toEqual({
      type: "joined",
      successMessage: 'Bravo ! Tu as rejoint l\'activité "Escalade"',
      redirectTo: "/(tabs)",
      redirectDelayMs: 1500,
      shouldInvalidateInbox: true,
    });
  });

  it("returns open-chat when already joined and chat exists", async () => {
    const result = await runJoinActivityFlow({
      activity,
      hasJoined: true,
      joinRequest,
    });

    expect(joinRequest).not.toHaveBeenCalled();
    expect(result).toEqual({ type: "open-chat", chatId: "chat-1" });
  });

  it("returns error when already joined but no chat exists", async () => {
    const result = await runJoinActivityFlow({
      activity: { ...activity, chatId: undefined },
      hasJoined: true,
      joinRequest,
    });

    expect(joinRequest).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: "error",
      message: "La discussion n'est pas encore disponible.",
    });
  });

  it("returns debug message on 401", async () => {
    joinRequest.mockRejectedValueOnce(
      new AxiosError(
        "Unauthorized",
        "401",
        undefined,
        undefined,
        { status: 401, statusText: "Unauthorized", headers: {}, config: { headers: {} as any }, data: {} },
      ),
    );

    const result = await runJoinActivityFlow({
      activity,
      hasJoined: false,
      joinRequest,
    });

    expect(result).toEqual({
      type: "error",
      message:
        "Sélectionne d'abord un utilisateur dans le menu de debug (icône bug) !",
    });
  });

  it("returns API error message when present", async () => {
    joinRequest.mockRejectedValueOnce(
      new AxiosError(
        "Bad Request",
        "400",
        undefined,
        undefined,
        {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          config: { headers: {} as any },
          data: { error: "Tu es déjà inscrit" },
        },
      ),
    );

    const result = await runJoinActivityFlow({
      activity,
      hasJoined: false,
      joinRequest,
    });

    expect(result).toEqual({
      type: "error",
      message: "Tu es déjà inscrit",
    });
  });

  it("returns generic message for unknown errors", async () => {
    joinRequest.mockRejectedValueOnce("boom");

    const result = await runJoinActivityFlow({
      activity,
      hasJoined: false,
      joinRequest,
    });

    expect(result).toEqual({
      type: "error",
      message: "Une erreur est survenue",
    });
  });
});
