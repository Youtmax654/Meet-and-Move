import { createDb, dbStorage } from "../db";
import type { Context, Next } from "hono";

export const dbMiddleware = async (c: Context, next: Next) => {
  const postgresUrl = process.env.POSTGRES_URL!;

  const { instance, client } = await createDb(postgresUrl);

  await dbStorage.run(instance, async () => {
    await next();
  });

  // Clean up: Ensure the database connection is closed after the response is sent.
  // Using waitUntil allows the Worker to finish this task in the background without delaying the HTTP response.
  c.executionCtx.waitUntil(client.end());
};
