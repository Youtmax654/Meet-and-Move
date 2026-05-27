import { Hono } from "hono";

import activitiesRoute from "./features/activities/activities.routes";
import chatsRoute from "./features/chats/chats.routes";
import usersRoute from "./features/users/users.routes";
import { authMiddleware } from "./middleware/auth";
import feedRoute from "./features/feed/feed.routes";
import { cors } from "hono/cors";
import { auth } from "./utils/auth";
import { dbMiddleware } from "./middleware/db";

type AppEnv = {};

const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: "http://localhost:8081",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use("*", dbMiddleware);
app.use("*", authMiddleware);

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Meet and Move API",
  });
});

app.route("/activities", activitiesRoute);
app.route("/feed", feedRoute);
app.route("/chats", chatsRoute);
app.route("/users", usersRoute);

export default app;
