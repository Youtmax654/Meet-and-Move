import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { createSubscriber, publishToRedis } from "../../db/redis";
import { chatIdParamsSchema, sendMessageBodySchema } from "./chats.schema";
import chatsService from "./chats.service";

export const getChats = async (c: Context) => {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const chats = await chatsService.getChats(userId);

  return c.json(chats);
};

export const getChatMessagesById = async (c: Context) => {
  const userId = c.get("userId");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const paramsParsed = chatIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const { id } = paramsParsed.data;

  const chat = await chatsService.getChatMessagesById(userId, id);

  return c.json(chat);
};

export const sendMessage = async (c: Context) => {
  const userId = c.get("userId");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const paramsParsed = chatIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const { id: chatId } = paramsParsed.data;
  const body = await c.req.json();

  const parsed = sendMessageBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid body", details: parsed.error.issues }, 400);
  }

  const { content } = parsed.data;

  const message = await chatsService.createMessage(chatId, userId, content);

  const messageWithSelfInfo = {
    ...message,
    isSelfMessage: message.senderId === userId,
  };

  // Publish the raw message to the Redis channel for real-time SSE delivery
  // The frontend can determine isSelfMessage from the senderId on incoming events
  await publishToRedis(`chat:${chatId}`, JSON.stringify(message));
  return c.json(messageWithSelfInfo, 201);
};

export const streamMessages = async (c: Context) => {
  const userId = c.get("userId");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const paramsParsed = chatIdParamsSchema.safeParse(c.req.param());
  if (!paramsParsed.success) {
    return c.json(
      { error: "Invalid params", details: paramsParsed.error.issues },
      400,
    );
  }

  const { id: chatId } = paramsParsed.data;

  const isMember = await chatsService.checkMembership(chatId, userId);
  if (!isMember) {
    return c.json({ error: "Forbidden: Not a member of this chat" }, 403);
  }

  const subscriber = await createSubscriber();

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
