import { z } from "zod";

export const chatSchema = z.object({
  id: z.uuid(),
  activityId: z.uuid().nullable(),
  type: z.enum(["group", "private"]),
  createdAt: z.string().or(z.date()), // API often returns string for ISO date
});

export const chatsSchema = z.array(chatSchema);

export const messageSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  senderId: z.uuid(),
  content: z.string().nullable(),
  sentAt: z.string().or(z.date()),
});

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
});

export const chatMessageJoinSchema = z.object({
  chats: chatSchema,
  messages: messageSchema,
  users: userSchema,
});

export const chatMessagesJoinSchema = z.array(chatMessageJoinSchema);

export type Chat = z.infer<typeof chatSchema>;
export type ThreadMessageJoined = z.infer<typeof chatMessageJoinSchema>;
