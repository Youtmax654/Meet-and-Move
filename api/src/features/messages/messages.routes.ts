import { Hono } from "hono";

const messagesRoute = new Hono();

messagesRoute.get("/", (c) => {
    return c.json([
      {
        id: 1,
        content: "Hello Hono!",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        content: "I'm supposed to return connected user messages.",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
});

export default messagesRoute;