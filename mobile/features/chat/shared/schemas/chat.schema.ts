import { z } from "zod";

const chatTypeSchema = z.enum(["group", "private"]);

export const chatSchema = z.object({
  id: z.uuid(),
  title: z.string().nullable(),
  activityId: z.uuid().nullable(),
  type: chatTypeSchema,
  lastMessage: z.string().nullable(),
  lastMessageSentAt: z.coerce.date().nullable(), // API often returns string for ISO date
  createdAt: z.coerce.date(), // API often returns string for ISO date
});

export const chatsSchema = z.array(chatSchema);

export const messageSchema = z.object({
  id: z.uuid(),
  senderId: z.uuid(),
  senderName: z.string(),
  content: z.string().nullable(),
  sentAt: z.coerce.date(),
  isSelfMessage: z.boolean().optional(),
});

export const messagesSchema = z.array(messageSchema);

export const sendMessageBodySchema = z.object({
  content: z.string().min(1),
});

export type Chat = z.infer<typeof chatSchema>;
export type Message = z.infer<typeof messageSchema>;
