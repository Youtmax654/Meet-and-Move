import type { Context, Next } from "hono";
import { auth } from "../utils/auth";

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

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
