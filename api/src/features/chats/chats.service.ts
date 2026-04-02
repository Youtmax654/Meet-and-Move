import { and, asc, eq, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "../../db";
import * as schema from "../../db/schema";
import { chatsSchema, messagesSchema } from "./chats.schema";

const chatsService = {
  getChats: async (userId: string) => {
    const otherMembers = alias(schema.chatMembers, "otherMembers");

    const result = await getDb()
      .select({
        id: schema.chats.id,
        title: sql<string>`
          CASE WHEN (${schema.chats.type} = 'group') 
          THEN ${schema.activities.title} 
          ELSE CAST(${schema.users.username} AS VARCHAR) 
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
      .leftJoin(schema.users, eq(otherMembers.userId, schema.users.id))
      .where(eq(schema.chatMembers.userId, userId));

    const parsedResult = chatsSchema.parse(result);

    return parsedResult;
  },

  getChatMessagesById: async (userId: string, id: string) => {
    const result = await getDb()
      .select({
        id: schema.messages.id,
        senderId: schema.messages.senderId,
        senderUsername: schema.users.username,
        content: schema.messages.content,
        sentAt: schema.messages.sentAt,
        isSelfMessage: eq(schema.messages.senderId, userId),
      })
      .from(schema.messages)
      .rightJoin(schema.users, eq(schema.messages.senderId, schema.users.id))
      .innerJoin(schema.chats, eq(schema.messages.chatId, schema.chats.id))
      .where(eq(schema.messages.chatId, id))
      .orderBy(asc(schema.messages.sentAt));

    const parsedResult = messagesSchema.parse(result);

    return parsedResult;
  },

  createMessage: async (chatId: string, senderId: string, content: string) => {
    const [message] = await getDb()
      .insert(schema.messages)
      .values({ chatId, senderId, content })
      .returning();

    return message;
  },
};

export default chatsService;
