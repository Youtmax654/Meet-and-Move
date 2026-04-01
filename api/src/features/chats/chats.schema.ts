import { z } from "zod";

const chatTypeSchema = z.enum(["group", "private"]);

export const chatSchema = z.object({
  id: z.uuid(),
  activityId: z.uuid().nullable(),
  type: chatTypeSchema,
  createdAt: z.date(),
});

export const chatsSchema = z.array(chatSchema);

export const messageSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  senderId: z.uuid(),
  content: z.string().nullable(),
  sentAt: z.date(),
});

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  email: z.string(),
});

export const chatMessageJoinSchema = z.object({
  chats: chatSchema,
  messages: messageSchema,
  users: userSchema,
});

export const chatMessagesJoinSchema = z.array(chatMessageJoinSchema);
