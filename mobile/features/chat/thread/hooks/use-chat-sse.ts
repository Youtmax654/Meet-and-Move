import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import EventSource from "react-native-sse";
import { Message, messageSchema } from "../../shared/schemas/chat.schema";
import { THREAD_QUERY_KEY } from "./use-thread";
import { authClient, getUserId } from "@/lib/auth-client";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8787";

/**
 * Hook that manages real-time chat via SSE (Server-Sent Events).
 *
 * - Opens an EventSource to `GET /chats/:id/stream`
 * - Appends incoming messages to the TanStack Query cache
 * - Exposes `sendMessage(content)` which POSTs to the API
 */
export function useChatSse(chatId: string) {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    let isMounted = true;

    const connectSse = async () => {
      const cookie = await authClient.getCookie();

      if (!isMounted) return;
      if (!cookie) {
        console.error("Not authenticated, cannot connect to chat SSE");
        return;
      }

      // Used below to flag incoming messages sent by the current user.
      const userId = await getUserId();

      const url = `${API_BASE_URL}/chats/${chatId}/stream`;

      es = new EventSource(url, {
        headers: {
          Cookie: cookie,
        },
      });
      esRef.current = es;

      es.addEventListener("message", (event) => {
        if (!event.data) return;

        try {
          const newMessage = JSON.parse(event.data);

          // Append the new message to the TanStack Query cache
          queryClient.setQueryData<Message[]>(
            THREAD_QUERY_KEY(chatId),
            (old) => {
              if (!old) {
                const parsedMsg = messageSchema.parse(newMessage);
                parsedMsg.isSelfMessage = parsedMsg.senderId === userId;
                return [parsedMsg];
              }

              const parsedMessage = messageSchema.parse(newMessage);

              // Set isSelfMessage correctly before caching
              parsedMessage.isSelfMessage = parsedMessage.senderId === userId;

              // Avoid duplicates (in case we receive our own message back)
              if (old.some((item) => item.id === parsedMessage.id)) return old;

              // Replace the optimistic message if it exists
              const tempIndex = old.findIndex(
                (item) =>
                  item.id.startsWith("temp-") &&
                  item.content === parsedMessage.content &&
                  item.senderId === parsedMessage.senderId,
              );

              if (tempIndex !== -1) {
                const newMessages = [...old];
                newMessages[tempIndex] = parsedMessage;
                return newMessages;
              }

              return [...old, parsedMessage];
            },
          );
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      });
    };

    connectSse();

    return () => {
      isMounted = false;
      if (es) {
        es.close();
      }
      esRef.current = null;
    };
  }, [chatId, queryClient]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userId = await getUserId();
      if (!userId) return;

      // Optimistically add the message to the cache first
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        senderId: userId,
        senderName: "You",
        content,
        sentAt: new Date(),
        isSelfMessage: true,
      };

      // Backup the previous state for rollback
      const previousMessages = queryClient.getQueryData<Message[]>(
        THREAD_QUERY_KEY(chatId),
      );

      queryClient.setQueryData<Message[]>(THREAD_QUERY_KEY(chatId), (old) => {
        if (!old) return [optimisticMessage];
        return [...old, optimisticMessage];
      });

      try {
        await api.post(`/chats/${chatId}/messages`, {
          senderId: userId,
          content,
        });
      } catch (error) {
        // Rollback cache if network request fails
        queryClient.setQueryData<Message[]>(
          THREAD_QUERY_KEY(chatId),
          previousMessages ?? [],
        );
        console.error("Failed to publish message:", error);
        throw error;
      }
    },
    [chatId, queryClient],
  );

  return { sendMessage };
}
