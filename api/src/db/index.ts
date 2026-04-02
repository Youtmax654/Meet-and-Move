import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { AsyncLocalStorage } from "node:async_hooks";
import * as schema from "./schema";

export const dbContext = new AsyncLocalStorage<NodePgDatabase<typeof schema>>();

export function getDb() {
  const db = dbContext.getStore();
  if (!db) {
    throw new Error(
      "getDb() a été appelé en dehors d'une requête HTTP valide.",
    );
  }
  return db;
}
