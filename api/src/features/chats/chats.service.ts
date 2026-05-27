import { and, asc, eq, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { chatsSchema, messagesSchema } from "./chats.schema";

const chatsService = {
  getChats: async (userId: string) => {
    const otherMembers = alias(schema.chatMembers, "otherMembers");

    const result = await db
      .select({
        id: schema.chats.id,
        title: sql<string>`
          CASE WHEN (${schema.chats.type} = 'group') 
          THEN ${schema.activities.title} 
          ELSE CAST(${schema.user.name} AS VARCHAR) 
          END`,
        activityId: schema.chats.activityId,
        type: schema.chats.type,
        lastMessage: sql<string>`(
          SELECT content 
          FROM messages 
          WHERE chat_id = ${schema.chats.id} 
          ORDER BY sent_at DESC 
          LIMIT 1
        )`,
        lastMessageSentAt: sql<Date | null>`(
          SELECT sent_at 
          FROM messages 
          WHERE chat_id = ${schema.chats.id} 
          ORDER BY sent_at DESC 
          LIMIT 1
        )`,
        createdAt: schema.chats.createdAt,
      })
      .from(schema.chats)
      .innerJoin(
        schema.chatMembers,
        eq(schema.chats.id, schema.chatMembers.chatId),
      )
      .leftJoin(
        schema.activities,
        eq(schema.chats.activityId, schema.activities.id),
      )
      .leftJoin(
        otherMembers,
        and(
          eq(schema.chats.id, otherMembers.chatId),
          ne(otherMembers.userId, userId),
          eq(schema.chats.type, "private"),
        ),
      )
      .leftJoin(schema.user, eq(otherMembers.userId, schema.user.id))
      .where(eq(schema.chatMembers.userId, userId));

    const parsedResult = chatsSchema.parse(result);

    return parsedResult;
  },

  getChatMessagesById: async (userId: string, id: string) => {
    const result = await db
      .select({
        id: schema.messages.id,
        senderId: schema.messages.senderId,
        senderName: schema.user.name,
        content: schema.messages.content,
        sentAt: schema.messages.sentAt,
        isSelfMessage: eq(schema.messages.senderId, userId),
      })
      .from(schema.messages)
      .rightJoin(schema.user, eq(schema.messages.senderId, schema.user.id))
      .innerJoin(schema.chats, eq(schema.messages.chatId, schema.chats.id))
      .innerJoin(
        schema.chatMembers,
        and(
          eq(schema.chatMembers.chatId, schema.chats.id),
          eq(schema.chatMembers.chatId, id),
          eq(schema.chatMembers.userId, userId),
        ),
      )
      .where(eq(schema.messages.chatId, id))
      .orderBy(asc(schema.messages.sentAt));

    const parsedResult = messagesSchema.parse(result);

    return parsedResult;
  },

  checkMembership: async (chatId: string, userId: string) => {
    const [membership] = await db
      .select({ id: schema.chatMembers.chatId })
      .from(schema.chatMembers)
      .where(
        and(
          eq(schema.chatMembers.chatId, chatId),
          eq(schema.chatMembers.userId, userId),
        ),
      );
    return !!membership;
  },

  createMessage: async (chatId: string, senderId: string, content: string) => {
    // Check if the user is a member of the chat
    const isMember = await chatsService.checkMembership(chatId, senderId);

    if (!isMember) {
      throw new Error("User is not a member of this chat");
    }

    const [message] = await db
      .insert(schema.messages)
      .values({ chatId, senderId, content })
      .returning();

    const [user] = await db
      .select({ name: schema.user.name })
      .from(schema.user)
      .where(eq(schema.user.id, senderId));

    return {
      ...message,
      senderName: user?.name || "Unknown",
    };
  },
};

export default chatsService;
