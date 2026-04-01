import { Hono } from "hono";
import { getAllChats, getChatMessagesById } from "./chats.controller";

const chatsRoute = new Hono();

chatsRoute.get("/", getAllChats);
chatsRoute.get("/:id/messages", getChatMessagesById);

export default chatsRoute;
