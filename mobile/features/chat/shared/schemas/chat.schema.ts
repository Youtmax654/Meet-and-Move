import { z } from "zod";

const chatTypeSchema = z.enum(["group", "private"]);

export const chatSchema = z.object({
  id: z.uuid(),
  title: z.string().nullable(),
  activityId: z.uuid().nullable(),
  type: chatTypeSchema,
  lastMessage: z.string().nullable(),
  lastMessageSentAt: z.string().or(z.date()).nullable(), // API often returns string for ISO date
  createdAt: z.string().or(z.date()), // API often returns string for ISO date
});

export const chatsSchema = z.array(chatSchema);

export const messageSchema = z.object({
  id: z.uuid(),
  senderId: z.uuid(),
  senderUsername: z.string(),
  content: z.string().nullable(),
  sentAt: z.string().or(z.date()),
  isSelfMessage: z.boolean().optional(),
});

export const messagesSchema = z.array(messageSchema);

export type Chat = z.infer<typeof chatSchema>;
export type Message = z.infer<typeof messageSchema>;
