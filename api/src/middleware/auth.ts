import type { Context, Next } from "hono";
import { auth } from "../utils/auth";

export const authMiddleware = async (c: Context, next: Next) => {
  console.debug("Raw cookies reçus par Hono :", c.req.header("cookie"));
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  console.debug("Session data:", session);

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    c.set("userId", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session);
  c.set("userId", session.user.id);
  await next();
};
