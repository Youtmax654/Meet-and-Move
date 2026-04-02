import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { chatsSchema, type Chat } from "../../shared/schemas/chat.schema";

export const INBOX_QUERY_KEY = ["inbox"] as const;

export function useInbox() {
  return useQuery<Chat[]>({
    queryKey: INBOX_QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get("/chats");
      return chatsSchema.parse(data);
    },
  });
}
