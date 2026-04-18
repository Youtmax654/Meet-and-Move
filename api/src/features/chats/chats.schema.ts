import { z } from "zod";

const chatTypeSchema = z.enum(["group", "private"]);

export const chatIdParamsSchema = z.object({
  id: z.uuid(),
});

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
  content: z.string().trim().min(1).max(2000),
});
