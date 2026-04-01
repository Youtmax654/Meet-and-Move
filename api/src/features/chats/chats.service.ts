import { asc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import * as schema from "../../db/schema";
import { chatMessagesJoinSchema, chatsSchema } from "./chats.schema";

const chatsService = {
  getAllChats: async () => {
    const result = await getDb().select().from(schema.chats);

    const parsedResult = chatsSchema.parse(result);

    return parsedResult;
  },

  getChatMessagesById: async (id: string) => {
    const result = await getDb()
      .select()
      .from(schema.chats)
      .where(eq(schema.chats.id, id))
      .innerJoin(schema.messages, eq(schema.chats.id, schema.messages.chatId))
      .innerJoin(schema.users, eq(schema.messages.senderId, schema.users.id))
      .orderBy(asc(schema.messages.sentAt));

    const parsedResult = chatMessagesJoinSchema.parse(result);

    return parsedResult;
  },
};

export default chatsService;
