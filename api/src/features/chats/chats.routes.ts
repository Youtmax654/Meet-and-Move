import { Hono } from "hono";
import {
  getChatMessagesById,
  getChats,
  sendMessage,
  streamMessages,
} from "./chats.controller";

const chatsRoute = new Hono();

chatsRoute.get("/", getChats);
chatsRoute.get("/:id/messages", getChatMessagesById);
chatsRoute.post("/:id/messages", sendMessage);
chatsRoute.get("/:id/stream", streamMessages);

export default chatsRoute;
