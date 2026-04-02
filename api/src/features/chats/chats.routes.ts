import { Hono } from "hono";
import {
  getAllChats,
  getChatMessagesById,
  sendMessage,
  streamMessages,
} from "./chats.controller";

const chatsRoute = new Hono();

chatsRoute.get("/", getAllChats);
chatsRoute.get("/:id/messages", getChatMessagesById);
chatsRoute.post("/:id/messages", sendMessage);
chatsRoute.get("/:id/stream", streamMessages);

export default chatsRoute;
