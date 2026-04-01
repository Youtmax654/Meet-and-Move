import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  chatMessagesJoinSchema,
  type ThreadMessageJoined,
} from "../../shared/schemas/chat.schema";

export const THREAD_QUERY_KEY = (threadId: string) =>
  ["thread", threadId] as const;

export function useThread(threadId: string) {
  return useQuery({
    queryKey: THREAD_QUERY_KEY(threadId),
    queryFn: async () => {
      const { data } = await api.get<ThreadMessageJoined[]>(
        `/chats/${threadId}/messages`,
      );
      return chatMessagesJoinSchema.parse(data);
    },
    enabled: !!threadId,
  });
}
