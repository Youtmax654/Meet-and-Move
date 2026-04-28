import { Activity } from "@/features/home/schemas/feed.schema";

export type JoinOutcome =
  | {
      type: "noop";
    }
  | {
      type: "open-chat";
      chatId: string;
    }
  | {
      type: "joined";
      successMessage: string;
      redirectTo: "/(tabs)";
      redirectDelayMs: number;
      shouldInvalidateInbox: boolean;
    }
  | {
      type: "error";
      message: string;
    };

export interface JoinActivityParams {
  activity?: Activity;
  hasJoined: boolean;
  joinRequest: (activityId: string) => Promise<void>;
}
