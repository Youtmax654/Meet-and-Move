import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { chatsSchema, type Chat } from "../../shared/schemas/chat.schema";

export const INBOX_QUERY_KEY = ["inbox"] as const;

export function useInbox(type?: "group" | "private") {
  return useQuery<Chat[]>({
    queryKey: [...INBOX_QUERY_KEY, type],
    queryFn: async () => {
      const params = type ? `?type=${type}` : "";
      const { data } = await api.get(`/chats${params}`);
      return chatsSchema.parse(data);
    },
  });
}
