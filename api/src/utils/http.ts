import type { Context } from "hono";
import type { ZodType } from "zod";

type ParseResult<T> = { ok: true; data: T } | { ok: false; response: Response };

type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; response: Response };

export function parseParams<T>(
  c: Context,
  schema: ZodType<T>,
  errorMessage = "Invalid params",
): ParseResult<T> {
  const parsed = schema.safeParse(c.req.param());
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        { error: errorMessage, details: parsed.error.issues },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

export async function parseBody<T>(
  c: Context,
  schema: ZodType<T>,
  errorMessage = "Invalid body",
): Promise<ParseResult<T>> {
  const body = await c.req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        { error: errorMessage, details: parsed.error.issues },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

export function requireUserId(
  c: Context,
  errorMessage = "Unauthorized",
): AuthResult {
  const userId = c.get("userId");

  if (!userId) {
    return {
      ok: false,
      response: c.json({ error: errorMessage }, 401),
    };
  }

  return { ok: true, userId };
}
