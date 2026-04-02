import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Message, messagesSchema } from "../../shared/schemas/chat.schema";

export const THREAD_QUERY_KEY = (threadId: string) =>
  ["thread", threadId] as const;

export function useThread(threadId: string) {
  return useQuery({
    queryKey: THREAD_QUERY_KEY(threadId),
    queryFn: async () => {
      const { data } = await api.get<Message[]>(`/chats/${threadId}/messages`);
      return messagesSchema.parse(data);
    },
    enabled: !!threadId,
  });
}
