import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { Client } from "pg";

import * as schema from "./db/schema";
import activitiesRoute from "./features/activities/activities.routes";
import chatsRoute from "./features/chats/chats.routes";
import usersRoute from "./features/users/users.routes";
import { authMiddleware } from "./middleware/auth";
import { createAuth } from "./utils/auth";
import { dbContext, getDb } from "./db";
import feedRoute from "./features/feed/feed.routes";
import { cors } from "hono/cors";
import authRoute from "./features/auth/auth.routes";

type AppEnv = {
  Bindings: {
    POSTGRES_URL: string;
  };
  Variables: {
    db: NodePgDatabase<typeof schema>;
  };
};

const app = new Hono<AppEnv>();

app.use("*", cors());
app.use("*", authMiddleware);

app.use("*", async (c, next) => {
  const postgresUrl = c.env.POSTGRES_URL;
  if (!postgresUrl) {
    throw new Error(
      "POSTGRES_URL n'est pas défini dans les variables d'environnement.",
    );
  }

  const client = new Client({ connectionString: postgresUrl });
  await client.connect();

  const db = drizzle(client, { schema });

  // Wrap the application execution in the AsyncLocalStorage context
  await dbContext.run(db, async () => {
    // Downstream routes and services can now access 'db' using getDb() without prop drilling
    await next();
  });

  // // Clean up: Ensure the database connection is closed after the response is sent.
  // // Using waitUntil allows the Worker to finish this task in the background without delaying the HTTP response.
  // c.executionCtx.waitUntil(client.end());
});

app.on(["POST", "GET"], "/auth/*", (c) =>
  createAuth(getDb()).handler(c.req.raw),
);

app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Meet and Move API",
  });
});
app.route("/auth", authRoute);

app.route("/activities", activitiesRoute);
app.route("/feed", feedRoute);
app.route("/chats", chatsRoute);
app.route("/users", usersRoute);

export default app;
