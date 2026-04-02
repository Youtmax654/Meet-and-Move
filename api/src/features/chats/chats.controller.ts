import { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { createSubscriber, publisher } from "../../db/redis";
import chatsService from "./chats.service";
import { sendMessageBodySchema } from "./chats.schema";

export const getAllChats = async (c: Context) => {
  const chats = await chatsService.getAllChats();

  if (chats.length === 0) {
    return c.json({ error: "No chats found" }, 404);
  }

  return c.json(chats);
};

export const getChatMessagesById = async (c: Context) => {
  const { id } = c.req.param();
  const chat = await chatsService.getChatMessagesById(id);

  if (chat.length === 0) {
    return c.json({ error: "Chat messages not found" }, 404);
  }

  return c.json(chat);
};

export const sendMessage = async (c: Context) => {
  const { id: chatId } = c.req.param();
  const body = await c.req.json();

  const parsed = sendMessageBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid body", details: parsed.error.issues }, 400);
  }

  const { senderId, content } = parsed.data;

  const message = await chatsService.createMessage(chatId, senderId, content);

  // Publish the message to the Redis channel for real-time SSE delivery
  await publisher.publish(
    `chat:${chatId}`,
    JSON.stringify(message),
  );

  return c.json(message, 201);
};

export const streamMessages = async (c: Context) => {
  const { id: chatId } = c.req.param();
  const subscriber = createSubscriber();

  return streamSSE(c, async (stream) => {
    // Subscribe to the Redis channel for this chat
    await subscriber.subscribe(`chat:${chatId}`);

    subscriber.on("message", async (_channel: string, data: string) => {
      await stream.writeSSE({
        data,
        event: "message",
      });
    });

    // Send a heartbeat every 30s to keep the connection alive
    const heartbeat = setInterval(async () => {
      try {
        await stream.writeSSE({ data: "", event: "heartbeat" });
      } catch {
        clearInterval(heartbeat);
      }
    }, 30_000);

    // Cleanup when the client disconnects
    stream.onAbort(() => {
      clearInterval(heartbeat);
      subscriber.unsubscribe(`chat:${chatId}`);
      subscriber.quit();
    });

    // Keep the stream open — wait indefinitely until abort
    await new Promise(() => {});
  });
};
