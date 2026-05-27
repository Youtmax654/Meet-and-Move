import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { AsyncLocalStorage } from "node:async_hooks";
import postgres from "postgres";

export const dbStorage = new AsyncLocalStorage<
  PostgresJsDatabase<typeof schema>
>();

// The Proxy will intercept property access on the `db` object and
// return the corresponding database instance from the AsyncLocalStorage.
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get: (_, prop: string | symbol) => {
    const store = dbStorage.getStore();
    if (!store) {
      throw new Error(
        `Accès à la base de données via 'db.${String(
          prop,
        )}' en dehors d'une requête HTTP valide.`,
      );
    }
    return (store as any)[prop];
  },
});

export const createDb = async (url: string) => {
  const client = postgres(url, { prepare: false, max: 1 });
  const instance = drizzle(client, { schema });
  return { instance, client };
};
