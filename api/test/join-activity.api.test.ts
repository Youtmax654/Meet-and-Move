import { beforeEach, describe, expect, it, vi } from "vitest";
import * as dbModule from "../src/db";
import { activityParticipants, chatMembers } from "../src/db/schema";
import activitiesService from "../src/features/activities/activities.service";

type InsertCall = {
  table: unknown;
  values: unknown;
};

function createDbMock(limitResults: unknown[][]) {
  const insertCalls: InsertCall[] = [];

  const db = {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => limitResults.shift() ?? []),
        })),
      })),
    })),
    insert: vi.fn((table: unknown) => ({
      values: vi.fn(async (values: unknown) => {
        insertCalls.push({ table, values });
      }),
    })),
  };

  return { db, insertCalls };
}

describe("activities.service.joinActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds participant and chat member when user joins a chat-backed activity", async () => {
    const { db, insertCalls } = createDbMock([
      [{ maxParticipants: null }],
      [],
      [{ id: "chat-1" }],
      [],
    ]);

    vi.spyOn(dbModule, "getDb").mockReturnValue(db as any);

    const result = await activitiesService.joinActivity("activity-1", "user-1");

    expect(result).toEqual({ success: true });
    expect(insertCalls).toHaveLength(2);
    expect(insertCalls[0].table).toBe(activityParticipants);
    expect(insertCalls[0].values).toMatchObject({
      activityId: "activity-1",
      userId: "user-1",
      status: "accepted",
    });
    expect(insertCalls[1].table).toBe(chatMembers);
    expect(insertCalls[1].values).toMatchObject({
      chatId: "chat-1",
      userId: "user-1",
    });
  });

  it("rejects duplicate joins", async () => {
    const { db, insertCalls } = createDbMock([
      [{ maxParticipants: null }],
      [{ userId: "user-1" }],
    ]);

    vi.spyOn(dbModule, "getDb").mockReturnValue(db as any);

    await expect(
      activitiesService.joinActivity("activity-1", "user-1"),
    ).rejects.toThrow("ALREADY_JOINED");

    expect(insertCalls).toHaveLength(0);
  });

  it("rejects when activity does not exist", async () => {
    const { db, insertCalls } = createDbMock([[]]);

    vi.spyOn(dbModule, "getDb").mockReturnValue(db as any);

    await expect(
      activitiesService.joinActivity("activity-1", "user-1"),
    ).rejects.toThrow("ACTIVITY_NOT_FOUND");

    expect(insertCalls).toHaveLength(0);
  });

  it("rejects when activity is full", async () => {
    const { db, insertCalls } = createDbMock([
      [{ maxParticipants: 1 }],
      [],
      [{ userId: "user-2" }],
    ]);

    vi.spyOn(dbModule, "getDb").mockReturnValue(db as any);

    await expect(
      activitiesService.joinActivity("activity-1", "user-1"),
    ).rejects.toThrow("ACTIVITY_FULL");

    expect(insertCalls).toHaveLength(0);
  });
});
