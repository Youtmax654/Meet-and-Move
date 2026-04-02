import { z } from "zod";

const chatTypeSchema = z.enum(["group", "private"]);

export const chatSchema = z.object({
  id: z.uuid(),
  title: z.string().nullable(),
  activityId: z.uuid().nullable(),
  type: chatTypeSchema,
  lastMessage: z.string().nullable(),
  lastMessageSentAt: z.coerce.date().nullable(),
  createdAt: z.date(),
});

export const chatsSchema = z.array(chatSchema);

export const messageSchema = z.object({
  id: z.uuid(),
  senderId: z.uuid(),
  senderUsername: z.string(),
  content: z.string().nullable(),
  sentAt: z.coerce.date(),
  isSelfMessage: z.boolean().optional(),
});

export const messagesSchema = z.array(messageSchema);

export const sendMessageBodySchema = z.object({
  senderId: z.uuid(),
  content: z.string().min(1),
});
