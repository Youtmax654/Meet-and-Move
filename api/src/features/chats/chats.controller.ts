import { Context } from "hono";
import chatsService from "./chats.service";

export const getAllChats = async (c: Context) => {
  const chats = await chatsService.getAllChats();

  if (chats.length === 0) {
    return c.json({ error: "No chats found" }, 404);
  }

  return c.json(chats);
};

export const getChatMessagesById = async (c: Context) => {
  const { id } = c.req.param();
  const chat = await chatsService.getChatMessagesById(id);

  if (chat.length === 0) {
    return c.json({ error: "Chat messages not found" }, 404);
  }

  return c.json(chat);
};
