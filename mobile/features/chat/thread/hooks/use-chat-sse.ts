import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import EventSource from "react-native-sse";
import type { ThreadMessageJoined } from "../../shared/schemas/chat.schema";
import { THREAD_QUERY_KEY } from "./use-thread";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? `http://${process.env.EXPO_PUBLIC_API_URL}`
  : "http://localhost:8787";

/**
 * Hook that manages real-time chat via SSE (Server-Sent Events).
 *
 * - Opens an EventSource to `GET /chats/:id/stream`
 * - Appends incoming messages to the TanStack Query cache
 * - Exposes `sendMessage(content)` which POSTs to the API
 */
export function useChatSse(chatId: string, userId: string) {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/chats/${chatId}/stream`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener("message", (event) => {
      if (!event.data) return;

      try {
        const newMessage = JSON.parse(event.data);

        // Append the new message to the TanStack Query cache
        queryClient.setQueryData<ThreadMessageJoined[]>(
          THREAD_QUERY_KEY(chatId),
          (old) => {
            if (!old) return old;

            // Avoid duplicates (in case we receive our own message back)
            const exists = old.some(
              (item) => item.messages.id === newMessage.id,
            );
            if (exists) return old;

            return [
              ...old,
              {
                chats: old[0]?.chats ?? {
                  id: chatId,
                  activityId: null,
                  type: "group" as const,
                  createdAt: new Date().toISOString(),
                },
                messages: {
                  id: newMessage.id,
                  chatId: newMessage.chatId,
                  senderId: newMessage.senderId,
                  content: newMessage.content,
                  sentAt: newMessage.sentAt,
                  isSelfMessage: newMessage.isSelfMessage,
                },
                users: {
                  id: newMessage.senderId,
                  username: newMessage.senderUsername ?? "Utilisateur",
                },
              },
            ];
          },
        );
      } catch {
        // Ignore malformed messages
      }
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [chatId, queryClient]);

  const sendMessage = useCallback(
    async (content: string) => {
      await api.post(`/chats/${chatId}/messages`, {
        senderId: userId,
        content,
      });
    },
    [chatId, userId],
  );

  return { sendMessage };
}
