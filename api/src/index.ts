import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Client } from "pg";

import { dbContext } from "./db";
import * as schema from "./db/schema";
import activitiesRoute from "./features/activities/activities.routes";
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

app.use("*", async (c, next) => {
  const client = new Client({ connectionString: c.env.POSTGRES_URL });
  await client.connect();

  const db = drizzle(client, { schema });

  // Wrap the application execution in the AsyncLocalStorage context
  await dbContext.run(db, async () => {
    // Downstream routes and services can now access 'db' using getDb() without prop drilling
    await next();
  });

  // Clean up: Ensure the database connection is closed after the response is sent.
  // Using waitUntil allows the Worker to finish this task in the background without delaying the HTTP response.
  c.executionCtx.waitUntil(client.end());
});

app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Meet and Move API",
  });
});

app.route("/activities", activitiesRoute);
app.route("/auth", authRoute);

export default app;

